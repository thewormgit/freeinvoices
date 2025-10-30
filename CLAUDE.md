# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

InvoiceThai is a Thai-language invoice management SaaS built with Next.js 16 (App Router), Supabase (PostgreSQL + Auth), and TypeScript. The application allows Thai businesses to manage customers, create invoices with VAT calculations, and handle business profiles. Future features include AI-powered receipt scanning and tax advisory using Anthropic's Claude API.

## Development Commands

```bash
# Start development server (default port 3000)
npm run dev

# Build for production
npm build

# Start production server
npm start

# Run linter
npm run lint
```

## Database Setup

**CRITICAL**: Before the app can function, the database schema must be initialized:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select project: `vtcpvvzlxpqwmnjvvldv`
3. Navigate to **SQL Editor**
4. Copy and execute all SQL from `supabase-schema.sql`

This creates:
- Tables: `profiles`, `customers`, `invoices`, `invoice_items`
- Row Level Security (RLS) policies for multi-tenant isolation
- Automatic triggers for profile creation and timestamp updates

## Architecture

### Authentication System (Currently Disabled)

Authentication is **intentionally disabled** for development. The system uses mock users to bypass auth checks:

- **Middleware**: `lib/supabase/middleware.ts` - Auth code is commented out with "AUTHENTICATION DISABLED FOR TESTING"
- **Dashboard Layout**: `app/(dashboard)/layout.tsx` - Uses mock user object instead of real auth check
- **To Re-enable**: Uncomment the auth code in both files

When enabled, the system uses:
- Supabase Auth with SSR (Server-Side Rendering)
- Cookie-based session management
- Protected routes via middleware and layout checks

### Supabase Client Pattern

**Two distinct client creation patterns**:

1. **Browser Client** (`lib/supabase/client.ts`):
   - Use in Client Components ("use client")
   - Import: `import { createClient } from "@/lib/supabase/client"`

2. **Server Client** (`lib/supabase/server.ts`):
   - Use in Server Components and API routes
   - Import: `import { createClient } from "@/lib/supabase/server"`
   - Uses Next.js cookies API for session management

**Critical**: Always use the correct client for the context. Using browser client in server components will cause auth/session issues.

### Route Groups

Next.js route groups organize pages without affecting URLs:

- `app/(auth)/*` - Public authentication pages (login, register)
- `app/(dashboard)/*` - Protected application pages (dashboard, customers, invoices, settings)
- `app/auth/callback/route.ts` - OAuth callback handler (ungrouped)

### Data Layer Pattern

Components fetch data in the page server component and pass to client components:

```typescript
// Page (Server Component)
export default async function CustomersPage() {
  const supabase = await createClient(); // Server client
  const { data: customers } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });
    
  return <CustomersList customers={customers} />; // Pass to client component
}

// Client Component
export default function CustomersList({ customers }: { customers: Customer[] }) {
  const supabase = createClient(); // Browser client for mutations
  // Handle CRUD operations
}
```

This pattern:
- Fetches data server-side for SEO and performance
- Handles mutations client-side for interactivity
- Uses RLS policies to enforce security

### Database Schema

Key relationships:
- `profiles.id` → references `auth.users(id)` - One profile per user
- `customers.user_id` → references `auth.users(id)` - Multi-tenant isolation
- `invoices.user_id` → references `auth.users(id)` - Multi-tenant isolation
- `invoices.customer_id` → references `customers(id)` - Invoice-customer link
- `invoice_items.invoice_id` → references `invoices(id)` - Line items

**Row Level Security (RLS)**:
- All tables use RLS policies
- Users can only access their own data via `user_id` checks
- Policies auto-filter queries - no manual filtering needed

### Thai Language & Localization

- All UI text is in Thai (except code/comments)
- Date formatting uses `dayjs` with Thai locale support
- Number formatting uses Thai conventions
- VAT rate is hardcoded to 7% (Thailand standard)

### Component Architecture

**UI Components** (`components/ui/*`):
- Based on shadcn/ui (Radix UI + Tailwind CSS)
- Copied into project (not installed as package)
- Customizable and owned by the project

**Feature Components** (`components/*`):
- `dashboard-nav.tsx` - Sidebar navigation with mobile responsive menu
- `customers-list.tsx` - Full CRUD for customers with dialog forms
- `invoices-list.tsx` - Invoice list with search/filter (read-only currently)
- `profile-form.tsx` - Business settings form

**Pattern**: Feature components are client components that handle user interactions and mutations.

## Key Files

### Entry Points
- `app/page.tsx` - Landing page (marketing)
- `app/(dashboard)/dashboard/page.tsx` - Main dashboard with statistics
- `middleware.ts` - Next.js middleware entry (calls Supabase auth middleware)

### Database Types
- `lib/types/database.ts` - TypeScript types generated from Supabase schema
- When schema changes, regenerate types using Supabase CLI: `npx supabase gen types typescript --project-id vtcpvvzlxpqwmnjvvldv`

### Configuration
- `.env.local` - Contains Supabase URL and anon key
- `components.json` - shadcn/ui configuration
- `tailwind.config.js` - Tailwind CSS v4 configuration

## Development Workflow

### Adding a New Feature

1. **Determine if you need a new database table**
   - If yes: Add to `supabase-schema.sql` and run in Supabase SQL Editor
   - Update `lib/types/database.ts` with new types

2. **Create page in appropriate route group**
   - Protected features → `app/(dashboard)/dashboard/[feature]/page.tsx`
   - Public features → `app/[feature]/page.tsx`

3. **Fetch data in server component**
   - Use server Supabase client
   - Pass data as props to client component

4. **Create client component for interactivity**
   - Use browser Supabase client for mutations
   - Handle loading states and errors
   - Use shadcn/ui components for UI

5. **Add navigation link**
   - Update `components/dashboard-nav.tsx` for dashboard features

### Working with Invoices

Invoice creation is **incomplete** (`app/(dashboard)/dashboard/invoices/new/page.tsx` is WIP).

**When implementing**:
- Invoice items are stored in separate `invoice_items` table
- Calculate subtotal from items: `sum(quantity * unit_price)`
- Calculate VAT: `subtotal * 0.07`
- Calculate total: `subtotal + vat`
- Auto-generate invoice number (pattern: `INV-YYYYMMDD-XXXX`)
- Default status: `draft`

### Invoice Status Flow
- `draft` → Invoice being edited
- `sent` → Invoice sent to customer
- `paid` → Payment received

## Common Patterns

### Form Handling
Uses React Hook Form + Zod validation:
```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name required"),
  email: z.string().email("Invalid email"),
});

const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { name: "", email: "" }
});
```

### Data Refresh After Mutations
```typescript
import { useRouter } from "next/navigation";

const router = useRouter();

// After successful mutation
await supabase.from("customers").insert(data);
router.refresh(); // Re-fetches server component data
```

### Search/Filter Pattern
```typescript
const [searchTerm, setSearchTerm] = useState("");

const filtered = items.filter(item =>
  item.name.toLowerCase().includes(searchTerm.toLowerCase())
);
```

## Future AI Features

The project includes `@anthropic-ai/sdk` for planned features:
- Receipt scanning: Upload photo → Claude extracts invoice data
- Tax chatbot: Ask questions about Thai tax law in Thai language
- Smart categorization: Auto-categorize expenses

When implementing:
- Add `ANTHROPIC_API_KEY` to `.env.local`
- Create API route in `app/api/ai/*` for server-side Claude calls
- Use streaming for chatbot responses

## Troubleshooting

### "No rows returned" / Empty data
- Verify `supabase-schema.sql` was executed
- Check RLS policies are enabled in Supabase dashboard
- Confirm user_id matches between tables

### Authentication issues (when re-enabled)
- Clear browser cookies
- Check Supabase Auth settings (email confirmation can block testing)
- Verify environment variables are set

### Type errors with Supabase
- Regenerate types after schema changes
- Ensure correct client import (server vs browser)
- Check that table/column names match schema exactly
