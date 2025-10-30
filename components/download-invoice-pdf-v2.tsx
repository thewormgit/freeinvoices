"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type InvoiceData = {
  invoice: any;
  customer: any;
  company: any;
  items: any[];
};

export default function DownloadInvoicePDF({
  invoiceId,
}: {
  invoiceId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const fetchInvoiceData = async () => {
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
      throw new Error("ไม่พบใบเสร็จ");
    }

    // Fetch invoice items
    const { data: items, error: itemsError } = await supabase
      .from("invoice_items")
      .select("*")
      .eq("invoice_id", invoiceId)
      .order("created_at", { ascending: true });

    if (itemsError) {
      throw new Error("ไม่สามารถดึงข้อมูลรายการสินค้าได้");
    }

    // Fetch company profile
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("กรุณาเข้าสู่ระบบ");
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    return {
      invoice,
      customer: invoice.customers,
      company: profile,
      items: items || [],
    };
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      // Fetch data first
      const data = await fetchInvoiceData();
      setInvoiceData(data);

      // Wait for render
      setTimeout(async () => {
        if (!printRef.current) return;

        // Generate canvas from HTML
        const canvas = await html2canvas(printRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          windowWidth: 1200,
          windowHeight: 1600,
          onclone: (clonedDoc) => {
            // Fix any CSS that might cause issues
            const clonedElement = clonedDoc.querySelector("[data-pdf-content]");
            if (clonedElement) {
              // Ensure all colors are in simple format
              (clonedElement as HTMLElement)
                .querySelectorAll("*")
                .forEach((el) => {
                  const element = el as HTMLElement;
                  if (element.style) {
                    // Convert any problematic colors to simple format
                    element.style.color = element.style.color || "#000000";
                  }
                });
            }
          },
        });

        // Create PDF
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save(`invoice-${data.invoice.invoice_number}.pdf`);

        // Clear data
        setInvoiceData(null);
        setLoading(false);
      }, 500);
    } catch (error: any) {
      console.error("Error generating PDF:", error);
      alert(error.message || "เกิดข้อผิดพลาดในการสร้าง PDF");
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const thaiMonths = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];
    return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${date.getFullYear() + 543}`;
  };

  const formatCurrency = (amount: number) => {
    return `฿${amount.toLocaleString("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      draft: "แบบร่าง",
      sent: "ส่งแล้ว",
      paid: "ชำระแล้ว",
    };
    return statusMap[status] || status;
  };

  return (
    <>
      <Button variant="outline" onClick={handleDownload} disabled={loading}>
        <Download className="h-4 w-4 mr-2" />
        {loading ? "กำลังสร้าง PDF..." : "ดาวน์โหลด PDF"}
      </Button>

      {/* Hidden invoice template for PDF generation */}
      {invoiceData && (
        <div
          ref={printRef}
          data-pdf-content
          style={{
            position: "absolute",
            left: "-9999px",
            width: "210mm",
            minHeight: "297mm",
            padding: "20mm",
            backgroundColor: "#ffffff",
            fontFamily: "Arial, sans-serif",
            color: "#000000",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <h1 style={{ fontSize: "28px", fontWeight: "bold", margin: "0" }}>
              INVOICE / ใบเสร็จรับเงิน
            </h1>
          </div>

          {/* Invoice Info */}
          <div
            style={{
              marginBottom: "20px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ marginBottom: "5px" }}>
                <strong>เลขที่ใบเสร็จ:</strong>{" "}
                {invoiceData.invoice.invoice_number}
              </div>
              <div style={{ marginBottom: "5px" }}>
                <strong>วันที่:</strong> {formatDate(invoiceData.invoice.date)}
              </div>
              {invoiceData.invoice.due_date && (
                <div>
                  <strong>ครบกำหนด:</strong>{" "}
                  {formatDate(invoiceData.invoice.due_date)}
                </div>
              )}
            </div>
            <div>
              <div>
                <strong>สถานะ:</strong>{" "}
                {getStatusText(invoiceData.invoice.status)}
              </div>
            </div>
          </div>

          {/* Company and Customer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "30px",
            }}
          >
            <div style={{ width: "48%" }}>
              <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
                จาก:
              </div>
              <div style={{ fontWeight: "bold" }}>
                {invoiceData.company?.company_name || "ไม่มีข้อมูลบริษัท"}
              </div>
              {invoiceData.company?.tax_id && (
                <div>เลขประจำตัวผู้เสียภาษี: {invoiceData.company.tax_id}</div>
              )}
              {invoiceData.company?.phone && (
                <div>โทร: {invoiceData.company.phone}</div>
              )}
              {invoiceData.company?.address && (
                <div>{invoiceData.company.address}</div>
              )}
            </div>
            <div style={{ width: "48%" }}>
              <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
                ถึง:
              </div>
              <div style={{ fontWeight: "bold" }}>
                {invoiceData.customer?.name || "N/A"}
              </div>
              {invoiceData.customer?.tax_id && (
                <div>เลขประจำตัวผู้เสียภาษี: {invoiceData.customer.tax_id}</div>
              )}
              {invoiceData.customer?.email && (
                <div>อีเมล: {invoiceData.customer.email}</div>
              )}
              {invoiceData.customer?.phone && (
                <div>โทร: {invoiceData.customer.phone}</div>
              )}
              {invoiceData.customer?.address && (
                <div>{invoiceData.customer.address}</div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "20px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#475569", color: "#ffffff" }}>
                <th
                  style={{
                    padding: "10px",
                    textAlign: "left",
                    border: "1px solid #ddd",
                  }}
                >
                  รายละเอียด
                </th>
                <th
                  style={{
                    padding: "10px",
                    textAlign: "center",
                    border: "1px solid #ddd",
                  }}
                >
                  จำนวน
                </th>
                <th
                  style={{
                    padding: "10px",
                    textAlign: "right",
                    border: "1px solid #ddd",
                  }}
                >
                  ราคา/หน่วย
                </th>
                <th
                  style={{
                    padding: "10px",
                    textAlign: "right",
                    border: "1px solid #ddd",
                  }}
                >
                  ยอดรวม
                </th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item: any, index: number) => (
                <tr
                  key={item.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f8fafc" : "#ffffff",
                  }}
                >
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    {item.description}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      textAlign: "center",
                      border: "1px solid #ddd",
                    }}
                  >
                    {item.quantity.toFixed(2)}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      textAlign: "right",
                      border: "1px solid #ddd",
                    }}
                  >
                    {formatCurrency(item.unit_price)}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      textAlign: "right",
                      border: "1px solid #ddd",
                    }}
                  >
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div
            style={{ marginLeft: "auto", width: "250px", marginBottom: "30px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "5px",
              }}
            >
              <span>ยอดรวม (ก่อน VAT):</span>
              <span>{formatCurrency(invoiceData.invoice.subtotal)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <span>VAT 7%:</span>
              <span>{formatCurrency(invoiceData.invoice.vat)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "bold",
                fontSize: "18px",
                borderTop: "2px solid #0ea5e9",
                paddingTop: "10px",
                color: "#0ea5e9",
              }}
            >
              <span>ยอดรวมทั้งสิ้น:</span>
              <span>{formatCurrency(invoiceData.invoice.total)}</span>
            </div>
          </div>

          {/* Notes */}
          {invoiceData.invoice.notes && (
            <div style={{ marginBottom: "30px" }}>
              <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
                หมายเหตุ:
              </div>
              <div style={{ color: "#64748b" }}>
                {invoiceData.invoice.notes}
              </div>
            </div>
          )}

          {/* Footer */}
          <div
            style={{
              textAlign: "center",
              fontStyle: "italic",
              color: "#64748b",
            }}
          >
            ขอบคุณที่ใช้บริการ
          </div>
        </div>
      )}
    </>
  );
}
