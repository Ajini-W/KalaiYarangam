"use client";

import * as React from "react";
import { 
  ZoomIn, 
  ZoomOut, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Loader2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "./Button";

type PdfJsLib = typeof import("pdfjs-dist");
type PdfLoadingTask = ReturnType<PdfJsLib["getDocument"]>;
type PdfDocument = Awaited<PdfLoadingTask["promise"]>;

// Initialize pdf.js worker
if (typeof window !== "undefined") {
  import("pdfjs-dist").then((pdfjs) => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  });
}

export interface PdfViewerProps {
  file: string | File | ArrayBuffer;
  className?: string;
  onError?: (error: Error) => void;
}

export function PdfViewer({ file, className, onError }: PdfViewerProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [pdfDoc, setPdfDoc] = React.useState<PdfDocument | null>(null);
  const [pageNum, setPageNum] = React.useState(1);
  const [pageRendering, setPageRendering] = React.useState(false);
  const [pageNumPending, setPageNumPending] = React.useState<number | null>(null);
  const [scale, setScale] = React.useState(1.0);
  const [numPages, setNumPages] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const renderPage = React.useCallback(
    async (num: number) => {
      setPageRendering(true);
      setError(null);

      try {
        if (!pdfDoc) return;
        const page = await pdfDoc.getPage(num);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const viewport = page.getViewport({ scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
        setPageRendering(false);

        if (pageNumPending !== null) {
          setPageNumPending(null);
          renderPage(pageNumPending);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to render page";
        setError(message);
        setPageRendering(false);
        onError?.(err instanceof Error ? err : new Error(message));
      }
    },
    [pdfDoc, scale, pageNumPending, onError]
  );

  const queueRenderPage = React.useCallback(
    (num: number) => {
      if (pageRendering) {
        setPageNumPending(num);
      } else {
        renderPage(num);
      }
    },
    [pageRendering, renderPage]
  );

  const onPrevPage = React.useCallback(() => {
    if (pageNum <= 1) return;
    setPageNum((prev) => prev - 1);
    queueRenderPage(pageNum - 1);
  }, [pageNum, queueRenderPage]);

  const onNextPage = React.useCallback(() => {
    if (pageNum >= numPages) return;
    setPageNum((prev) => prev + 1);
    queueRenderPage(pageNum + 1);
  }, [pageNum, numPages, queueRenderPage]);

  const onZoomIn = React.useCallback(() => {
    setScale((prev) => Math.min(prev + 0.25, 3.0));
  }, []);

  const onZoomOut = React.useCallback(() => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  }, []);

  const onDownload = React.useCallback(async () => {
    try {
      let blob: Blob;
      
      if (typeof file === "string") {
        const response = await fetch(file);
        blob = await response.blob();
      } else if (file instanceof File) {
        blob = file;
      } else if (file instanceof ArrayBuffer) {
        blob = new Blob([file], { type: "application/pdf" });
      } else {
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `certificate-${Date.now()}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to download PDF";
      setError(message);
      onError?.(err instanceof Error ? err : new Error(message));
    }
  }, [file, onError]);

  // Load PDF document
  React.useEffect(() => {
    let mounted = true;

    const loadPdf = async () => {
      setLoading(true);
      setError(null);

      try {
        const pdfjs = await import("pdfjs-dist");
        let loadingTask: PdfLoadingTask;

        if (typeof file === "string") {
          loadingTask = pdfjs.getDocument(file);
        } else if (file instanceof File) {
          const arrayBuffer = await file.arrayBuffer();
          loadingTask = pdfjs.getDocument(arrayBuffer);
        } else if (file instanceof ArrayBuffer) {
          loadingTask = pdfjs.getDocument(file);
        } else {
          throw new Error("Invalid file type");
        }

        const pdf = await loadingTask.promise;
        
        if (!mounted) return;

        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setPageNum(1);
        setLoading(false);
        
        // Render first page
        const page = await pdf.getPage(1);
        const canvas = canvasRef.current;
        if (canvas && mounted) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            const viewport = page.getViewport({ scale });
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({ canvasContext: ctx, viewport }).promise;
          }
        }
      } catch (err) {
        if (!mounted) return;
        const message = err instanceof Error ? err.message : "Failed to load PDF";
        setError(message);
        setLoading(false);
        onError?.(err instanceof Error ? err : new Error(message));
      }
    };

    loadPdf();

    return () => {
      mounted = false;
    };
  }, [file, scale, onError]);

  // Re-render page when scale changes
  React.useEffect(() => {
    if (pdfDoc && !loading) {
      queueRenderPage(pageNum);
    }
  }, [scale, pdfDoc, loading, pageNum, queueRenderPage]);

  if (loading) {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-4 p-8", className)}>
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-sm text-text-secondary">Loading PDF...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-4 p-8", className)}>
        <AlertCircle className="text-danger" size={32} />
        <p className="text-sm text-text-secondary">{error}</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-border bg-surface-raised p-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomOut}
            disabled={scale <= 0.5}
            aria-label="Zoom out"
          >
            <ZoomOut size={16} />
          </Button>
          <span className="min-w-[3rem] text-center text-sm font-medium text-text-primary">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomIn}
            disabled={scale >= 3.0}
            aria-label="Zoom in"
          >
            <ZoomIn size={16} />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrevPage}
            disabled={pageNum <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </Button>
          <span className="min-w-[4rem] text-center text-sm text-text-secondary">
            {pageNum} / {numPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNextPage}
            disabled={pageNum >= numPages}
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onDownload}
          leftIcon={<Download size={14} />}
        >
          Download
        </Button>
      </div>

      {/* Canvas Container */}
      <div className="overflow-auto rounded-[var(--radius-md)] border border-border bg-surface-overlay">
        <canvas
          ref={canvasRef}
          className="mx-auto block"
          style={{ maxHeight: "70vh" }}
        />
      </div>
    </div>
  );
}
