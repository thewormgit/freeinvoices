"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Plus, Trash2, FileText, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import dayjs from "dayjs";
import { invoiceSchema, type InvoiceFormData } from "@/lib/validations/schemas";

type Customer = {
  id: string;
  name: string;
  email: string | null;
  tax_id: string | null;
  phone: string | null;
  address: string | null;
};

export default function InvoiceForm({
  customers,
  latestInvoiceNumber,
}: {
  customers: Customer[];
  latestInvoiceNumber?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Generate next invoice number
  const generateInvoiceNumber = () => {
    const today = dayjs().format("YYYYMMDD");

    if (!latestInvoiceNumber) {
      return `INV-${today}-0001`;
    }

    // Extract the sequence number from the latest invoice
    const parts = latestInvoiceNumber.split("-");
    if (parts.length === 3 && parts[1] === today) {
      const sequence = parseInt(parts[2]) + 1;
      return `INV-${today}-${sequence.toString().padStart(4, "0")}`;
    }

    // New day, start from 0001
    return `INV-${today}-0001`;
  };

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      customer_id: "",
      invoice_number: generateInvoiceNumber(),
      date: dayjs().format("YYYY-MM-DD"),
      due_date: dayjs().add(30, "day").format("YYYY-MM-DD"),
      notes: "",
      status: "draft",
      items: [
        {
          id: crypto.randomUUID(),
          description: "",
          quantity: 1,
          unit_price: 0,
          amount: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Watch items to recalculate amounts
  const items = form.watch("items");

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const vat = subtotal * 0.07; // 7% VAT for Thailand
    const total = subtotal + vat;

    return { subtotal, vat, total };
  };

  const { subtotal, vat, total } = calculateTotals();

  // Add new item
  const handleAddItem = () => {
    append({
      id: crypto.randomUUID(),
      description: "",
      quantity: 1,
      unit_price: 0,
      amount: 0,
    });
  };

  // Remove item
  const handleRemoveItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  // Update amount when quantity or unit_price changes
  const handleItemChange = (index: number) => {
    const item = form.getValues(`items.${index}`);
    const amount = item.quantity * item.unit_price;
    form.setValue(`items.${index}.amount`, amount);
  };

  // Submit form
  const handleSubmit = async (
    data: InvoiceFormData,
    saveStatus: "draft" | "sent",
  ) => {
    setLoading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("กรุณาเข้าสู่ระบบ");
      }

      // Insert invoice
      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .insert({
          user_id: user.id,
          customer_id: data.customer_id,
          invoice_number: data.invoice_number,
          date: data.date,
          due_date: data.due_date || null,
          subtotal: subtotal,
          vat: vat,
          total: total,
          notes: data.notes || null,
          status: saveStatus,
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Insert invoice items
      const itemsToInsert = data.items.map((item) => ({
        invoice_id: invoice.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        amount: item.amount,
      }));

      const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      // Success! Redirect to invoices list
      router.push("/dashboard/invoices");
      router.refresh();
    } catch (err: any) {
      console.error("Error creating invoice:", err);
      alert(err.message || "เกิดข้อผิดพลาดในการสร้างใบเสร็จ");
    } finally {
      setLoading(false);
    }
  };

  const selectedCustomer = customers.find((c) => c.id === form.watch("customer_id"));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/invoices">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับ
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            สร้างใบแจ้งหนี้ใหม่
          </h1>
          <p className="text-muted-foreground">สร้างใบแจ้งหนี้สำหรับลูกค้า</p>
        </div>
      </div>

      {form.formState.errors.root && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
          {form.formState.errors.root.message}
        </div>
      )}

      <div className="space-y-6">
        {/* Invoice Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              รายละเอียดใบแจ้งหนี้
            </CardTitle>
            <CardDescription>ข้อมูลพื้นฐานของใบแจ้งหนี้</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer */}
              <div className="space-y-2">
                <Label htmlFor="customer_id">ลูกค้า *</Label>
                <Select
                  value={form.watch("customer_id")}
                  onValueChange={(value) =>
                    form.setValue("customer_id", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกลูกค้า" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        ไม่มีลูกค้า กรุณาเพิ่มลูกค้าก่อน
                      </div>
                    ) : (
                      customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {form.formState.errors.customer_id && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.customer_id.message}
                  </p>
                )}
                {customers.length === 0 && (
                  <Link href="/dashboard/customers">
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      className="p-0 h-auto"
                    >
                      + เพิ่มลูกค้าใหม่
                    </Button>
                  </Link>
                )}
              </div>

              {/* Invoice Number */}
              <div className="space-y-2">
                <Label htmlFor="invoice_number">เลขที่ใบแจ้งหนี้</Label>
                <Input
                  id="invoice_number"
                  {...form.register("invoice_number")}
                  disabled={loading}
                />
                {form.formState.errors.invoice_number && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.invoice_number.message}
                  </p>
                )}
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">วันที่ออกใบแจ้งหนี้</Label>
                <Input
                  id="date"
                  type="date"
                  {...form.register("date")}
                  disabled={loading}
                />
                {form.formState.errors.date && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.date.message}
                  </p>
                )}
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <Label htmlFor="due_date">วันครบกำหนด</Label>
                <Input
                  id="due_date"
                  type="date"
                  {...form.register("due_date")}
                  disabled={loading}
                />
                {form.formState.errors.due_date && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.due_date.message}
                  </p>
                )}
              </div>
            </div>

            {/* Customer Info Display */}
            {selectedCustomer && (
              <div className="p-4 bg-muted rounded-md">
                <p className="text-sm font-medium mb-2">ข้อมูลลูกค้า:</p>
                <div className="text-sm space-y-1">
                  <p>{selectedCustomer.name}</p>
                  {selectedCustomer.tax_id && (
                    <p className="text-muted-foreground">
                      เลขประจำตัวผู้เสียภาษี: {selectedCustomer.tax_id}
                    </p>
                  )}
                  {selectedCustomer.email && (
                    <p className="text-muted-foreground">
                      อีเมล: {selectedCustomer.email}
                    </p>
                  )}
                  {selectedCustomer.phone && (
                    <p className="text-muted-foreground">
                      โทร: {selectedCustomer.phone}
                    </p>
                  )}
                  {selectedCustomer.address && (
                    <p className="text-muted-foreground">
                      ที่อยู่: {selectedCustomer.address}
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invoice Items Card */}
        <Card>
          <CardHeader>
            <CardTitle>รายการสินค้า/บริการ</CardTitle>
            <CardDescription>
              เพิ่มรายการสินค้าหรือบริการในใบเสร็จ
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Items Table */}
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-12 gap-2 items-start p-3 border rounded-md"
                >
                  {/* Description */}
                  <div className="col-span-12 md:col-span-5">
                    <Label htmlFor={`desc-${field.id}`} className="text-xs">
                      รายละเอียด *
                    </Label>
                    <Input
                      id={`desc-${field.id}`}
                      {...form.register(`items.${index}.description`)}
                      placeholder="เช่น บริการออกแบบเว็บไซต์"
                      disabled={loading}
                    />
                    {form.formState.errors.items?.[index]?.description && (
                      <p className="text-xs text-destructive mt-1">
                        {form.formState.errors.items[index]?.description?.message}
                      </p>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="col-span-4 md:col-span-2">
                    <Label htmlFor={`qty-${field.id}`} className="text-xs">
                      จำนวน
                    </Label>
                    <Input
                      id={`qty-${field.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      {...form.register(`items.${index}.quantity`, {
                        valueAsNumber: true,
                        onChange: () => handleItemChange(index),
                      })}
                      disabled={loading}
                    />
                    {form.formState.errors.items?.[index]?.quantity && (
                      <p className="text-xs text-destructive mt-1">
                        {form.formState.errors.items[index]?.quantity?.message}
                      </p>
                    )}
                  </div>

                  {/* Unit Price */}
                  <div className="col-span-4 md:col-span-2">
                    <Label htmlFor={`price-${field.id}`} className="text-xs">
                      ราคา/หน่วย
                    </Label>
                    <Input
                      id={`price-${field.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      {...form.register(`items.${index}.unit_price`, {
                        valueAsNumber: true,
                        onChange: () => handleItemChange(index),
                      })}
                      disabled={loading}
                    />
                    {form.formState.errors.items?.[index]?.unit_price && (
                      <p className="text-xs text-destructive mt-1">
                        {form.formState.errors.items[index]?.unit_price?.message}
                      </p>
                    )}
                  </div>

                  {/* Amount */}
                  <div className="col-span-3 md:col-span-2">
                    <Label className="text-xs">ยอดรวม</Label>
                    <div className="h-10 flex items-center px-3 bg-muted rounded-md text-sm font-medium">
                      {(form.watch(`items.${index}.amount`) || 0).toLocaleString("th-TH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>

                  {/* Delete Button */}
                  <div className="col-span-1 flex items-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(index)}
                      disabled={fields.length === 1}
                      className="h-10"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {form.formState.errors.items?.message && (
              <p className="text-sm text-destructive">
                {form.formState.errors.items.message}
              </p>
            )}

            {/* Add Item Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleAddItem}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              เพิ่มรายการ
            </Button>

            {/* Totals */}
            <div className="border-t pt-4 mt-4">
              <div className="max-w-sm ml-auto space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    ยอดรวม (ก่อน VAT):
                  </span>
                  <span className="font-medium">
                    ฿
                    {subtotal.toLocaleString("th-TH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">VAT 7%:</span>
                  <span className="font-medium">
                    ฿
                    {vat.toLocaleString("th-TH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>ยอดรวมทั้งสิ้น:</span>
                  <span className="text-primary">
                    ฿
                    {total.toLocaleString("th-TH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes Card */}
        <Card>
          <CardHeader>
            <CardTitle>หมายเหตุ</CardTitle>
            <CardDescription>ข้อความเพิ่มเติม (ไม่บังคับ)</CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              className="w-full min-h-[100px] p-3 border rounded-md resize-y"
              {...form.register("notes")}
              placeholder="เช่น เงื่อนไขการชำระเงิน หรือข้อมูลเพิ่มเติมอื่นๆ"
              disabled={loading}
            />
            {form.formState.errors.notes && (
              <p className="text-sm text-destructive mt-2">
                {form.formState.errors.notes.message}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Link href="/dashboard/invoices">
            <Button type="button" variant="outline">
              ยกเลิก
            </Button>
          </Link>
          <Button
            type="button"
            variant="outline"
            onClick={form.handleSubmit((data) => handleSubmit(data, "draft"))}
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? "กำลังบันทึก..." : "บันทึกแบบร่าง"}
          </Button>
          <Button
            type="button"
            onClick={form.handleSubmit((data) => handleSubmit(data, "sent"))}
            disabled={loading}
          >
            <FileText className="h-4 w-4 mr-2" />
            {loading ? "กำลังบันทึก..." : "บันทึกและส่ง"}
          </Button>
        </div>
      </div>
    </div>
  );
}
