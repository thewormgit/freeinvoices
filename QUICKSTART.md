# 🚀 InvoiceThai - Quick Start

## ✅ Your App is Running!

**Server URL**: http://localhost:3000

---

## 📋 Next Steps

### 1️⃣ **Setup Supabase Database** (REQUIRED!)

Before you can use the app, you MUST run the database schema:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **vtcpvvzlxpqwmnjvvldv**
3. Click **SQL Editor** in the left sidebar
4. Open `supabase-schema.sql` from your project folder
5. Copy all the SQL code
6. Paste it into the Supabase SQL Editor
7. Click **Run** (or press Ctrl+Enter)

**What this does:**
- Creates `profiles`, `customers`, `invoices`, and `invoice_items` tables
- Sets up Row Level Security (RLS) policies
- Creates auto-triggers for user profiles and timestamps

---

### 2️⃣ **Test the Application**

#### **A. Visit the Landing Page**
- Open http://localhost:3000
- You should see the Thai invoice SaaS landing page
- Click "ลงทะเบียน" (Register)

#### **B. Create an Account**
- Email: `test@example.com`
- Password: `password123` (minimum 6 characters)
- Click "ลงทะเบียน"

**Note**: If email confirmation is enabled in Supabase, you'll need to check your email. To disable it:
1. Go to Supabase Dashboard → Authentication → Settings
2. Disable "Enable email confirmations"

#### **C. Explore the Dashboard**
After login, you'll see:
- **แดชบอร์ด** (Dashboard) - Summary cards with statistics
- **ลูกค้า** (Customers) - Customer management
- **ใบเสร็จ** (Invoices) - Invoice list (empty for now)
- **ตั้งค่า** (Settings) - Business profile

#### **D. Add Your Business Info**
1. Click **ตั้งค่า** (Settings)
2. Fill in:
   - Company name: `ร้านอาหารเจ๊ไก่`
   - Tax ID: `0-1234-56789-01-2`
   - Phone: `02-123-4567`
   - Address: `123 ถนนสุขุมวิท กรุงเทพฯ 10110`
   - PromptPay ID: `0812345678`
3. Click **บันทึกข้อมูล** (Save)

#### **E. Add Customers**
1. Click **ลูกค้า** (Customers)
2. Click **เพิ่มลูกค้า** (Add Customer)
3. Add test customers:
   - **Customer 1**:
     - Name: `คุณสมชาย ใจดี`
     - Email: `somchai@example.com`
     - Phone: `098-765-4321`
     - Address: `456 ถนนพระราม 4 กรุงเทพฯ`
   - **Customer 2**:
     - Name: `บริษัท ABC จำกัด`
     - Tax ID: `0-9876-54321-01-0`
     - Email: `info@abc.co.th`
     - Phone: `02-987-6543`
4. Test the search feature!

#### **F. Check Dashboard Statistics**
1. Go back to **แดชบอร์ด** (Dashboard)
2. You should see:
   - Total customers: 2
   - Other statistics (will populate when you add invoices)

---

### 3️⃣ **What's Working**

✅ **Authentication**
- User registration
- User login
- Session management
- Protected routes

✅ **Customer Management**
- Add customers
- Edit customers
- Delete customers
- Search customers
- Full CRUD operations

✅ **Settings**
- Update business profile
- Store PromptPay ID
- View account info

✅ **Dashboard**
- Summary statistics
- Recent invoices list (empty state)
- Mobile responsive

✅ **Security**
- Row Level Security (RLS)
- Each user can only see their own data
- Auth middleware protecting routes

---

### 4️⃣ **What's Next to Build**

The foundation is complete! Here's what we can build next:

#### **Option A: Invoice Creation Form** (Most Important!)
The core feature for creating invoices with:
- Customer selector dropdown
- Dynamic line items (add/remove rows)
- Auto-calculate VAT 7%
- Save as draft/sent/paid
- Auto-generate invoice numbers

#### **Option B: PDF Generation**
Generate professional PDF invoices with:
- Thai fonts (Sarabun/Prompt)
- Company logo
- PromptPay QR code
- Download or email to customer

#### **Option C: AI Features**
- Receipt scanner (upload photo, Claude extracts data)
- Tax chatbot (ask questions about Thai tax law)
- Smart categorization

#### **Option D: Analytics & Reports**
- Revenue charts
- Monthly reports
- Export to Excel
- Customer insights

---

## 🔧 Troubleshooting

### "Invalid supabaseUrl" Error
- ✅ **FIXED!** Environment variables are now correctly configured

### Database Errors
- Make sure you ran `supabase-schema.sql` in Supabase SQL Editor
- Check Supabase logs: Dashboard → Database → Logs

### Login Not Working
- Check Supabase Auth settings
- Disable email confirmation for testing
- Check browser console for errors

### Data Not Showing
- Verify RLS policies are enabled
- Check that user_id matches your auth.users id
- Look at Network tab in browser DevTools

---

## 📁 Project Structure

```
app/
├── (auth)/                    # Auth pages (login, register)
├── (dashboard)/dashboard/     # Protected pages
│   ├── page.tsx              # Dashboard home
│   ├── customers/            # Customer management
│   ├── invoices/             # Invoice pages
│   └── settings/             # Settings
├── page.tsx                  # Landing page
└── auth/callback/            # OAuth callback

components/
├── ui/                       # shadcn/ui components
├── customers-list.tsx        # Customer CRUD
├── invoices-list.tsx         # Invoice list
├── dashboard-nav.tsx         # Sidebar navigation
└── profile-form.tsx          # Settings form

lib/
├── supabase/
│   ├── client.ts            # Browser client
│   ├── server.ts            # Server client
│   └── middleware.ts        # Auth middleware
└── types/database.ts        # TypeScript types
```

---

## 🎯 Current Status

**Completed**: 60% of MVP ✅
- Authentication system
- Customer management
- Dashboard with analytics
- Settings/profile
- Mobile responsive UI
- Database with RLS

**Remaining**: 40%
- Invoice creation form
- PDF generation
- AI features (receipt scanner, chatbot)

---

## 💡 Tips

1. **Keep the dev server running** - It auto-reloads on changes
2. **Check Supabase Dashboard** - See your data in real-time
3. **Use Browser DevTools** - Network tab shows all API calls
4. **Test on mobile** - Resize browser to check responsive design
5. **Read the code** - Everything is well-commented

---

## 🎊 You're All Set!

Your Thai Invoice SaaS is running at **http://localhost:3000**

**Ready to build the invoice creation form?** That's the most critical feature!

Just let me know when you're ready to continue. 🚀
