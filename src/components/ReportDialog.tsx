import { ReactNode, useMemo, useState } from "react";
import { Flag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";

type ReportTargetType = "user" | "comment";

interface ReportDialogProps {
  targetType: ReportTargetType;
  targetId: string | number;
  targetName?: string;
  blogId?: string | number;
  commentContent?: string;
  children: ReactNode;
  onReported?: () => void;
}

const USER_REASONS = [
  { value: "harassment", label: "Harassment or bullying" },
  { value: "impersonation", label: "Impersonation" },
  { value: "spam", label: "Spam or scam" },
  { value: "unsafe_behavior", label: "Unsafe behavior" },
  { value: "other", label: "Something else" },
];

const COMMENT_REASONS = [
  { value: "harassment", label: "Harassment or abuse" },
  { value: "hate", label: "Hate or discrimination" },
  { value: "spam", label: "Spam or scam" },
  { value: "misinformation", label: "Misleading information" },
  { value: "other", label: "Something else" },
];

const ReportDialog = ({
  targetType,
  targetId,
  targetName,
  blogId,
  commentContent,
  children,
  onReported,
}: ReportDialogProps) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasons = targetType === "user" ? USER_REASONS : COMMENT_REASONS;
  const title = targetType === "user" ? "Report account" : "Report comment";
  const description = useMemo(() => {
    if (targetType === "user") {
      return `Tell us what is wrong with ${targetName || "this account"}.`;
    }
    return "Tell us why this comment should be reviewed.";
  }, [targetName, targetType]);

  const submitReport = async () => {
    const token = localStorage.getItem("access_token") || undefined;
    if (!token) {
      toast.error("Please sign in to submit a report.");
      return;
    }

    if (!reason) {
      toast.error("Choose a reason for the report.");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      target_type: targetType,
      target_id: targetId,
      reason,
      details: details.trim() || undefined,
      blog_id: blogId,
      comment_content: commentContent,
    };

    try {
      if (targetType === "comment" && blogId) {
        try {
          await api.post(`blogs/${blogId}/comments/${targetId}/flag`, payload, token);
        } catch {
          await api.post("reports", payload, token);
        }
      } else {
        await api.post("reports", payload, token);
      }

      toast.success("Report submitted for review.");
      setOpen(false);
      setReason("");
      setDetails("");
      onReported?.();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-destructive" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {commentContent && (
          <div className="rounded-md border border-border/50 bg-muted/40 p-3 text-sm text-muted-foreground">
            <p className="line-clamp-3">{commentContent}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label>Reason</Label>
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger>
              <SelectValue placeholder="Select a reason" />
            </SelectTrigger>
            <SelectContent>
              {reasons.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`report-details-${targetType}-${targetId}`}>Details</Label>
          <Textarea
            id={`report-details-${targetType}-${targetId}`}
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            placeholder="Add context for the moderation team..."
            className="min-h-[100px]"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={submitReport} disabled={isSubmitting} className="gap-2">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Flag className="h-4 w-4" />}
            Submit report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;
