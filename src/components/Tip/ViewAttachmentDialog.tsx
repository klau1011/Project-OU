"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCallback, useState } from "react";
import { useResizeObserver } from "@wojtekmaj/react-hooks";
import { pdfjs, Document, Page } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

interface ViewAttachmentDialogInterface {
  open: boolean;
  setOpen: (open: boolean) => void;
  attachmentPath: string;
}
const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

const resizeObserverOptions = {};

const maxWidth = 800;

type PDFFile = string | File | null;

const ViewAttachmentDialog = ({
  open,
  setOpen,
  attachmentPath,
}: ViewAttachmentDialogInterface) => {
  const [numPages, setNumPages] = useState<number>();
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>();

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={"max-h-screen overflow-y-scroll lg:max-w-screen-lg"}
        >
          <DialogHeader>
            <DialogTitle>Attached file</DialogTitle>
          </DialogHeader>
          <Document
            file={attachmentPath}
            onLoadSuccess={onDocumentLoadSuccess}
            options={options}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={
                  containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth
                }
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            ))}
          </Document>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewAttachmentDialog;
