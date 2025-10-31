"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { profileSchema, type ProfileFormData } from "@/lib/validations/schemas";

type Profile = {
  id: string;
  company_name: string | null;
  tax_id: string | null;
  phone: string | null;
  address: string | null;
  promptpay_id: string | null;
  subscription_plan: string;
} | null;

export default function ProfileForm({
  profile,
  userEmail,
}: {
  profile: Profile;
  userEmail: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      company_name: profile?.company_name || "",
      tax_id: profile?.tax_id || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
      promptpay_id: profile?.promptpay_id || "",
    },
  });

  const handleSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    setSuccess(false);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          ...data,
        });

      if (error) throw error;

      setSuccess(true);
      router.refresh();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 px-4 py-3 rounded-md text-sm">
          บันทึกข้อมูลสำเร็จ!
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="company_name">ชื่อบริษัท/ร้านค้า</Label>
        <Input
          id="company_name"
          {...form.register("company_name")}
          placeholder="บริษัท ABC จำกัด"
          disabled={loading}
        />
        {form.formState.errors.company_name && (
          <p className="text-sm text-destructive">
            {form.formState.errors.company_name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tax_id">เลขประจำตัวผู้เสียภาษี</Label>
        <Input
          id="tax_id"
          {...form.register("tax_id")}
          placeholder="1234567890123 หรือ 1-2345-67890-12-3"
          disabled={loading}
        />
        {form.formState.errors.tax_id && (
          <p className="text-sm text-destructive">
            {form.formState.errors.tax_id.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
        <Input
          id="phone"
          {...form.register("phone")}
          placeholder="0812345678 หรือ 02-123-4567"
          disabled={loading}
        />
        {form.formState.errors.phone && (
          <p className="text-sm text-destructive">
            {form.formState.errors.phone.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">ที่อยู่</Label>
        <Input
          id="address"
          {...form.register("address")}
          placeholder="123 ถนน... แขวง... เขต... กรุงเทพฯ 10XXX"
          disabled={loading}
        />
        {form.formState.errors.address && (
          <p className="text-sm text-destructive">
            {form.formState.errors.address.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="promptpay_id">PromptPay ID (เบอร์โทร หรือ เลขบัตรประชาชน)</Label>
        <Input
          id="promptpay_id"
          {...form.register("promptpay_id")}
          placeholder="0812345678 หรือ 1234567890123"
          disabled={loading}
        />
        {form.formState.errors.promptpay_id && (
          <p className="text-sm text-destructive">
            {form.formState.errors.promptpay_id.message}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          สำหรับสร้าง QR Code รับเงินในใบเสร็จ
        </p>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
      </Button>
    </form>
  );
}
