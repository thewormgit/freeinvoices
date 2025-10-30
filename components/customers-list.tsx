"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Customer = {
  id: string;
  name: string;
  tax_id: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
};

export default function CustomersList({ customers }: { customers: Customer[] }) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    tax_id: "",
    email: "",
    phone: "",
    address: "",
  });

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  );

  const handleOpenDialog = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name,
        tax_id: customer.tax_id || "",
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        name: "",
        tax_id: "",
        email: "",
        phone: "",
        address: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      if (editingCustomer) {
        // Update existing customer
        const { error } = await supabase
          .from("customers")
          .update(formData)
          .eq("id", editingCustomer.id);

        if (error) throw error;
      } else {
        // Create new customer
        const { error } = await supabase
          .from("customers")
          .insert([{ ...formData, user_id: user.id }]);

        if (error) throw error;
      }

      setIsDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error saving customer:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("คุณต้องการลบลูกค้านี้หรือไม่?")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from("customers").delete().eq("id", id);

      if (error) throw error;
      router.refresh();
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Input
          placeholder="ค้นหาลูกค้า..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              เพิ่มลูกค้า
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingCustomer ? "แก้ไขข้อมูลลูกค้า" : "เพิ่มลูกค้าใหม่"}
                </DialogTitle>
                <DialogDescription>
                  กรอกข้อมูลลูกค้าของคุณ
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">ชื่อ *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
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
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">อีเมล</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">เบอร์โทร</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
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
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={loading}
                >
                  ยกเลิก
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "กำลังบันทึก..." : "บันทึก"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Customers Table */}
      {filteredCustomers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-semibold">
            {searchTerm ? "ไม่พบลูกค้า" : "ยังไม่มีลูกค้า"}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {searchTerm
              ? "ลองค้นหาด้วยคำอื่น"
              : "เริ่มต้นเพิ่มลูกค้าแรกของคุณ"}
          </p>
          {!searchTerm && (
            <Button className="mt-4" onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              เพิ่มลูกค้า
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อ</TableHead>
                <TableHead>เบอร์โทร</TableHead>
                <TableHead>อีเมล</TableHead>
                <TableHead className="text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.phone || "-"}</TableCell>
                  <TableCell>{customer.email || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(customer)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(customer.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
