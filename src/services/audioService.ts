import { File } from 'expo-file-system';

export interface TranscribeAudioOptions {
  audioUri: string;
  language?: string;
  onProgress?: (progress: number, message: string) => void;
}

export interface TranscriptionResult {
  text: string;
  language?: string;
  duration?: number;
}

/**
 * Transcribe audio using OpenAI Whisper API
 */
export async function transcribeAudio(
  options: TranscribeAudioOptions
): Promise<TranscriptionResult> {
  const { audioUri, language = 'en', onProgress } = options;

  try {
    onProgress?.(0, 'Preparing audio file...');

    // Read the audio file
    const file = new File(audioUri);
    const audioData = await file.arrayBuffer();

    onProgress?.(0.2, 'Uploading to Whisper API...');

    // Get API key from environment or configuration
    // In production, this should be stored securely
    const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';

    if (!apiKey) {
      throw new Error(
        'OpenAI API key not configured. Please set EXPO_PUBLIC_OPENAI_API_KEY in your .env file'
      );
    }

    // Convert ArrayBuffer to Blob for FormData
    const audioBlob = new Blob([audioData], { type: 'audio/mp4' });

    // Prepare form data
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.m4a');
    formData.append('model', 'whisper-1');
    if (language && language !== 'auto') {
      formData.append('language', language);
    }

    onProgress?.(0.4, 'Transcribing audio...');

    // Call Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `Whisper API error: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    onProgress?.(0.8, 'Processing transcription...');

    const result = await response.json();

    onProgress?.(1, 'Transcription complete!');

    return {
      text: result.text,
      language: result.language,
      duration: result.duration,
    };
  } catch (error) {
    console.error('Error transcribing audio:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to transcribe audio');
  }
}

/**
 * Get supported languages for transcription
 */
export function getSupportedLanguages() {
  return [
    { code: 'auto', name: 'Auto Detect' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'nl', name: 'Dutch' },
    { code: 'pl', name: 'Polish' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'tr', name: 'Turkish' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'th', name: 'Thai' },
  ];
}

/**
 * Estimate transcription cost (based on OpenAI pricing)
 * Current rate: $0.006 per minute
 */
export function estimateTranscriptionCost(durationSeconds: number): number {
  const minutes = durationSeconds / 60;
  const costPerMinute = 0.006;
  return Math.ceil(minutes * costPerMinute * 100) / 100; // Round up to 2 decimals
}
