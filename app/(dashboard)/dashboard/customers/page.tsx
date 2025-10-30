import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Users, Plus } from "lucide-react";
import CustomersList from "@/components/customers-list";

export default async function CustomersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch customers
  const { data: customers, error } = await supabase
    .from("customers")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ลูกค้า</h1>
          <p className="text-muted-foreground">
            จัดการข้อมูลลูกค้าของคุณ
          </p>
        </div>
      </div>

      {/* Customers List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              รายชื่อลูกค้า ({customers?.length || 0})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CustomersList customers={customers || []} />
        </CardContent>
      </Card>
    </div>
  );
}
