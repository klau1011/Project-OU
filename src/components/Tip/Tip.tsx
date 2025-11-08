"use client";

import { Tip as TipModel } from "@prisma/client";
import { useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { PencilIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "@/components/ui/button";
import AddEditTipDialog from "./AddEditTipDialog";
import ViewAttachmentDialog from "./ViewAttachmentDialog";

interface TipProps {
  tip: TipModel;
}

export default function Tip({ tip }: TipProps) {
  const { user } = useUser();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAttachmentDialog, setShowAttachmentDialog] = useState(false);

  const tipBelongsToCurrentUser = user?.id === tip.userId;
  const wasUpdated = tip.updatedAt > tip.createdAt;

  // Format once; avoids re-formatting every render
  const displayDate = useMemo(() => {
    const d = wasUpdated ? tip.updatedAt : tip.createdAt;
    return new Date(d).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, [tip.createdAt, tip.updatedAt, wasUpdated]);

  const isoDate = useMemo(() => {
    const d = wasUpdated ? tip.updatedAt : tip.createdAt;
    return new Date(d).toISOString();
  }, [tip.createdAt, tip.updatedAt, wasUpdated]);

  const authorLabel = tipBelongsToCurrentUser ? "you" : "the author";

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-start justify-between gap-3">
            <span className="truncate">{tip.title}</span>

            {tipBelongsToCurrentUser && (
              <button
                type="button"
                onClick={() => setShowEditDialog(true)}
                className="inline-flex rounded-md p-1 outline-none ring-offset-background transition hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Edit tip"
                title="Edit"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
            )}
          </CardTitle>

          <CardDescription className="text-xs">
            <time dateTime={isoDate}>{displayDate}</time>
            {wasUpdated && " (updated)"}
          </CardDescription>
        </CardHeader>

        <CardContent className="whitespace-pre-line">
          {tip.content}

          {tip.attachmentFileUrl && (
            <div className="mt-4">
              <Button
                variant="secondary"
                onClick={() => setShowAttachmentDialog(true)}
              >
                View attachment
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="text-sm italic text-slate-600">
          Tip from {authorLabel}
        </CardFooter>
      </Card>

      <AddEditTipDialog
        open={showEditDialog}
        setOpen={setShowEditDialog}
        tipToEdit={tip}
      />

      {tip.attachmentFileUrl && (
        <ViewAttachmentDialog
          open={showAttachmentDialog}
          setOpen={setShowAttachmentDialog}
          attachmentPath={tip.attachmentFileUrl}
        />
      )}
    </>
  );
}
