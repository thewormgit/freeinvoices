import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { generateInvoicePDF } from "@/lib/pdf-generator-new";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (invoiceError || !invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Fetch invoice items
    const { data: items, error: itemsError } = await supabase
      .from("invoice_items")
      .select("*")
      .eq("invoice_id", id)
      .order("created_at", { ascending: true });

    if (itemsError) {
      return NextResponse.json(
        { error: "Failed to fetch items" },
        { status: 500 },
      );
    }

    // Fetch company profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    // Generate PDF
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

    const pdfBlob = await generateInvoicePDF(pdfData);
    const pdfBuffer = await pdfBlob.arrayBuffer();

    // Return PDF as download
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${invoice.invoice_number}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 },
    );
  }
}
