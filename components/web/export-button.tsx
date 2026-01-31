"use client";

import { useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, FileSpreadsheet, FileDown, Download } from "lucide-react";
import { ExportFormat } from "@/lib/data/exports/export.data";
import { toast } from "sonner";
import { ExportActionResult } from "@/app/(dashboard)/accounts/action";
import { Button } from "../ui/button";

interface Props {
  action: (format: ExportFormat) => Promise<ExportActionResult>;
}

export default function ExportMenu({ action }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleExport = (format: ExportFormat) => {
    startTransition(async () => {
      const res = await action(format);

      if (!res.success) {
        toast.error(res.error);
        return;
      }

      let blob: Blob;

      if (res.mime === "text/csv") {
        blob = new Blob([res.data], { type: res.mime });
      } else {
        const byteArray = Uint8Array.from(atob(res.data), (c) =>
          c.charCodeAt(0),
        );
        blob = new Blob([byteArray], { type: res.mime });
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = res.filename;
      link.click();
      URL.revokeObjectURL(url);

      toast.success(res.message);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={isPending} className="cursor-pointer">
          <Download className="h-4 w-4" />
          {isPending ? "Exporting…" : "Export"}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          <FileText className="mr-2 h-4 w-4" />
          CSV
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleExport("excel")}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Excel
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleExport("pdf")}>
          <FileDown className="mr-2 h-4 w-4" />
          PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
