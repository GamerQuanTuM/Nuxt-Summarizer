declare module 'pdfjs-dist/legacy/build/pdf' {
  export function getDocument(data: Uint8Array): {
    promise: Promise<PDFDocumentProxy>;
  };

  export interface PDFDocumentProxy {
    numPages: number;
    getPage(pageNumber: number): Promise<PDFPageProxy>;
  }

  export interface PDFPageProxy {
    getViewport(params: { scale: number }): PDFPageViewport;
    getTextContent(): Promise<{
      items: Array<{ str: string }>;
    }>;
    render(params: { canvasContext: CanvasRenderingContext2D; viewport: PDFPageViewport }): { promise: Promise<void> };
  }

  export interface PDFPageViewport {
    width: number;
    height: number;
  }
}
