import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import InvoiceForm from "@/components/invoice-form";

export default async function NewInvoicePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch customers for the dropdown
  const { data: customers } = await supabase
    .from("customers")
    .select("id, name, email, tax_id, phone, address")
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  // Get latest invoice number for auto-generation
  const { data: latestInvoice } = await supabase
    .from("invoices")
    .select("invoice_number")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return (
    <InvoiceForm
      customers={customers || []}
      latestInvoiceNumber={latestInvoice?.invoice_number}
    />
  );
}
