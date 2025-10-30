# InvoiceThai - Setup Guide

ระบบออกใบเสร็จออนไลน์สำหรับธุรกิจไทย

## 🚀 Quick Start

### 1. Setup Supabase Database

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `vtcpvvzlxpqwmnjvvldv`
3. Go to **SQL Editor**
4. Copy and paste the entire contents of `supabase-schema.sql`
5. Click **Run** to execute the SQL

This will create:
- `profiles` table (user business info)
- `customers` table
- `invoices` table
- `invoice_items` table
- Row Level Security (RLS) policies
- Auto-triggers for profile creation and timestamps

### 2. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Test the Application

1. **Landing Page** (`/`)
   - View the hero section and features
   - Click "ลงทะเบียน" (Register)

2. **Register** (`/register`)
   - Create a new account
   - Email: `test@example.com`
   - Password: `password123`

3. **Login** (`/login`)
   - Sign in with your credentials

4. **Dashboard** (`/dashboard`)
   - View summary cards (invoices, customers, revenue)
   - See empty state since no data yet

5. **Customers** (`/dashboard/customers`)
   - Click "เพิ่มลูกค้า" (Add Customer)
   - Add a test customer:
     - Name: ร้านอาหารเจ๊ไก่
     - Tax ID: 0-1234-56789-01-2
     - Email: jekai@example.com
     - Phone: 02-123-4567
     - Address: 123 ถนนสุขุมวิท กรุงเทพฯ

6. **Settings** (`/dashboard/settings`)
   - Fill in your business information:
     - Company name: บริษัท ทดสอบ จำกัด
     - Tax ID: 0-9999-88888-77-6
     - Phone: 02-999-8888
     - Address: 456 ถนนพระราม 4 กรุงเทพฯ
     - PromptPay ID: 0899998888
   - Click "บันทึกข้อมูล" (Save)

7. **Invoices** (`/dashboard/invoices`)
   - View empty state
   - Click "สร้างใบเสร็จใหม่" (placeholder for now)

## ✅ What's Working

- ✅ Landing page with Thai language
- ✅ User authentication (register/login)
- ✅ Dashboard with summary statistics
- ✅ Customer management (CRUD operations)
- ✅ Profile/settings management
- ✅ Invoice list view
- ✅ Mobile responsive navigation
- ✅ Row Level Security (RLS)
- ✅ Real-time data updates

## 🚧 What's Next (To Build)

- ⏳ Invoice creation form with line items
- ⏳ Auto-calculate VAT 7%
- ⏳ PDF generation with Thai fonts
- ⏳ Claude AI receipt scanner
- ⏳ Thai tax chatbot
- ⏳ PromptPay QR code generation
- ⏳ Email invoices to customers
- ⏳ Dashboard charts and analytics

## 📁 Project Structure

```
app/
├── (auth)/              # Authentication pages
│   ├── login/          # Login page
│   └── register/       # Register page
├── (dashboard)/        # Protected dashboard pages
│   └── dashboard/
│       ├── page.tsx    # Dashboard home
│       ├── customers/  # Customer management
│       ├── invoices/   # Invoice management
│       └── settings/   # User settings
├── auth/callback/      # Auth callback handler
└── page.tsx           # Landing page

components/
├── ui/                # shadcn/ui components
├── customers-list.tsx # Customer CRUD component
├── invoices-list.tsx  # Invoice list component
├── dashboard-nav.tsx  # Sidebar navigation
└── profile-form.tsx   # Settings form

lib/
├── supabase/
│   ├── client.ts      # Browser client
│   ├── server.ts      # Server client
│   └── middleware.ts  # Auth middleware
└── types/
    └── database.ts    # TypeScript types
```

## 🔑 Environment Variables

Already configured in `.env.local`:
- ✅ NEXT_PUBLIC_SUPABASE_URL
- ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
- ⏳ ANTHROPIC_API_KEY (add when ready for AI features)

## 🐛 Troubleshooting

### "No rows returned" error
- Make sure you ran `supabase-schema.sql` in Supabase SQL Editor
- Check that RLS policies are enabled

### Login redirects to login page
- Clear cookies and try again
- Check Supabase Auth settings (disable email confirmation for testing)

### Data not showing
- Check browser console for errors
- Verify user_id matches in database

## 📚 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Icons**: Lucide React

## 🎯 Development Workflow

1. Always work on one feature at a time
2. Test in the browser after each change
3. Check the database in Supabase dashboard
4. Use Thai language for all UI text
5. Keep mobile-responsive in mind

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check Supabase logs
3. Verify environment variables
4. Review the code in VS Code

---

**Ready to build the invoice form?** Let's create it next! 🚀
