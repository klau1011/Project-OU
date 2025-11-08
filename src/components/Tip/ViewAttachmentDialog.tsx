"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCallback, useMemo, useRef, useState } from "react";
import { useResizeObserver } from "@wojtekmaj/react-hooks";
import { pdfjs, Document, Page } from "react-pdf";
import { Button } from "@/components/ui/button";

pdfjs.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

interface ViewAttachmentDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  attachmentPath: string;
}

const MAX_WIDTH = 800;

export default function ViewAttachmentDialog({
  open,
  setOpen,
  attachmentPath,
}: ViewAttachmentDialogProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(MAX_WIDTH);
  const [numPages, setNumPages] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const entry = entries[0];
    if (!entry) return;
    setContainerWidth(Math.min(entry.contentRect.width, MAX_WIDTH));
  }, []);

  useResizeObserver(containerRef.current, {}, onResize);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
    setErr(null);
  }

  function onDocumentLoadError(error: Error) {
    setErr(error.message || "Failed to load PDF");
    setLoading(false);
  }

  const pages = useMemo(
    () =>
      Array.from({ length: numPages }, (_, idx) => idx + 1),
    [numPages]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[95vh] overflow-y-auto lg:max-w-screen-lg">
        <DialogHeader className="flex flex-row items-center justify-between gap-3">
          <DialogTitle>Attached file</DialogTitle>
          <div className="flex items-center gap-2">
            {attachmentPath && (
              <a
                href={attachmentPath}
                target="_blank"
                rel="noreferrer"
                className="text-sm underline underline-offset-2"
                aria-label="Download"
              >
                Download
              </a>
            )}
          </div>
        </DialogHeader>

        <div ref={containerRef}>
          <Document
            file={attachmentPath}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="py-8 text-center text-sm text-muted-foreground">
                Loading PDF…
              </div>
            }
            // We’re not rendering text/annotation layers for a cleaner preview.
            options={{ cMapUrl: "/cmaps/", standardFontDataUrl: "/standard_fonts/" }}
          >
            {loading && !err && (
              <div className="py-4 text-center text-xs text-muted-foreground">
                Preparing pages…
              </div>
            )}

            {err && (
              <div className="py-8 text-center text-sm text-red-600">
                {err}
              </div>
            )}

            {!loading && !err && pages.map((pageNumber) => (
              <div key={pageNumber} className="mb-6 flex justify-center">
                <Page
                  pageNumber={pageNumber}
                  width={containerWidth}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                />
              </div>
            ))}
          </Document>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
