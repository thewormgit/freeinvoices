import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type InvoiceData = {
  invoice: {
    invoice_number: string;
    date: string;
    due_date: string | null;
    subtotal: number;
    vat: number;
    total: number;
    notes: string | null;
    status: string;
  };
  customer: {
    name: string;
    tax_id: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
  };
  company: {
    company_name: string | null;
    tax_id: string | null;
    phone: string | null;
    address: string | null;
  };
  items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    amount: number;
  }>;
};

export function generateInvoicePDF(data: InvoiceData): jsPDF {
  const doc = new jsPDF();

  // Set font to support Thai characters (using default font for now)
  doc.setFont("helvetica");

  let yPos = 20;

  // Header - Invoice Title
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE / RECEIPT", 105, yPos, { align: "center" });
  doc.setFontSize(16);
  yPos += 10;
  doc.text("ใบเสร็จรับเงิน", 105, yPos, { align: "center" });
  yPos += 15;

  // Invoice Number and Date
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice No: ${data.invoice.invoice_number}`, 14, yPos);
  yPos += 6;
  doc.text(`Date: ${formatDate(data.invoice.date)}`, 14, yPos);
  if (data.invoice.due_date) {
    yPos += 6;
    doc.text(`Due Date: ${formatDate(data.invoice.due_date)}`, 14, yPos);
  }
  yPos += 10;

  // Company and Customer Info
  const leftCol = 14;
  const rightCol = 110;

  // From (Company)
  doc.setFont("helvetica", "bold");
  doc.text("FROM:", leftCol, yPos);
  doc.text("TO:", rightCol, yPos);
  yPos += 6;

  doc.setFont("helvetica", "normal");
  const companyLines = [
    data.company.company_name || "N/A",
    data.company.tax_id ? `Tax ID: ${data.company.tax_id}` : "",
    data.company.phone ? `Tel: ${data.company.phone}` : "",
    data.company.address || "",
  ].filter(Boolean);

  const customerLines = [
    data.customer.name,
    data.customer.tax_id ? `Tax ID: ${data.customer.tax_id}` : "",
    data.customer.email ? `Email: ${data.customer.email}` : "",
    data.customer.phone ? `Tel: ${data.customer.phone}` : "",
    data.customer.address || "",
  ].filter(Boolean);

  const maxLines = Math.max(companyLines.length, customerLines.length);

  for (let i = 0; i < maxLines; i++) {
    if (companyLines[i]) {
      doc.text(companyLines[i], leftCol, yPos);
    }
    if (customerLines[i]) {
      doc.text(customerLines[i], rightCol, yPos);
    }
    yPos += 6;
  }

  yPos += 5;

  // Items Table
  const tableData = data.items.map((item) => [
    item.description,
    item.quantity.toLocaleString("en-US", { minimumFractionDigits: 2 }),
    formatCurrency(item.unit_price),
    formatCurrency(item.amount),
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [["Description", "Quantity", "Unit Price", "Amount"]],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: [71, 85, 105],
      textColor: 255,
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 30, halign: "center" },
      2: { cellWidth: 35, halign: "right" },
      3: { cellWidth: 35, halign: "right" },
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
  });

  // Get Y position after table
  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Totals
  const totalsX = 145;
  const amountX = 175;

  doc.setFont("helvetica", "normal");
  doc.text("Subtotal:", totalsX, yPos, { align: "right" });
  doc.text(formatCurrency(data.invoice.subtotal), amountX, yPos, { align: "right" });

  yPos += 6;
  doc.text("VAT (7%):", totalsX, yPos, { align: "right" });
  doc.text(formatCurrency(data.invoice.vat), amountX, yPos, { align: "right" });

  yPos += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Total:", totalsX, yPos, { align: "right" });
  doc.text(formatCurrency(data.invoice.total), amountX, yPos, { align: "right" });

  // Notes
  if (data.invoice.notes) {
    yPos += 15;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Notes:", 14, yPos);
    yPos += 6;
    doc.setFont("helvetica", "normal");

    const splitNotes = doc.splitTextToSize(data.invoice.notes, 180);
    doc.text(splitNotes, 14, yPos);
  }

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.text(
    "Thank you for your business!",
    105,
    pageHeight - 15,
    { align: "center" }
  );

  return doc;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCurrency(amount: number): string {
  return `฿${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
