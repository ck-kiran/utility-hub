import * as ImageManipulator from 'expo-image-manipulator';
import { File, Paths } from 'expo-file-system';

export interface ResizeImageOptions {
  imageUri: string;
  width?: number;
  height?: number;
  preset?: 'small' | 'medium' | 'large';
  maintainAspectRatio?: boolean;
  quality?: number;
  onProgress?: (progress: number, message: string) => void;
}

export interface ConvertImageOptions {
  imageUri: string;
  format: 'jpeg' | 'png';
  quality?: number;
  onProgress?: (progress: number, message: string) => void;
}

export interface CompressImageOptions {
  imageUri: string;
  quality: number;
  onProgress?: (progress: number, message: string) => void;
}

export interface CropImageOptions {
  imageUri: string;
  cropArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  onProgress?: (progress: number, message: string) => void;
}

export interface ImageInfo {
  width: number;
  height: number;
  size: number;
  uri: string;
}

// Preset dimensions for resizing
const RESIZE_PRESETS = {
  small: { width: 640, height: 480 },
  medium: { width: 1280, height: 720 },
  large: { width: 1920, height: 1080 },
};

/**
 * Get image dimensions and info
 */
export async function getImageInfo(uri: string): Promise<ImageInfo> {
  try {
    const file = new File(uri);
    const arrayBuffer = await file.arrayBuffer();
    const size = arrayBuffer.byteLength;

    // Get dimensions from manipulated image (this is a workaround)
    // In a real app, you might want to use expo-image or react-native-image-size
    return {
      width: 0, // Will be calculated from actual manipulation
      height: 0,
      size,
      uri,
    };
  } catch (error) {
    console.error('Error getting image info:', error);
    throw new Error('Failed to read image information');
  }
}

/**
 * Resize an image with specified dimensions or preset
 */
export async function resizeImage(options: ResizeImageOptions): Promise<string> {
  const { imageUri, width, height, preset, quality = 0.9, onProgress } = options;

  try {
    onProgress?.(0, 'Loading image...');

    let targetWidth = width;
    let targetHeight = height;

    // Use preset if provided
    if (preset && RESIZE_PRESETS[preset]) {
      targetWidth = RESIZE_PRESETS[preset].width;
      targetHeight = RESIZE_PRESETS[preset].height;
    }

    if (!targetWidth && !targetHeight) {
      throw new Error('Either width, height, or preset must be provided');
    }

    onProgress?.(0.3, 'Resizing image...');

    const actions: ImageManipulator.Action[] = [];

    // Add resize action
    if (targetWidth || targetHeight) {
      actions.push({
        resize: {
          width: targetWidth,
          height: targetHeight,
        },
      });
    }

    onProgress?.(0.6, 'Processing...');

    // Manipulate image
    const result = await ImageManipulator.manipulateAsync(imageUri, actions, {
      compress: quality,
      format: ImageManipulator.SaveFormat.PNG,
    });

    onProgress?.(0.9, 'Saving image...');

    // Copy to cache directory with a permanent name
    const fileName = `resized-${Date.now()}.png`;
    const outputFile = new File(Paths.cache, fileName);

    // Read the manipulated image and save it
    const manipulatedFile = new File(result.uri);
    const imageData = await manipulatedFile.arrayBuffer();

    outputFile.create({ overwrite: true });
    outputFile.write(new Uint8Array(imageData));

    onProgress?.(1, 'Image resized successfully!');

    return outputFile.uri;
  } catch (error) {
    console.error('Error resizing image:', error);
    throw new Error('Failed to resize image');
  }
}

/**
 * Convert image to specified format
 */
export async function convertImage(options: ConvertImageOptions): Promise<string> {
  const { imageUri, format, quality = 0.9, onProgress } = options;

  try {
    onProgress?.(0, 'Loading image...');

    const saveFormat =
      format === 'jpeg' ? ImageManipulator.SaveFormat.JPEG : ImageManipulator.SaveFormat.PNG;

    onProgress?.(0.4, `Converting to ${format.toUpperCase()}...`);

    // Convert image
    const result = await ImageManipulator.manipulateAsync(
      imageUri,
      [], // No transformations, just format conversion
      {
        compress: quality,
        format: saveFormat,
      }
    );

    onProgress?.(0.8, 'Saving converted image...');

    // Copy to cache directory
    const extension = format === 'jpeg' ? 'jpg' : 'png';
    const fileName = `converted-${Date.now()}.${extension}`;
    const outputFile = new File(Paths.cache, fileName);

    // Read the manipulated image and save it
    const manipulatedFile = new File(result.uri);
    const imageData = await manipulatedFile.arrayBuffer();

    outputFile.create({ overwrite: true });
    outputFile.write(new Uint8Array(imageData));

    onProgress?.(1, `Image converted to ${format.toUpperCase()} successfully!`);

    return outputFile.uri;
  } catch (error) {
    console.error('Error converting image:', error);
    throw new Error('Failed to convert image');
  }
}

/**
 * Compress image with specified quality
 */
export async function compressImage(options: CompressImageOptions): Promise<string> {
  const { imageUri, quality, onProgress } = options;

  try {
    onProgress?.(0, 'Loading image...');

    if (quality < 0 || quality > 1) {
      throw new Error('Quality must be between 0 and 1');
    }

    onProgress?.(0.4, 'Compressing image...');

    // Compress image
    const result = await ImageManipulator.manipulateAsync(
      imageUri,
      [], // No transformations, just compression
      {
        compress: quality,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    onProgress?.(0.8, 'Saving compressed image...');

    // Copy to cache directory
    const fileName = `compressed-${Date.now()}.jpg`;
    const outputFile = new File(Paths.cache, fileName);

    // Read the manipulated image and save it
    const manipulatedFile = new File(result.uri);
    const imageData = await manipulatedFile.arrayBuffer();

    outputFile.create({ overwrite: true });
    outputFile.write(new Uint8Array(imageData));

    onProgress?.(1, 'Image compressed successfully!');

    return outputFile.uri;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw new Error('Failed to compress image');
  }
}

/**
 * Batch resize multiple images
 */
export async function batchResizeImages(
  imageUris: string[],
  options: Omit<ResizeImageOptions, 'imageUri' | 'onProgress'>,
  onProgress?: (current: number, total: number, message: string) => void
): Promise<string[]> {
  const results: string[] = [];

  for (let i = 0; i < imageUris.length; i++) {
    const uri = imageUris[i];
    onProgress?.(i + 1, imageUris.length, `Resizing image ${i + 1} of ${imageUris.length}...`);

    const result = await resizeImage({
      ...options,
      imageUri: uri,
    });

    results.push(result);
  }

  return results;
}

/**
 * Crop an image based on specified crop area
 */
export async function cropImage(options: CropImageOptions): Promise<string> {
  const { imageUri, cropArea, onProgress } = options;

  try {
    onProgress?.(0, 'Loading image...');

    // Validate crop area
    if (cropArea.width <= 0 || cropArea.height <= 0) {
      throw new Error('Invalid crop dimensions');
    }

    onProgress?.(0.3, 'Cropping image...');

    const actions: ImageManipulator.Action[] = [
      {
        crop: {
          originX: cropArea.x,
          originY: cropArea.y,
          width: cropArea.width,
          height: cropArea.height,
        },
      },
    ];

    onProgress?.(0.6, 'Processing...');

    // Crop image
    const result = await ImageManipulator.manipulateAsync(imageUri, actions, {
      compress: 1,
      format: ImageManipulator.SaveFormat.PNG,
    });

    onProgress?.(0.9, 'Saving cropped image...');

    // Copy to cache directory
    const fileName = `cropped-${Date.now()}.png`;
    const outputFile = new File(Paths.cache, fileName);

    // Read the manipulated image and save it
    const manipulatedFile = new File(result.uri);
    const imageData = await manipulatedFile.arrayBuffer();

    outputFile.create({ overwrite: true });
    outputFile.write(new Uint8Array(imageData));

    onProgress?.(1, 'Image cropped successfully!');

    return outputFile.uri;
  } catch (error) {
    console.error('Error cropping image:', error);
    throw new Error('Failed to crop image');
  }
}

/**
 * Batch convert multiple images
 */
export async function batchConvertImages(
  imageUris: string[],
  options: Omit<ConvertImageOptions, 'imageUri' | 'onProgress'>,
  onProgress?: (current: number, total: number, message: string) => void
): Promise<string[]> {
  const results: string[] = [];

  for (let i = 0; i < imageUris.length; i++) {
    const uri = imageUris[i];
    onProgress?.(i + 1, imageUris.length, `Converting image ${i + 1} of ${imageUris.length}...`);

    const result = await convertImage({
      ...options,
      imageUri: uri,
    });

    results.push(result);
  }

  return results;
}
