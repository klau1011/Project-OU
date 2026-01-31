"use client";

import { Tip as TipModel } from "@prisma/client";
import { useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { PencilIcon, Calendar, User, Paperclip } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

  return (
    <>
      <Card className="group flex flex-col h-full hover:shadow-lg hover:border-primary/30 transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {tip.title}
            </CardTitle>

            {tipBelongsToCurrentUser && (
              <button
                type="button"
                onClick={() => setShowEditDialog(true)}
                className="inline-flex shrink-0 rounded-md p-1.5 outline-none ring-offset-background transition hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Edit tip"
                title="Edit"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
            )}
          </div>

          <CardDescription className="flex items-center gap-2 text-xs">
            <Calendar className="w-3 h-3" />
            <time dateTime={isoDate} suppressHydrationWarning>{displayDate}</time>
            {wasUpdated && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                Updated
              </Badge>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1">
          <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-6">
            {tip.content}
          </p>

          {tip.attachmentFileUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAttachmentDialog(true)}
              className="mt-4"
            >
              <Paperclip className="w-3 h-3 mr-2" />
              View attachment
            </Button>
          )}
        </CardContent>

        <CardFooter className="pt-3 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <User className="w-3 h-3" />
            <span>{tipBelongsToCurrentUser ? "You" : "Community member"}</span>
          </div>
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
