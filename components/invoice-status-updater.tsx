"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, FileEdit, Send, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Status = "draft" | "sent" | "paid";

export default function InvoiceStatusUpdater({
  invoiceId,
  currentStatus,
}: {
  invoiceId: string;
  currentStatus: Status;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const statusConfig = {
    draft: {
      label: "แบบร่าง",
      color: "text-slate-600 bg-slate-100",
      icon: FileEdit,
    },
    sent: {
      label: "ส่งแล้ว",
      color: "text-blue-600 bg-blue-100",
      icon: Send,
    },
    paid: {
      label: "ชำระแล้ว",
      color: "text-green-600 bg-green-100",
      icon: CheckCircle2,
    },
  };

  const handleStatusChange = async (newStatus: Status) => {
    if (newStatus === currentStatus) return;

    setLoading(true);
    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("invoices")
        .update({ status: newStatus })
        .eq("id", invoiceId);

      if (error) throw error;

      // Refresh the page to show updated status
      router.refresh();
    } catch (error: any) {
      console.error("Error updating status:", error);
      alert("เกิดข้อผิดพลาดในการเปลี่ยนสถานะ");
    } finally {
      setLoading(false);
    }
  };

  const CurrentIcon = statusConfig[currentStatus].icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={loading}
          className={`${statusConfig[currentStatus].color}`}
        >
          <CurrentIcon className="h-4 w-4 mr-2" />
          {statusConfig[currentStatus].label}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleStatusChange("draft")}
          disabled={currentStatus === "draft"}
          className="cursor-pointer"
        >
          <FileEdit className="h-4 w-4 mr-2" />
          แบบร่าง
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusChange("sent")}
          disabled={currentStatus === "sent"}
          className="cursor-pointer"
        >
          <Send className="h-4 w-4 mr-2" />
          ส่งแล้ว
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusChange("paid")}
          disabled={currentStatus === "paid"}
          className="cursor-pointer"
        >
          <CheckCircle2 className="h-4 w-4 mr-2" />
          ชำระแล้ว
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
