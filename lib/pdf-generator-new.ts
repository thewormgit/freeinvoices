import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";

// Set fonts
if (pdfFonts && (pdfFonts as any).pdfMake && (pdfFonts as any).pdfMake.vfs) {
  (pdfMake as any).vfs = (pdfFonts as any).pdfMake.vfs;
} else if ((pdfFonts as any).default) {
  (pdfMake as any).vfs = (pdfFonts as any).default.pdfMake.vfs;
}

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

export function generateInvoicePDF(data: InvoiceData): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const docDefinition: any = {
      content: [
        // Header
        {
          text: "INVOICE / ใบเสร็จรับเงิน",
          style: "header",
          alignment: "center",
          margin: [0, 0, 0, 10],
        },

        // Invoice Info
        {
          columns: [
            {
              width: "*",
              stack: [
                {
                  text: `เลขที่ใบเสร็จ: ${data.invoice.invoice_number}`,
                  style: "info",
                },
                {
                  text: `วันที่: ${formatDate(data.invoice.date)}`,
                  style: "info",
                },
                data.invoice.due_date
                  ? {
                      text: `ครบกำหนด: ${formatDate(data.invoice.due_date)}`,
                      style: "info",
                    }
                  : {},
              ],
            },
            {
              width: "*",
              stack: [
                {
                  text: `สถานะ: ${getStatusText(data.invoice.status)}`,
                  style: "info",
                  alignment: "right",
                },
              ],
            },
          ],
          margin: [0, 0, 0, 20],
        },

        // Company and Customer Info
        {
          columns: [
            {
              width: "48%",
              stack: [
                { text: "จาก:", style: "subheader" },
                {
                  text: data.company.company_name || "ไม่มีข้อมูลบริษัท",
                  bold: true,
                },
                data.company.tax_id
                  ? { text: `เลขประจำตัวผู้เสียภาษี: ${data.company.tax_id}` }
                  : {},
                data.company.phone
                  ? { text: `โทร: ${data.company.phone}` }
                  : {},
                data.company.address ? { text: data.company.address } : {},
              ],
            },
            {
              width: "4%",
              text: "",
            },
            {
              width: "48%",
              stack: [
                { text: "ถึง:", style: "subheader" },
                { text: data.customer.name, bold: true },
                data.customer.tax_id
                  ? { text: `เลขประจำตัวผู้เสียภาษี: ${data.customer.tax_id}` }
                  : {},
                data.customer.email
                  ? { text: `อีเมล: ${data.customer.email}` }
                  : {},
                data.customer.phone
                  ? { text: `โทร: ${data.customer.phone}` }
                  : {},
                data.customer.address ? { text: data.customer.address } : {},
              ],
            },
          ],
          margin: [0, 0, 0, 20],
        },

        // Items Table
        {
          table: {
            headerRows: 1,
            widths: ["*", "auto", "auto", "auto"],
            body: [
              [
                { text: "รายละเอียด", style: "tableHeader" },
                { text: "จำนวน", style: "tableHeader", alignment: "center" },
                {
                  text: "ราคา/หน่วย",
                  style: "tableHeader",
                  alignment: "right",
                },
                { text: "ยอดรวม", style: "tableHeader", alignment: "right" },
              ],
              ...data.items.map((item) => [
                item.description,
                { text: item.quantity.toFixed(2), alignment: "center" },
                { text: formatCurrency(item.unit_price), alignment: "right" },
                { text: formatCurrency(item.amount), alignment: "right" },
              ]),
            ],
          },
          layout: {
            fillColor: function (rowIndex: number) {
              return rowIndex === 0
                ? "#475569"
                : rowIndex % 2 === 0
                  ? "#f8fafc"
                  : null;
            },
            hLineColor: function () {
              return "#e2e8f0";
            },
            vLineColor: function () {
              return "#e2e8f0";
            },
          },
          margin: [0, 0, 0, 20],
        },

        // Totals
        {
          columns: [
            { width: "*", text: "" },
            {
              width: "auto",
              stack: [
                {
                  columns: [
                    {
                      text: "ยอดรวม (ก่อน VAT):",
                      width: 120,
                      alignment: "right",
                    },
                    {
                      text: formatCurrency(data.invoice.subtotal),
                      width: 80,
                      alignment: "right",
                    },
                  ],
                  margin: [0, 0, 0, 5],
                },
                {
                  columns: [
                    { text: "VAT 7%:", width: 120, alignment: "right" },
                    {
                      text: formatCurrency(data.invoice.vat),
                      width: 80,
                      alignment: "right",
                    },
                  ],
                  margin: [0, 0, 0, 5],
                },
                {
                  columns: [
                    {
                      text: "ยอดรวมทั้งสิ้น:",
                      width: 120,
                      alignment: "right",
                      bold: true,
                      fontSize: 14,
                    },
                    {
                      text: formatCurrency(data.invoice.total),
                      width: 80,
                      alignment: "right",
                      bold: true,
                      fontSize: 14,
                      color: "#0ea5e9",
                    },
                  ],
                  margin: [0, 5, 0, 0],
                },
              ],
            },
          ],
        },

        // Notes
        data.invoice.notes
          ? {
              stack: [
                {
                  text: "หมายเหตุ:",
                  style: "subheader",
                  margin: [0, 20, 0, 5],
                },
                { text: data.invoice.notes, style: "notes" },
              ],
            }
          : {},

        // Footer
        {
          text: "ขอบคุณที่ใช้บริการ",
          alignment: "center",
          margin: [0, 30, 0, 0],
          italics: true,
          color: "#64748b",
        },
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 12,
          bold: true,
          margin: [0, 0, 0, 5],
        },
        info: {
          fontSize: 10,
          margin: [0, 0, 0, 3],
        },
        tableHeader: {
          bold: true,
          fontSize: 11,
          color: "white",
        },
        notes: {
          fontSize: 10,
          color: "#64748b",
        },
      },
      defaultStyle: {
        font: "Roboto",
        fontSize: 10,
      },
    };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);

    pdfDocGenerator.getBlob((blob: Blob) => {
      resolve(blob);
    });
  });
}

function formatDate(dateString: string): string {
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
}

function formatCurrency(amount: number): string {
  return `฿${amount.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getStatusText(status: string): string {
  const statusMap: { [key: string]: string } = {
    draft: "แบบร่าง",
    sent: "ส่งแล้ว",
    paid: "ชำระแล้ว",
  };
  return statusMap[status] || status;
}
