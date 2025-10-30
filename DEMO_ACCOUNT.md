# 🎭 Demo Account for Testing

## Login Credentials

**Email**: `demo@invoicethai.com`  
**Password**: `demo123456`

---

## How to Use

1. Go to http://localhost:3000
2. Click **เข้าสู่ระบบ** (Login)
3. Enter:
   - Email: `demo@invoicethai.com`
   - Password: `demo123456`
4. Click **เข้าสู่ระบบ**

---

## Alternative Test Accounts

If you need multiple accounts for testing:

### Account 1 (Main Demo)
- **Email**: `demo@invoicethai.com`
- **Password**: `demo123456`

### Account 2 (Restaurant Owner)
- **Email**: `restaurant@test.com`
- **Password**: `test123456`

### Account 3 (Freelancer)
- **Email**: `freelance@test.com`
- **Password**: `test123456`

### Account 4 (Small Business)
- **Email**: `shop@test.com`
- **Password**: `test123456`

---

## Pre-filled Test Data

After logging in with the demo account, you can add this test data:

### Business Profile (Settings)
```
Company Name: ร้านอาหารเจ๊ไก่
Tax ID: 0-1234-56789-01-2
Phone: 02-123-4567
Address: 123 ถนนสุขุมวิท แขวงคลองเตย เขต คลองเตย กรุงเทพฯ 10110
PromptPay ID: 0812345678
```

### Test Customers

**Customer 1 - Individual**
```
Name: คุณสมชาย ใจดี
Email: somchai@example.com
Phone: 098-765-4321
Address: 456 ถนนพระราม 4 กรุงเทพฯ 10400
```

**Customer 2 - Company**
```
Name: บริษัท ABC จำกัด
Tax ID: 0-9876-54321-01-0
Email: info@abc.co.th
Phone: 02-987-6543
Address: 789 ถนนสีลม บางรัก กรุงเทพฯ 10500
```

**Customer 3 - Restaurant**
```
Name: โรงแรมดี มาร์ค
Email: contact@dmark.com
Phone: 02-111-2222
Address: 321 ถนนเพชรบุรี ราชเทวี กรุงเทพฯ 10400
```

**Customer 4 - Tour Guide**
```
Name: คุณสมหญิง ไกด์ทัวร์
Email: somying.tour@gmail.com
Phone: 089-999-8888
Address: 555 ถนนข้าวสาร จตุจักร กรุงเทพฯ 10900
```

---

## Quick Registration

If you want to create your own account instead:

1. Go to http://localhost:3000/register
2. Enter any email (doesn't need to be real for local testing)
3. Password: minimum 6 characters
4. Click **ลงทะเบียน**

**Note**: If email confirmation is enabled in Supabase:
- Go to Supabase Dashboard → Authentication → Settings
- Disable "Enable email confirmations" for easier testing
- Or check your email for confirmation link

---

## Reset Instructions

If you need to reset the demo account:

1. Go to Supabase Dashboard
2. Navigate to Authentication → Users
3. Find the user `demo@invoicethai.com`
4. Delete the user
5. Register again with the same credentials

---

## Important Notes

⚠️ **Before logging in, make sure you:**
1. Ran the `supabase-schema.sql` in Supabase SQL Editor
2. The dev server is running (`npm run dev`)
3. Environment variables are correctly set in `.env.local`

✅ **What you can test:**
- Register new account
- Login/Logout
- Add/edit/delete customers
- Update business profile
- View dashboard statistics
- Navigate mobile menu
- Search customers

🚧 **Not yet available:**
- Creating invoices (placeholder page)
- PDF generation
- AI features

---

## Troubleshooting

### Can't login?
- Make sure you ran the database schema first
- Check Supabase Auth is enabled
- Disable email confirmation in Supabase settings

### "User already exists"?
- The email is already registered
- Try a different email or delete the user in Supabase Dashboard

### Data not showing?
- Check RLS policies are enabled
- Verify the user was created properly
- Check browser console for errors

---

**Ready to test!** 🚀

Use `demo@invoicethai.com` / `demo123456` to login and explore the app.
