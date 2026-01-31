"use client";

import { Tip as TipModel, TipVote } from "@prisma/client";
import { useMemo, useState, useTransition, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { PencilIcon, Calendar, User, Paperclip, ThumbsUp, ChevronDown } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AddEditTipDialog from "./AddEditTipDialog";
import ViewAttachmentDialog from "./ViewAttachmentDialog";
import { toggleUpvote } from "@/actions/tips";
import { cn } from "@/lib/utils";

type TipWithVotes = TipModel & {
  upvotes: TipVote[];
  _count?: { upvotes: number };
};

interface TipProps {
  tip: TipWithVotes;
}

export default function Tip({ tip }: TipProps) {
  const { user } = useUser();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAttachmentDialog, setShowAttachmentDialog] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [optimisticUpvoted, setOptimisticUpvoted] = useState<boolean | null>(null);
  const [optimisticCount, setOptimisticCount] = useState<number | null>(null);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const tipBelongsToCurrentUser = user?.id === tip.userId;
  const wasUpdated = tip.updatedAt > tip.createdAt;

  // Check if user has upvoted
  const hasUpvoted = optimisticUpvoted ?? tip.upvotes?.some((v) => v.userId === user?.id) ?? false;
  const upvoteCount = optimisticCount ?? tip._count?.upvotes ?? tip.upvotes?.length ?? 0;

  // Check if content overflows
  useEffect(() => {
    const el = contentRef.current;
    if (el) {
      setIsOverflowing(el.scrollHeight > el.clientHeight);
    }
  }, [tip.content]);

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

  const handleUpvote = () => {
    if (!user) return;

    // Optimistic update
    const newUpvoted = !hasUpvoted;
    const newCount = newUpvoted ? upvoteCount + 1 : upvoteCount - 1;
    setOptimisticUpvoted(newUpvoted);
    setOptimisticCount(newCount);

    startTransition(async () => {
      const result = await toggleUpvote(tip.id);
      if (!result.ok) {
        // Revert on error
        setOptimisticUpvoted(null);
        setOptimisticCount(null);
      }
    });
  };

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

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <time dateTime={isoDate} suppressHydrationWarning>{displayDate}</time>
            {wasUpdated && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                Updated
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1">
          <p
            ref={contentRef}
            className="text-sm text-muted-foreground whitespace-pre-line line-clamp-6"
          >
            {tip.content}
          </p>

          {isOverflowing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFullContent(true)}
              className="mt-2 h-auto p-0 text-xs text-primary hover:text-primary/80"
            >
              Read more <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
          )}

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
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <User className="w-3 h-3" />
              <span>{tipBelongsToCurrentUser ? "You" : "Community member"}</span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleUpvote}
              disabled={!user || isPending}
              className={cn(
                "h-8 px-2 gap-1.5 transition-colors",
                hasUpvoted && "text-primary"
              )}
              title={user ? (hasUpvoted ? "Remove upvote" : "Upvote this tip") : "Sign in to upvote"}
            >
              <ThumbsUp
                className={cn(
                  "w-4 h-4 transition-all",
                  hasUpvoted && "fill-current"
                )}
              />
              <span className="text-xs font-medium">{upvoteCount}</span>
            </Button>
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

      {/* Full Content Dialog */}
      <Dialog open={showFullContent} onOpenChange={setShowFullContent}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{tip.title}</DialogTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <Calendar className="w-3 h-3" />
              <time dateTime={isoDate}>{displayDate}</time>
              {wasUpdated && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  Updated
                </Badge>
              )}
              <span className="mx-1">•</span>
              <Badge variant="outline" className="text-[10px]">
                {tip.category}
              </Badge>
            </div>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
              {tip.content}
            </p>
            {tip.attachmentFileUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowFullContent(false);
                  setShowAttachmentDialog(true);
                }}
                className="mt-4"
              >
                <Paperclip className="w-3 h-3 mr-2" />
                View attachment
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
