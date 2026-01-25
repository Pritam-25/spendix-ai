"use client";

import { aiScanReceiptAction } from "../action";
import { Button } from "@/components/ui/button";
import { CameraIcon, Loader2 } from "lucide-react";
import { useRef, useTransition } from "react";
import { toast } from "sonner";

/**
 * Normalized server response
 */
interface ScannedReceipt {
  amount: number;
  date: Date;
  description?: string;
  category?: string;
}

interface ReceiptScannerProps {
  onScanComplete: (data: ScannedReceipt) => void;
}

export default function AiReceiptScanner({
  onScanComplete,
}: ReceiptScannerProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleReceiptScan = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    startTransition(async () => {
      const result = await aiScanReceiptAction(file);
      if (result.success) {
        onScanComplete(result.data);
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleReceiptScan(file);
          e.target.value = "";
        }}
      />

      <div className="w-full flex flex-col items-center gap-2 mb-10">
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isPending}
          className="
        w-full py-6 h-auto flex items-center justify-center gap-3
        bg-secondary hover:bg-secondary/70 text-lg font-medium
        rounded-xl shadow-sm border-2 border-dashed
      "
        >
          {isPending ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Scanning…</span>
            </>
          ) : (
            <>
              <CameraIcon className="h-12 w-12" />
              <span>Scan Receipt</span>
            </>
          )}
        </Button>

        <p className="text-sm text-muted-foreground text-center max-w-sm">
          Upload a clear receipt photo. We’ll auto-fill the details — you can
          edit before saving.
        </p>
      </div>
    </>
  );
}
