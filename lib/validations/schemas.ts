import { z } from "zod";

// Thai Tax ID validation (13 digits: X-XXXX-XXXXX-XX-X)
const thaiTaxIdRegex = /^\d{13}$|^\d-\d{4}-\d{5}-\d{2}-\d$/;

// Thai phone number validation (10 digits: 0X-XXX-XXXX or 0XX-XXX-XXXX)
const thaiPhoneRegex = /^0\d{9}$|^0\d-\d{3}-\d{4}$|^0\d{2}-\d{3}-\d{4}$/;

// PromptPay ID (10-digit phone or 13-digit ID card number)
const promptPayRegex = /^0\d{9}$|^\d{13}$/;

// Customer form validation schema
export const customerSchema = z.object({
  name: z
    .string()
    .min(1, "กรุณากรอกชื่อ")
    .max(255, "ชื่อยาวเกินไป")
    .trim(),
  tax_id: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "" || thaiTaxIdRegex.test(val.replace(/-/g, "")),
      {
        message: "รูปแบบเลขประจำตัวผู้เสียภาษีไม่ถูกต้อง (ต้องเป็น 13 หลัก)",
      }
    ),
  email: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "" || z.string().email().safeParse(val).success,
      {
        message: "รูปแบบอีเมลไม่ถูกต้อง",
      }
    ),
  phone: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val || val === "" || thaiPhoneRegex.test(val.replace(/-/g, "")),
      {
        message: "รูปแบบเบอร์โทรไม่ถูกต้อง (ต้องเป็น 10 หลัก เช่น 0812345678)",
      }
    ),
  address: z.string().optional().or(z.literal("")),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

// Profile/Settings form validation schema
export const profileSchema = z.object({
  company_name: z
    .string()
    .max(255, "ชื่อบริษัทยาวเกินไป")
    .optional()
    .or(z.literal("")),
  tax_id: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "" || thaiTaxIdRegex.test(val.replace(/-/g, "")),
      {
        message: "รูปแบบเลขประจำตัวผู้เสียภาษีไม่ถูกต้อง (ต้องเป็น 13 หลัก)",
      }
    ),
  phone: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val || val === "" || thaiPhoneRegex.test(val.replace(/-/g, "")),
      {
        message: "รูปแบบเบอร์โทรไม่ถูกต้อง (ต้องเป็น 10 หลัก เช่น 0812345678)",
      }
    ),
  address: z.string().optional().or(z.literal("")),
  promptpay_id: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val || val === "" || promptPayRegex.test(val.replace(/-/g, "")),
      {
        message:
          "รูปแบบ PromptPay ID ไม่ถูกต้อง (ต้องเป็นเบอร์โทร 10 หลัก หรือเลขบัตรประชาชน 13 หลัก)",
      }
    ),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// Invoice item validation schema
export const invoiceItemSchema = z.object({
  id: z.string(),
  description: z
    .string()
    .min(1, "กรุณากรอกรายละเอียดสินค้า/บริการ")
    .max(500, "รายละเอียดยาวเกินไป"),
  quantity: z
    .number()
    .min(0.01, "จำนวนต้องมากกว่า 0")
    .max(999999, "จำนวนมากเกินไป"),
  unit_price: z
    .number()
    .min(0, "ราคาต้องไม่ติดลบ")
    .max(99999999, "ราคามากเกินไป"),
  amount: z.number(),
});

// Invoice form validation schema
export const invoiceSchema = z
  .object({
    customer_id: z.string().min(1, "กรุณาเลือกลูกค้า"),
    invoice_number: z
      .string()
      .min(1, "กรุณากรอกเลขที่ใบแจ้งหนี้")
      .max(50, "เลขที่ใบแจ้งหนี้ยาวเกินไป"),
    date: z.string().min(1, "กรุณาเลือกวันที่"),
    due_date: z.string().optional().or(z.literal("")),
    notes: z.string().optional().or(z.literal("")),
    status: z.enum(["draft", "sent", "paid"]),
    items: z
      .array(invoiceItemSchema)
      .min(1, "กรุณาเพิ่มรายการสินค้า/บริการอย่างน้อย 1 รายการ"),
  })
  .refine(
    (data) => {
      // Validate due_date is after or equal to date
      if (data.due_date && data.due_date !== "") {
        return new Date(data.due_date) >= new Date(data.date);
      }
      return true;
    },
    {
      message: "วันครบกำหนดต้องไม่อยู่ก่อนวันที่ออกใบแจ้งหนี้",
      path: ["due_date"],
    }
  );

export type InvoiceFormData = z.infer<typeof invoiceSchema>;

// Login form validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "กรุณากรอกอีเมล")
    .email("รูปแบบอีเมลไม่ถูกต้อง")
    .toLowerCase()
    .trim(),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Register form validation schema
export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "กรุณากรอกอีเมล")
      .email("รูปแบบอีเมลไม่ถูกต้อง")
      .toLowerCase()
      .trim(),
    password: z
      .string()
      .min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร")
      .max(72, "รหัสผ่านยาวเกินไป"),
    confirmPassword: z.string().min(1, "กรุณายืนยันรหัสผ่าน"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
