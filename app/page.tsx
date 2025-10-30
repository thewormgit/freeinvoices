import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">InvoiceThai</h1>
          <nav className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">เข้าสู่ระบบ</Button>
            </Link>
            <Link href="/register">
              <Button>ลงทะเบียน</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
              ระบบออกใบเสร็จออนไลน์
              <br />
              <span className="text-primary">สำหรับธุรกิจไทย</span>
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              สร้างและจัดการใบเสร็จรับเงินได้ง่ายๆ ด้วย AI รองรับภาษีมูลค่าเพิ่ม
              7% และ QR Code PromptPay
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg">เริ่มใช้งานฟรี</Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  ดูตัวอย่าง
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mx-auto mt-24 max-w-5xl">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border p-6">
                <h3 className="text-lg font-semibold">สร้างใบเสร็จง่ายๆ</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  สร้างใบเสร็จมืออาชีพได้ในไม่กี่นาที พร้อมคำนวณ VAT อัตโนมัติ
                </p>
              </div>
              <div className="rounded-lg border p-6">
                <h3 className="text-lg font-semibold">สแกนใบเสร็จด้วย AI</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  ถ่ายรูปใบเสร็จแล้วให้ AI แปลงเป็นใบเสร็จดิจิทัลอัตโนมัติ
                </p>
              </div>
              <div className="rounded-lg border p-6">
                <h3 className="text-lg font-semibold">QR Code PromptPay</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  สร้าง QR Code สำหรับรับเงินผ่าน PromptPay ได้ทันที
                </p>
              </div>
              <div className="rounded-lg border p-6">
                <h3 className="text-lg font-semibold">จัดการลูกค้า</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  เก็บข้อมูลลูกค้าและประวัติการทำธุรกรรมไว้ในที่เดียว
                </p>
              </div>
              <div className="rounded-lg border p-6">
                <h3 className="text-lg font-semibold">ดาวน์โหลด PDF</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  ดาวน์โหลดใบเสร็จเป็น PDF หรือส่งอีเมลถึงลูกค้าได้เลย
                </p>
              </div>
              <div className="rounded-lg border p-6">
                <h3 className="text-lg font-semibold">ที่ปรึกษาภาษี AI</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  ถามคำถามเกี่ยวกับภาษีและกฎหมายไทยกับ AI ได้ตลอดเวลา
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Preview */}
          <div className="mx-auto mt-24 max-w-4xl text-center">
            <h3 className="text-2xl font-bold">แพ็กเกจราคา</h3>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              <div className="rounded-lg border p-6">
                <h4 className="text-lg font-semibold">ฟรี</h4>
                <p className="mt-2 text-3xl font-bold">฿0</p>
                <p className="text-sm text-muted-foreground">/ เดือน</p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li>5 ใบเสร็จ/เดือน</li>
                  <li>มีลายน้ำ</li>
                </ul>
              </div>
              <div className="rounded-lg border-2 border-primary p-6">
                <h4 className="text-lg font-semibold">Pro</h4>
                <p className="mt-2 text-3xl font-bold">฿399</p>
                <p className="text-sm text-muted-foreground">/ เดือน</p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li>ใบเสร็จไม่จำกัด</li>
                  <li>AI Scanner (20 ครั้ง/เดือน)</li>
                  <li>ไม่มีลายน้ำ</li>
                </ul>
              </div>
              <div className="rounded-lg border p-6">
                <h4 className="text-lg font-semibold">Business</h4>
                <p className="mt-2 text-3xl font-bold">฿799</p>
                <p className="text-sm text-muted-foreground">/ เดือน</p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li>ทุกอย่างใน Pro</li>
                  <li>AI ไม่จำกัด</li>
                  <li>หลายผู้ใช้</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 InvoiceThai. สงวนลิขสิทธิ์.
        </div>
      </footer>
    </div>
  );
}
