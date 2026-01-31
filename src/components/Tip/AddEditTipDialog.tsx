import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CreateTipSchema, createTipSchema, TIP_CATEGORIES } from "@/validation/review";
import { Tip } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import LoadingButton from "../LoadingButton";
import { Button } from "../ui/button";
import { addTip, deleteTip, editTip } from "@/actions/tips";
import { useState } from "react";
import { uploadFile } from "@/actions/fileUpload";
import { useUser } from "@clerk/nextjs";
import { AlertTriangle, FileText, Paperclip, Trash2 } from "lucide-react";
import { toast } from "sonner";

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const form = useForm<CreateTipSchema>({
    resolver: zodResolver(createTipSchema),
    defaultValues: {
      title: tipToEdit?.title ?? "",
      content: tipToEdit?.content ?? "",
      category: (tipToEdit?.category as CreateTipSchema["category"]) ?? "general",
      attachmentFile: undefined as any,
    },
  });

  const watchedContent = form.watch("content");
  const watchedTitle = form.watch("title");

  async function onSubmit(values: CreateTipSchema) {
    try {
      let uploadedFileUrl: string | undefined;

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
          category: values.category,
          ...(uploadedFileUrl ? { attachmentFile: uploadedFileUrl } : {}),
        } as any);

        if (res && typeof res === "object" && "ok" in res && !res.ok) {
          toast.error(res.message ?? "Failed to update resource");
          return;
        }
        toast.success("Resource updated successfully");
      } else {
        const res = await addTip({
          title: values.title,
          content: values.content,
          category: values.category,
          attachmentFile: uploadedFileUrl,
        } as any);

        if (res && typeof res === "object" && "ok" in res && !res.ok) {
          toast.error(res.message ?? "Failed to create resource");
          return;
        }
        toast.success("Resource published successfully");
      }

      form.reset();
      setOpen(false);
    } catch (e) {
      console.error(e);
      toast.error("An unexpected error occurred");
    }
  }

  async function handleDelete() {
    if (!tipToEdit) return;

    try {
      setDeleteInProgress(true);
      const res = await deleteTip({ id: tipToEdit.id } as any);
      if (res && typeof res === "object" && "ok" in res && !res.ok) {
        toast.error(res.message ?? "Failed to delete resource");
        return;
      }
      toast.success("Resource deleted");
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    } finally {
      setDeleteInProgress(false);
      setShowDeleteConfirm(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {tipToEdit ? "Edit Community Resource" : "Add Community Resource"}
          </DialogTitle>
          <DialogDescription>
            {tipToEdit
              ? "Update your community resource below."
              : "Share helpful resources and advice with the community."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., How to ace your supplementary application"
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-between">
                    <FormMessage />
                    <span className={`text-xs ${watchedTitle.length > 100 ? "text-destructive" : "text-muted-foreground"}`}>
                      {watchedTitle.length}/100
                    </span>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TIP_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the category that best fits your resource.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your advice, tips, or resources..."
                      className="min-h-[150px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-between">
                    <FormMessage />
                    <span className={`text-xs ${watchedContent.length > 2000 ? "text-destructive" : "text-muted-foreground"}`}>
                      {watchedContent.length}/2000
                    </span>
                  </div>
                </FormItem>
              )}
            />

            {tipToEdit?.attachmentFileUrl && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                <Paperclip className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Current attachment:</span>
                <a
                  className="text-sm text-primary underline hover:no-underline"
                  href={tipToEdit.attachmentFileUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View file
                </a>
              </div>
            )}

            <FormField
              control={form.control}
              name="attachmentFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attachment (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="application/pdf,image/*,.doc,.docx"
                      className="cursor-pointer"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        field.onChange(f ?? undefined);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload a PDF, image, or document (max 5MB).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showDeleteConfirm ? (
              <div className="flex items-center gap-3 p-3 rounded-lg border border-destructive/50 bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Delete this resource?</p>
                  <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <LoadingButton
                    type="button"
                    variant="destructive"
                    size="sm"
                    isLoading={deleteInProgress}
                    onClick={handleDelete}
                  >
                    Delete
                  </LoadingButton>
                </div>
              </div>
            ) : (
              <DialogFooter className="gap-2 sm:gap-0">
                {tipToEdit && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                )}
                <LoadingButton
                  type="submit"
                  isLoading={form.formState.isSubmitting}
                >
                  {tipToEdit ? "Save Changes" : "Publish Resource"}
                </LoadingButton>
              </DialogFooter>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
