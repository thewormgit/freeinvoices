"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

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

  const [formData, setFormData] = useState({
    company_name: profile?.company_name || "",
    tax_id: profile?.tax_id || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
    promptpay_id: profile?.promptpay_id || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          ...formData,
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 px-4 py-3 rounded-md text-sm">
          บันทึกข้อมูลสำเร็จ!
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="company_name">ชื่อบริษัท/ร้านค้า</Label>
        <Input
          id="company_name"
          value={formData.company_name}
          onChange={(e) =>
            setFormData({ ...formData, company_name: e.target.value })
          }
          placeholder="บริษัท ABC จำกัด"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tax_id">เลขประจำตัวผู้เสียภาษี</Label>
        <Input
          id="tax_id"
          value={formData.tax_id}
          onChange={(e) =>
            setFormData({ ...formData, tax_id: e.target.value })
          }
          placeholder="0-0000-00000-00-0"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) =>
            setFormData({ ...formData, phone: e.target.value })
          }
          placeholder="02-XXX-XXXX"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">ที่อยู่</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          placeholder="123 ถนน... แขวง... เขต... กรุงเทพฯ 10XXX"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="promptpay_id">PromptPay ID (เบอร์โทร หรือ เลขบัตรประชาชน)</Label>
        <Input
          id="promptpay_id"
          value={formData.promptpay_id}
          onChange={(e) =>
            setFormData({ ...formData, promptpay_id: e.target.value })
          }
          placeholder="0812345678"
        />
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
