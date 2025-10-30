import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ArrowLeft, FileText, Mail } from "lucide-react";
import dayjs from "dayjs";
import DownloadInvoicePDF from "@/components/download-invoice-pdf-final";
import InvoiceStatusUpdater from "@/components/invoice-status-updater";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch invoice with customer and items
  const { data: invoice } = await supabase
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
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!invoice) {
    redirect("/dashboard/invoices");
  }

  // Fetch invoice items
  const { data: items } = await supabase
    .from("invoice_items")
    .select("*")
    .eq("invoice_id", id)
    .order("created_at", { ascending: true });

  // Fetch user profile for company info
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const statusColors = {
    draft: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100",
    sent: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  };

  const statusText = {
    draft: "แบบร่าง",
    sent: "ส่งแล้ว",
    paid: "ชำระแล้ว",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/invoices">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              กลับ
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              ใบเสร็จ #{invoice.invoice_number}
            </h1>
            <p className="text-muted-foreground">
              สร้างเมื่อ {dayjs(invoice.created_at).format("D MMMM YYYY")}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <InvoiceStatusUpdater
            invoiceId={id}
            currentStatus={invoice.status as "draft" | "sent" | "paid"}
          />
          <DownloadInvoicePDF invoiceId={id} />
          <Button variant="outline" disabled>
            <Mail className="h-4 w-4 mr-2" />
            ส่งอีเมล
          </Button>
        </div>
      </div>

      {/* Invoice Display */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6" />
              <div>
                <CardTitle>ใบแจ้งหนี้ / INVOICE</CardTitle>
                <CardDescription>
                  เลขที่: {invoice.invoice_number}
                </CardDescription>
              </div>
            </div>
            <Badge
              className={
                statusColors[invoice.status as keyof typeof statusColors]
              }
            >
              {statusText[invoice.status as keyof typeof statusText]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Company & Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* From */}
            <div>
              <h3 className="font-semibold mb-2">จาก:</h3>
              <div className="text-sm space-y-1">
                <p className="font-medium">
                  {profile?.company_name || "ไม่มีข้อมูลบริษัท"}
                </p>
                {profile?.tax_id && (
                  <p className="text-muted-foreground">
                    เลขประจำตัวผู้เสียภาษี: {profile.tax_id}
                  </p>
                )}
                {profile?.phone && (
                  <p className="text-muted-foreground">โทร: {profile.phone}</p>
                )}
                {profile?.address && (
                  <p className="text-muted-foreground">{profile.address}</p>
                )}
              </div>
            </div>

            {/* To */}
            <div>
              <h3 className="font-semibold mb-2">ถึง:</h3>
              <div className="text-sm space-y-1">
                <p className="font-medium">{invoice.customers?.name}</p>
                {invoice.customers?.tax_id && (
                  <p className="text-muted-foreground">
                    เลขประจำตัวผู้เสียภาษี: {invoice.customers.tax_id}
                  </p>
                )}
                {invoice.customers?.email && (
                  <p className="text-muted-foreground">
                    อีเมล: {invoice.customers.email}
                  </p>
                )}
                {invoice.customers?.phone && (
                  <p className="text-muted-foreground">
                    โทร: {invoice.customers.phone}
                  </p>
                )}
                {invoice.customers?.address && (
                  <p className="text-muted-foreground">
                    {invoice.customers.address}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Invoice Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">วันที่ออกใบเสร็จ:</p>
              <p className="font-medium">
                {dayjs(invoice.date).format("D MMMM YYYY")}
              </p>
            </div>
            {invoice.due_date && (
              <div>
                <p className="text-muted-foreground">วันครบกำหนด:</p>
                <p className="font-medium">
                  {dayjs(invoice.due_date).format("D MMMM YYYY")}
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Items Table */}
          <div>
            <h3 className="font-semibold mb-3">รายการสินค้า/บริการ</h3>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium">
                      รายละเอียด
                    </th>
                    <th className="text-center p-3 text-sm font-medium w-24">
                      จำนวน
                    </th>
                    <th className="text-right p-3 text-sm font-medium w-32">
                      ราคา/หน่วย
                    </th>
                    <th className="text-right p-3 text-sm font-medium w-32">
                      ยอดรวม
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items?.map((item, index) => (
                    <tr
                      key={item.id}
                      className={
                        index % 2 === 0 ? "bg-background" : "bg-muted/50"
                      }
                    >
                      <td className="p-3 text-sm">{item.description}</td>
                      <td className="p-3 text-sm text-center">
                        {item.quantity.toLocaleString("th-TH")}
                      </td>
                      <td className="p-3 text-sm text-right">
                        ฿
                        {item.unit_price.toLocaleString("th-TH", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="p-3 text-sm text-right font-medium">
                        ฿
                        {item.amount.toLocaleString("th-TH", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full max-w-sm space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  ยอดรวม (ก่อน VAT):
                </span>
                <span className="font-medium">
                  ฿
                  {invoice.subtotal.toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">VAT 7%:</span>
                <span className="font-medium">
                  ฿
                  {invoice.vat.toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>ยอดรวมทั้งสิ้น:</span>
                <span className="text-primary">
                  ฿
                  {invoice.total.toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">หมายเหตุ:</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {invoice.notes}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
