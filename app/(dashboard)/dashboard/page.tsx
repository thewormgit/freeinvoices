import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, Users, DollarSign, Clock } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch dashboard data
  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("user_id", user.id);

  const { data: customers } = await supabase
    .from("customers")
    .select("*")
    .eq("user_id", user.id);

  // Calculate statistics
  const totalInvoices = invoices?.length || 0;
  const totalCustomers = customers?.length || 0;
  const paidInvoices = invoices?.filter((inv) => inv.status === "paid") || [];
  const unpaidInvoices = invoices?.filter((inv) => inv.status !== "paid") || [];

  const totalRevenue = paidInvoices.reduce(
    (sum, inv) => sum + Number(inv.total),
    0,
  );
  const unpaidAmount = unpaidInvoices.reduce(
    (sum, inv) => sum + Number(inv.total),
    0,
  );

  // Get recent invoices
  const recentInvoices =
    invoices
      ?.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 5) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">แดชบอร์ด</h1>
          <p className="text-muted-foreground">ภาพรวมธุรกิจของคุณ</p>
        </div>
        <Link href="/dashboard/invoices/new">
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            สร้างใบแจ้งหนี้ใหม่
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              ใบแจ้งหนี้ทั้งหมด
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvoices}</div>
            <p className="text-xs text-muted-foreground">ใบเสร็จในระบบ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ลูกค้าทั้งหมด</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">รายชื่อลูกค้า</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              รายได้ที่ได้รับ
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ฿
              {totalRevenue.toLocaleString("th-TH", {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              {paidInvoices.length} ใบแจ้งหนี้ชำระแล้ว
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รอชำระเงิน</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ฿
              {unpaidAmount.toLocaleString("th-TH", {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              {unpaidInvoices.length} ใบแจ้งหนี้
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>ใบแจ้งหนี้ล่าสุด</CardTitle>
        </CardHeader>
        <CardContent>
          {recentInvoices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-semibold">ยังไม่มีใบแจ้งหนี้</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                เริ่มต้นสร้างใบแจ้งหนี้แรกของคุณ
              </p>
              <Link href="/dashboard/invoices/new">
                <Button className="mt-4">
                  <FileText className="mr-2 h-4 w-4" />
                  สร้างใบแจ้งหนี้ใหม่
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentInvoices.map((invoice) => (
                <Link
                  key={invoice.id}
                  href={`/dashboard/invoices/${invoice.id}`}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="font-medium">{invoice.invoice_number}</p>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                          ${
                            invoice.status === "paid"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : invoice.status === "sent"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                          }
                        `}
                      >
                        {invoice.status === "paid"
                          ? "ชำระแล้ว"
                          : invoice.status === "sent"
                            ? "ส่งแล้ว"
                            : "ฉบับร่าง"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(invoice.date).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ฿
                      {Number(invoice.total).toLocaleString("th-TH", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </Link>
              ))}

              <Link href="/dashboard/invoices">
                <Button variant="outline" className="w-full">
                  ดูใบแจ้งหนี้ทั้งหมด
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
