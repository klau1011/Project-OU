"use client";
import { Tip as TipModel } from "@prisma/client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useState } from "react";
import AddEditTipDialog from "./AddEditTipDialog";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { PencilIcon } from "lucide-react";
import ViewAttachmentDialog from "./ViewAttachmentDialog";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";

interface TipProps {
  tip: TipModel;
}

export default function Tip({ tip }: TipProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAttachmentDialog, setShowAttachmentDialog] = useState(false);

  const { user } = useUser();

  const tipBelongsToCurrentUser = user?.id == tip.userId;

  const wasUpdated = tip.updatedAt > tip.createdAt;

  const createdUpdatedAtTimestamp = (
    wasUpdated ? tip.updatedAt : tip.createdAt
  ).toDateString();
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            {tip.title}{" "}
            {tipBelongsToCurrentUser && (
              <PencilIcon
                className="cursor-pointer transition-shadow"
                onClick={
                  tipBelongsToCurrentUser
                    ? () => setShowEditDialog(true)
                    : () => {}
                }
              />
            )}
          </CardTitle>
          <CardDescription>
            {createdUpdatedAtTimestamp}
            {wasUpdated && " (updated) "}
          </CardDescription>
        </CardHeader>
        <CardContent className="whitespace-pre-line">
          {tip.content} {"\n\n"}
          {tip.attachmentFileUrl && (
            <Button
              variant="secondary"
              onClick={() => setShowAttachmentDialog(true)}
            >
              View attachment
            </Button>
          )}
        </CardContent>

        <CardFooter className="text-sm italic text-slate-600">
          Tip from {tipBelongsToCurrentUser ? "you" : user?.firstName}
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
