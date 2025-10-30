export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          company_name: string | null
          tax_id: string | null
          phone: string | null
          address: string | null
          promptpay_id: string | null
          logo_url: string | null
          subscription_plan: 'free' | 'pro' | 'business'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          company_name?: string | null
          tax_id?: string | null
          phone?: string | null
          address?: string | null
          promptpay_id?: string | null
          logo_url?: string | null
          subscription_plan?: 'free' | 'pro' | 'business'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_name?: string | null
          tax_id?: string | null
          phone?: string | null
          address?: string | null
          promptpay_id?: string | null
          logo_url?: string | null
          subscription_plan?: 'free' | 'pro' | 'business'
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          user_id: string
          name: string
          tax_id: string | null
          email: string | null
          phone: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          tax_id?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          tax_id?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          user_id: string
          customer_id: string
          invoice_number: string
          date: string
          due_date: string | null
          subtotal: number
          vat: number
          total: number
          notes: string | null
          status: 'draft' | 'sent' | 'paid'
          pdf_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          customer_id: string
          invoice_number: string
          date: string
          due_date?: string | null
          subtotal: number
          vat: number
          total: number
          notes?: string | null
          status?: 'draft' | 'sent' | 'paid'
          pdf_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          customer_id?: string
          invoice_number?: string
          date?: string
          due_date?: string | null
          subtotal?: number
          vat?: number
          total?: number
          notes?: string | null
          status?: 'draft' | 'sent' | 'paid'
          pdf_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      invoice_items: {
        Row: {
          id: string
          invoice_id: string
          description: string
          quantity: number
          unit_price: number
          amount: number
          created_at: string
        }
        Insert: {
          id?: string
          invoice_id: string
          description: string
          quantity: number
          unit_price: number
          amount: number
          created_at?: string
        }
        Update: {
          id?: string
          invoice_id?: string
          description?: string
          quantity?: number
          unit_price?: number
          amount?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
