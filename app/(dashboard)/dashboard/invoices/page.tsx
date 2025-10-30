import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import InvoicesList from "@/components/invoices-list";

export default async function InvoicesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch invoices with customer data
  const { data: invoices, error } = await supabase
    .from("invoices")
    .select(
      `
      *,
      customer:customers(name)
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ใบแจ้งหนี้</h1>
          <p className="text-muted-foreground">จัดการใบแจ้งหนี้ทั้งหมดของคุณ</p>
        </div>
        <Link href="/dashboard/invoices/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            สร้างใบแจ้งหนี้ใหม่
          </Button>
        </Link>
      </div>

      {/* Invoices List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            รายการใบแจ้งหนี้ ({invoices?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InvoicesList invoices={invoices || []} />
        </CardContent>
      </Card>
    </div>
  );
}
