"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye } from "lucide-react";
import Link from "next/link";

type Invoice = {
  id: string;
  invoice_number: string;
  date: string;
  total: number;
  status: "draft" | "sent" | "paid";
  customer: {
    name: string;
  } | null;
};

export default function InvoicesList({ invoices }: { invoices: Invoice[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-600">ชำระแล้ว</Badge>;
      case "sent":
        return <Badge className="bg-blue-600">ส่งแล้ว</Badge>;
      case "draft":
        return <Badge variant="secondary">ฉบับร่าง</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="ค้นหาเลขที่ใบเสร็จหรือชื่อลูกค้า..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="สถานะ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด</SelectItem>
            <SelectItem value="draft">ฉบับร่าง</SelectItem>
            <SelectItem value="sent">ส่งแล้ว</SelectItem>
            <SelectItem value="paid">ชำระแล้ว</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Invoices Table */}
      {filteredInvoices.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-semibold">
            {searchTerm || statusFilter !== "all"
              ? "ไม่พบใบเสร็จ"
              : "ยังไม่มีใบเสร็จ"}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {searchTerm || statusFilter !== "all"
              ? "ลองค้นหาด้วยคำอื่นหรือเปลี่ยนตัวกรอง"
              : "เริ่มต้นสร้างใบเสร็จแรกของคุณ"}
          </p>
          {!searchTerm && statusFilter === "all" && (
            <Link href="/dashboard/invoices/new">
              <Button className="mt-4">
                <FileText className="mr-2 h-4 w-4" />
                สร้างใบเสร็จใหม่
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>เลขที่</TableHead>
                <TableHead>ลูกค้า</TableHead>
                <TableHead>วันที่</TableHead>
                <TableHead>ยอดรวม</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow
                  key={invoice.id}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell className="font-medium">
                    <Link
                      href={`/dashboard/invoices/${invoice.id}`}
                      className="hover:underline"
                    >
                      {invoice.invoice_number}
                    </Link>
                  </TableCell>
                  <TableCell>{invoice.customer?.name || "-"}</TableCell>
                  <TableCell>
                    {new Date(invoice.date).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    ฿
                    {Number(invoice.total).toLocaleString("th-TH", {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/dashboard/invoices/${invoice.id}`}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground h-9 px-3"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      ดู
                    </Link>
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
