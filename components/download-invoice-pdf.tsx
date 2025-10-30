"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { generateInvoicePDF } from "@/lib/pdf-generator-client";

export default function DownloadInvoicePDF({
  invoiceId,
}: {
  invoiceId: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const supabase = createClient();

      // Fetch invoice with customer
      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .select(
          `
          *,
          customers (
            name,
            tax_id,
            email,
            phone,
            address
          )
        `,
        )
        .eq("id", invoiceId)
        .single();

      if (invoiceError || !invoice) {
        alert("ไม่พบใบเสร็จ");
        return;
      }

      // Fetch invoice items
      const { data: items, error: itemsError } = await supabase
        .from("invoice_items")
        .select("*")
        .eq("invoice_id", invoiceId)
        .order("created_at", { ascending: true });

      if (itemsError) {
        alert("ไม่สามารถดึงข้อมูลรายการสินค้าได้");
        return;
      }

      // Fetch company profile
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("กรุณาเข้าสู่ระบบ");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      // Prepare data for PDF
      const pdfData = {
        invoice: {
          invoice_number: invoice.invoice_number,
          date: invoice.date,
          due_date: invoice.due_date,
          subtotal: invoice.subtotal,
          vat: invoice.vat,
          total: invoice.total,
          notes: invoice.notes,
          status: invoice.status,
        },
        customer: {
          name: invoice.customers?.name || "N/A",
          tax_id: invoice.customers?.tax_id,
          email: invoice.customers?.email,
          phone: invoice.customers?.phone,
          address: invoice.customers?.address,
        },
        company: {
          company_name: profile?.company_name,
          tax_id: profile?.tax_id,
          phone: profile?.phone,
          address: profile?.address,
        },
        items: items || [],
      };

      // Generate PDF
      const pdfBlob = await generateInvoicePDF(pdfData);

      // Download PDF
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${invoice.invoice_number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("เกิดข้อผิดพลาดในการสร้าง PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleDownload} disabled={loading}>
      <Download className="h-4 w-4 mr-2" />
      {loading ? "กำลังสร้าง PDF..." : "ดาวน์โหลด PDF"}
    </Button>
  );
}
