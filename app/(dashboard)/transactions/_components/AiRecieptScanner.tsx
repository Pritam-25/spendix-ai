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
      try {
        const data = await aiScanReceiptAction(file);
        onScanComplete(data);
        toast.success("Receipt scanned successfully");
      } catch (error) {
        console.error("Receipt scan failed:", error);
        toast.error("Failed to scan receipt. Please try again.");
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
          if (file) {
            handleReceiptScan(file);
          }
          e.target.value = "";
        }}
      />

      <Button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isPending}
        className="w-full py-6 h-auto flex items-center justify-center gap-3
                   bg-secondary hover:bg-secondary/90 text-lg font-medium
                   rounded-lg shadow-md border-2 border-dashed mb-10"
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
    </>
  );
}
