"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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
        .select(`*, customers (name, tax_id, email, phone, address)`)
        .eq("id", invoiceId)
        .single();

      if (invoiceError || !invoice) {
        alert("ไม่พบใบเสร็จ");
        return;
      }

      // Fetch invoice items
      const { data: items } = await supabase
        .from("invoice_items")
        .select("*")
        .eq("invoice_id", invoiceId)
        .order("created_at", { ascending: true });

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

      // Create new window with plain HTML (no CSS conflicts)
      const printWindow = window.open("", "_blank", "width=800,height=600");
      if (!printWindow) {
        alert("กรุณาอนุญาตให้เปิด popup");
        return;
      }

      // Format functions
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
        return `฿${amount.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      };

      const getStatusText = (status: string) => {
        const statusMap: { [key: string]: string } = {
          draft: "แบบร่าง",
          sent: "ส่งแล้ว",
          paid: "ชำระแล้ว",
        };
        return statusMap[status] || status;
      };

      // Generate HTML content
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${invoice.invoice_number}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Sarabun', 'Tahoma', 'Arial', sans-serif;
      padding: 40px;
      background: white;
      color: #000;
      line-height: 1.6;
    }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { font-size: 28px; font-weight: bold; }
    .info-section { display: flex; justify-content: space-between; margin-bottom: 20px; }
    .info-box { flex: 1; }
    .info-box strong { display: block; margin-bottom: 5px; }
    .section-title { font-weight: bold; margin-bottom: 10px; font-size: 14px; }
    .company-customer { display: flex; gap: 20px; margin: 30px 0; }
    .company-customer > div { flex: 1; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #475569; color: white; padding: 12px; text-align: left; font-weight: bold; }
    td { padding: 10px; border: 1px solid #ddd; }
    tr:nth-child(even) { background: #f8fafc; }
    .totals { margin-left: auto; width: 300px; margin-top: 20px; }
    .totals-row { display: flex; justify-content: space-between; padding: 8px 0; }
    .totals-final { font-weight: bold; font-size: 18px; color: #0ea5e9; border-top: 2px solid #0ea5e9; padding-top: 10px; margin-top: 10px; }
    .notes { margin-top: 30px; padding: 15px; background: #f8fafc; border-radius: 5px; }
    .footer { text-align: center; margin-top: 50px; font-style: italic; color: #64748b; }
  </style>
</head>
<body>
  <div class="header">
    <h1>INVOICE / ใบแจ้งหนี้</h1>
  </div>

  <div class="info-section">
    <div class="info-box">
      <strong>เลขที่ใบเสร็จ:</strong> ${invoice.invoice_number}<br>
      <strong>วันที่:</strong> ${formatDate(invoice.date)}<br>
      ${invoice.due_date ? `<strong>ครบกำหนด:</strong> ${formatDate(invoice.due_date)}<br>` : ""}
    </div>
    <div class="info-box" style="text-align: right;">
      <strong>สถานะ:</strong> ${getStatusText(invoice.status)}
    </div>
  </div>

  <div class="company-customer">
    <div>
      <div class="section-title">จาก:</div>
      <strong>${profile?.company_name || "ไม่มีข้อมูลบริษัท"}</strong><br>
      ${profile?.tax_id ? `เลขประจำตัวผู้เสียภาษี: ${profile.tax_id}<br>` : ""}
      ${profile?.phone ? `โทร: ${profile.phone}<br>` : ""}
      ${profile?.address ? profile.address : ""}
    </div>
    <div>
      <div class="section-title">ถึง:</div>
      <strong>${invoice.customers?.name || "N/A"}</strong><br>
      ${invoice.customers?.tax_id ? `เลขประจำตัวผู้เสียภาษี: ${invoice.customers.tax_id}<br>` : ""}
      ${invoice.customers?.email ? `อีเมล: ${invoice.customers.email}<br>` : ""}
      ${invoice.customers?.phone ? `โทร: ${invoice.customers.phone}<br>` : ""}
      ${invoice.customers?.address ? invoice.customers.address : ""}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>รายละเอียด</th>
        <th style="text-align: center; width: 100px;">จำนวน</th>
        <th style="text-align: right; width: 120px;">ราคา/หน่วย</th>
        <th style="text-align: right; width: 120px;">ยอดรวม</th>
      </tr>
    </thead>
    <tbody>
      ${(items || [])
        .map(
          (item: any) => `
        <tr>
          <td>${item.description}</td>
          <td style="text-align: center;">${item.quantity.toFixed(2)}</td>
          <td style="text-align: right;">${formatCurrency(item.unit_price)}</td>
          <td style="text-align: right;">${formatCurrency(item.amount)}</td>
        </tr>
      `,
        )
        .join("")}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-row">
      <span>ยอดรวม (ก่อน VAT):</span>
      <span>${formatCurrency(invoice.subtotal)}</span>
    </div>
    <div class="totals-row">
      <span>VAT 7%:</span>
      <span>${formatCurrency(invoice.vat)}</span>
    </div>
    <div class="totals-row totals-final">
      <span>ยอดรวมทั้งสิ้น:</span>
      <span>${formatCurrency(invoice.total)}</span>
    </div>
  </div>

  ${
    invoice.notes
      ? `
  <div class="notes">
    <div class="section-title">หมายเหตุ:</div>
    ${invoice.notes}
  </div>
  `
      : ""
  }

  <div class="footer">
    ขอบคุณที่ใช้บริการ
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script>
    window.onload = () => {
      // Show loading message
      const loadingDiv = document.createElement('div');
      loadingDiv.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; background: #0ea5e9; color: white; padding: 15px; text-align: center; font-size: 16px; z-index: 9999;';
      loadingDiv.innerHTML = 'กำลังสร้าง PDF... กรุณารอสักครู่';
      document.body.insertBefore(loadingDiv, document.body.firstChild);

      setTimeout(() => {
        // Hide loading div before capturing
        loadingDiv.style.display = 'none';

        html2canvas(document.body, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false
        }).then(canvas => {
          const { jsPDF } = window.jspdf;
          const pdf = new jsPDF('p', 'mm', 'a4');
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = 210;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
          pdf.save('invoice-${invoice.invoice_number}.pdf');

          // Show success with close button
          loadingDiv.style.display = 'block';
          loadingDiv.style.background = '#10b981';
          loadingDiv.innerHTML = 'ดาวน์โหลดเสร็จสิ้น! <button onclick="window.close()" style="margin-left: 15px; padding: 8px 20px; background: white; color: #10b981; border: 2px solid white; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 14px;">ปิดหน้าต่าง</button>';
        }).catch(error => {
          loadingDiv.style.display = 'block';
          loadingDiv.style.background = '#ef4444';
          loadingDiv.innerHTML = 'เกิดข้อผิดพลาด: ' + error.message + ' <button onclick="window.close()" style="margin-left: 15px; padding: 8px 20px; background: white; color: #ef4444; border: 2px solid white; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 14px;">ปิดหน้าต่าง</button>';
        });
      }, 1000);
    };
  </script>
</body>
</html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      setLoading(false);
    } catch (error: any) {
      console.error("Error generating PDF:", error);
      alert(error.message || "เกิดข้อผิดพลาดในการสร้าง PDF");
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleDownload} disabled={loading}>
      <Download className="h-4 w-4 mr-2" />
      {loading ? "กำลังเปิดหน้าต่าง..." : "ดาวน์โหลด PDF"}
    </Button>
  );
}
