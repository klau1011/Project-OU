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
      title: tipToEdit?.title || "",
      content: tipToEdit?.content || "",
      attachmentFile: tipToEdit?.attachmentFileUrl || ""
    },
  });

  async function onSubmit(values: CreateTipSchema) {
    let uploadedFileUrl;

    if (values.attachmentFile) {
      console.log(values.attachmentFile);
      const formData = new FormData();
      formData.append("attachmentFile", values.attachmentFile);

      uploadedFileUrl = await uploadFile(user?.id || "", formData);
    }

    if (tipToEdit) {
      editTip({ id: tipToEdit.id, title: values.title, content: values.content, attachmentFile: uploadedFileUrl});
    } else {
      addTip({title: values.title, content: values.content, attachmentFile: uploadedFileUrl});
    }
    form.reset();
    setOpen(false);
  }

  function handleDelete() {
    if (!tipToEdit) return Error("No tip to delete");

    try {
      setDeleteInProgress(true);
      deleteTip({ id: tipToEdit.id });
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteInProgress(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle> {tipToEdit ? "Edit Tip" : "Add Tip"}</DialogTitle>
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
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="attachmentFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File (optional)</FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Any helpful files are appreciated!
                    </p>
                    <FormControl>
                      <Input
                        type="file"
                        {...field}
                        value={undefined}
                        accept="application/pdf"
                        onChange={(e) => {
                          if (e.target.files) {
                            field.onChange(e.target.files[0]);
                          }
                        }}
                      />
                    </FormControl>
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
    </>
  );
}
