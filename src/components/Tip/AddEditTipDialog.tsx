import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateTipSchema, createTipSchema } from "@/validation/review";
import { Tip } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import LoadingButton from "../LoadingButton";
import { addTip, deleteTip, editTip } from "@/actions/tips";
import { useState } from "react";
import { uploadFile } from "@/actions/fileUpload";
import { useUser } from "@clerk/nextjs";

interface AddEditTipDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  tipToEdit?: Tip;
}

export default function AddEditTipDialog({
  open,
  setOpen,
  tipToEdit,
}: AddEditTipDialogProps) {
  const { user } = useUser();
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  const form = useForm<CreateTipSchema>({
    resolver: zodResolver(createTipSchema),
    defaultValues: {
      title: tipToEdit?.title ?? "",
      content: tipToEdit?.content ?? "",
      attachmentFile: undefined as any,
    },
  });

  async function onSubmit(values: CreateTipSchema) {
    try {
      let uploadedFileUrl: string | undefined;

      // upload if a new file was chosen
      if (values.attachmentFile instanceof File) {
        const formData = new FormData();
        formData.append("attachmentFile", values.attachmentFile);
        uploadedFileUrl = await uploadFile(user?.id || "", formData);
      }

      if (tipToEdit) {
        const res = await editTip({
          id: tipToEdit.id,
          title: values.title,
          content: values.content,
          // pass attachmentFile if we actually uploaded a new one
          ...(uploadedFileUrl ? { attachmentFile: uploadedFileUrl } : {}),
        } as any);

        if (res && typeof res === "object" && "ok" in res && !res.ok) {
          alert(res.message ?? "Failed to update tip");
          return;
        }
      } else {
        const res = await addTip({
          title: values.title,
          content: values.content,
          attachmentFile: uploadedFileUrl,
        } as any);

        if (res && typeof res === "object" && "ok" in res && !res.ok) {
          alert(res.message ?? "Failed to create tip");
          return;
        }
      }

      form.reset();
      setOpen(false);
    } catch (e) {
      console.error(e);
      alert("Unexpected error");
    }
  }

  async function handleDelete() {
    if (!tipToEdit) return;

    try {
      setDeleteInProgress(true);
      const res = await deleteTip({ id: tipToEdit.id } as any);
      if (res && typeof res === "object" && "ok" in res && !res.ok) {
        alert(res.message ?? "Failed to delete tip");
        return;
      }
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Unexpected error");
    } finally {
      setDeleteInProgress(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tipToEdit ? "Edit Tip" : "Add Tip"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tip content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tip content" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* show existing file link when editing (if avail) */}
            {tipToEdit?.attachmentFileUrl && (
              <div className="text-xs">
                Current file:{" "}
                <a
                  className="underline"
                  href={tipToEdit.attachmentFileUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View
                </a>
              </div>
            )}

            <FormField
              control={form.control}
              name="attachmentFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File (optional)</FormLabel>
                  <p className="text-xs text-muted-foreground">
                    PDF recommended.
                  </p>
                  <FormControl>
                    <Input
                      type="file"
                      accept="application/pdf"
                      // note: react-hook-form with file inputs: never bind value
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        field.onChange(f ?? undefined);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <LoadingButton
                type="submit"
                isLoading={form.formState.isSubmitting}
              >
                Submit
              </LoadingButton>
              {tipToEdit && (
                <LoadingButton
                  type="button"
                  variant="destructive"
                  isLoading={deleteInProgress}
                  onClick={handleDelete}
                >
                  Delete
                </LoadingButton>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
