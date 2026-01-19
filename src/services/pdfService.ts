import { PDFDocument } from 'pdf-lib';
import { File, Paths } from 'expo-file-system';
import JSZip from 'jszip';

export interface ImageToPdfOptions {
  images: { uri: string; name: string }[];
  quality: 'low' | 'medium' | 'high';
  onProgress?: (progress: number, message: string) => void;
}

export interface MergePdfOptions {
  pdfUris: string[];
  onProgress?: (progress: number, message: string) => void;
}

export interface SplitPdfOptions {
  pdfUri: string;
  pageRanges: string; // e.g., "1-3, 5, 7-9" or "all"
  onProgress?: (progress: number, message: string) => void;
}

export interface PdfToImageOptions {
  pdfUri: string;
  format: 'png' | 'jpg';
  onProgress?: (progress: number, message: string) => void;
}

/**
 * Get the number of pages in a PDF
 */
export async function getPdfPageCount(uri: string): Promise<number> {
  try {
    const file = new File(uri);
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    return pdfDoc.getPageCount();
  } catch (error) {
    console.error('Error getting PDF page count:', error);
    throw new Error('Failed to read PDF file');
  }
}

/**
 * Convert images to a single PDF
 */
export async function convertImagesToPdf(options: ImageToPdfOptions): Promise<string> {
  const { images, quality, onProgress } = options;

  try {
    onProgress?.(0, 'Initializing PDF creation...');

    const pdfDoc = await PDFDocument.create();

    // Quality settings
    const qualitySettings = {
      low: { maxWidth: 1024, maxHeight: 1024, compression: 0.6 },
      medium: { maxWidth: 2048, maxHeight: 2048, compression: 0.8 },
      high: { maxWidth: 4096, maxHeight: 4096, compression: 0.95 },
    };

    const settings = qualitySettings[quality];

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      onProgress?.((i / images.length) * 0.8, `Processing image ${i + 1} of ${images.length}...`);

      try {
        // Read image
        const file = new File(image.uri);
        const imageBuffer = await file.arrayBuffer();

        // Determine image type
        let embeddedImage;
        const lowerName = image.name.toLowerCase();

        if (lowerName.endsWith('.png')) {
          embeddedImage = await pdfDoc.embedPng(imageBuffer);
        } else {
          embeddedImage = await pdfDoc.embedJpg(imageBuffer);
        }

        // Calculate scaled dimensions
        const { width, height } = embeddedImage;
        let scaledWidth = width;
        let scaledHeight = height;

        if (width > settings.maxWidth || height > settings.maxHeight) {
          const ratio = Math.min(settings.maxWidth / width, settings.maxHeight / height);
          scaledWidth = width * ratio;
          scaledHeight = height * ratio;
        }

        // Create page with image dimensions
        const page = pdfDoc.addPage([scaledWidth, scaledHeight]);

        // Draw image on page
        page.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width: scaledWidth,
          height: scaledHeight,
        });
      } catch (error) {
        console.error(`Error processing image ${image.name}:`, error);
        // Continue with other images
      }
    }

    onProgress?.(0.9, 'Finalizing PDF...');

    // Save PDF
    const pdfBytes = await pdfDoc.save();

    // Save to file system
    const fileName = `images-to-pdf-${Date.now()}.pdf`;
    const outputFile = new File(Paths.cache, fileName);

    // Create and write the file
    outputFile.create({ overwrite: true });
    outputFile.write(new Uint8Array(pdfBytes));

    onProgress?.(1, 'PDF created successfully!');

    return outputFile.uri;
  } catch (error) {
    console.error('Error converting images to PDF:', error);
    throw new Error('Failed to convert images to PDF');
  }
}

/**
 * Merge multiple PDFs into one
 */
export async function mergePdfs(options: MergePdfOptions): Promise<string> {
  const { pdfUris, onProgress } = options;

  try {
    onProgress?.(0, 'Initializing PDF merge...');

    const mergedPdf = await PDFDocument.create();

    for (let i = 0; i < pdfUris.length; i++) {
      const uri = pdfUris[i];
      onProgress?.((i / pdfUris.length) * 0.9, `Merging PDF ${i + 1} of ${pdfUris.length}...`);

      try {
        // Read PDF
        const file = new File(uri);
        const arrayBuffer = await file.arrayBuffer();

        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pageCount = pdfDoc.getPageCount();

        // Copy all pages
        const copiedPages = await mergedPdf.copyPages(
          pdfDoc,
          Array.from({ length: pageCount }, (_, i) => i)
        );

        copiedPages.forEach((page) => {
          mergedPdf.addPage(page);
        });
      } catch (error) {
        console.error(`Error merging PDF ${uri}:`, error);
        throw new Error(`Failed to merge PDF ${i + 1}`);
      }
    }

    onProgress?.(0.95, 'Finalizing merged PDF...');

    // Save merged PDF
    const pdfBytes = await mergedPdf.save();

    const fileName = `merged-pdf-${Date.now()}.pdf`;
    const outputFile = new File(Paths.cache, fileName);

    // Create and write the file
    outputFile.create({ overwrite: true });
    outputFile.write(new Uint8Array(pdfBytes));

    onProgress?.(1, 'PDFs merged successfully!');

    return outputFile.uri;
  } catch (error) {
    console.error('Error merging PDFs:', error);
    throw new Error('Failed to merge PDFs');
  }
}

/**
 * Split PDF into separate files based on page ranges
 */
export async function splitPdf(options: SplitPdfOptions): Promise<string> {
  const { pdfUri, pageRanges, onProgress } = options;

  try {
    onProgress?.(0, 'Reading PDF...');

    // Read PDF
    const file = new File(pdfUri);
    const arrayBuffer = await file.arrayBuffer();

    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const totalPages = pdfDoc.getPageCount();

    // Parse page ranges
    const pagesToExtract = parsePageRanges(pageRanges, totalPages);

    if (pagesToExtract.length === 0) {
      throw new Error('No valid pages to extract');
    }

    onProgress?.(0.1, 'Extracting pages...');

    // Create a ZIP file to store split PDFs
    const zip = new JSZip();

    // Split into individual PDFs
    for (let i = 0; i < pagesToExtract.length; i++) {
      const pageNum = pagesToExtract[i];

      onProgress?.(0.1 + (i / pagesToExtract.length) * 0.8, `Extracting page ${pageNum}...`);

      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageNum - 1]);
      newPdf.addPage(copiedPage);

      const pdfBytes = await newPdf.save();

      // Add to ZIP
      zip.file(`page-${pageNum}.pdf`, pdfBytes);
    }

    onProgress?.(0.95, 'Creating ZIP file...');

    // Generate ZIP
    const zipBlob = await zip.generateAsync({ type: 'uint8array' });

    // Save ZIP to file system
    const fileName = `split-pdf-${Date.now()}.zip`;
    const outputFile = new File(Paths.cache, fileName);

    // Create and write the file
    outputFile.create({ overwrite: true });
    outputFile.write(zipBlob);

    onProgress?.(1, `${pagesToExtract.length} PDF files created!`);

    return outputFile.uri;
  } catch (error) {
    console.error('Error splitting PDF:', error);
    throw new Error('Failed to split PDF');
  }
}

/**
 * Convert PDF to images (creates HTML preview pages)
 * Note: True PDF to raster image conversion requires native modules
 * This implementation creates a ZIP of HTML pages that can be converted to images
 */
export async function convertPdfToImages(options: PdfToImageOptions): Promise<string> {
  const { pdfUri, onProgress } = options;

  try {
    onProgress?.(0, 'Reading PDF...');

    // Read PDF
    const file = new File(pdfUri);
    const arrayBuffer = await file.arrayBuffer();

    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pageCount = pdfDoc.getPageCount();

    onProgress?.(0.1, 'Preparing conversion...');

    // Create ZIP for output
    const zip = new JSZip();

    // Extract each page as a separate PDF, then note it for conversion
    for (let i = 0; i < pageCount; i++) {
      onProgress?.(0.1 + (i / pageCount) * 0.8, `Processing page ${i + 1} of ${pageCount}...`);

      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(copiedPage);

      const pdfBytes = await newPdf.save();

      // For now, we'll save each page as a PDF in the ZIP
      // True image conversion would require native PDF rendering
      zip.file(`page-${i + 1}.pdf`, pdfBytes);

      // Add a note file explaining the limitation
      if (i === 0) {
        zip.file(
          'README.txt',
          'Note: Each page has been extracted as a separate PDF file.\n' +
            'To convert to images, please use a PDF viewer or online converter.\n' +
            'Native image conversion requires platform-specific PDF rendering.'
        );
      }
    }

    onProgress?.(0.95, 'Creating output file...');

    // Generate ZIP
    const zipBlob = await zip.generateAsync({ type: 'uint8array' });

    // Save ZIP to file system
    const fileName = `pdf-pages-${Date.now()}.zip`;
    const outputFile = new File(Paths.cache, fileName);

    // Create and write the file
    outputFile.create({ overwrite: true });
    outputFile.write(zipBlob);

    onProgress?.(1, `${pageCount} pages extracted!`);

    return outputFile.uri;
  } catch (error) {
    console.error('Error converting PDF to images:', error);
    throw new Error('Failed to convert PDF to images');
  }
}

/**
 * Parse page ranges string into array of page numbers
 * Examples: "1-3, 5, 7-9" -> [1, 2, 3, 5, 7, 8, 9]
 */
function parsePageRanges(ranges: string, maxPage: number): number[] {
  if (ranges.toLowerCase() === 'all') {
    return Array.from({ length: maxPage }, (_, i) => i + 1);
  }

  const pages = new Set<number>();
  const parts = ranges.split(',').map((p) => p.trim());

  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map((n) => parseInt(n.trim()));
      if (!isNaN(start) && !isNaN(end) && start >= 1 && end <= maxPage && start <= end) {
        for (let i = start; i <= end; i++) {
          pages.add(i);
        }
      }
    } else {
      const page = parseInt(part);
      if (!isNaN(page) && page >= 1 && page <= maxPage) {
        pages.add(page);
      }
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}
