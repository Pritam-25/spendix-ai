"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { ExportFormat } from "@/lib/data/exports/export.data";
import { toast } from "sonner";

interface ExportSuccess {
  success: true;
  data: string;
  mime: string;
  filename: string;
  message: string;
}

interface ExportFailure {
  success: false;
  error: string;
}

type ExportResult = ExportSuccess | ExportFailure;

interface Props {
  action: (format: ExportFormat) => Promise<ExportResult>;
}

export default function ExportButton({ action }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleExport = () => {
    startTransition(async () => {
      const res = await action("csv");

      if (!res.success) {
        toast.error(res.error);
        return;
      }

      const blob = new Blob([res.data], { type: res.mime });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = res.filename;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(res.message);
    });
  };

  return (
    <Button onClick={handleExport} disabled={isPending}>
      {isPending ? "Exporting..." : "Export"}
    </Button>
  );
}
