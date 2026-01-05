export interface Database {
  public: {
    Tables: {
      product_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          display_order: number;
          parent_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          display_order?: number;
          parent_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          display_order?: number;
          parent_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          category_id: string | null;
          short_description: string | null;
          full_description: string | null;
          specifications: Record<string, unknown>;
          featured_image: string | null;
          gallery_images: string[];
          is_featured: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          category_id?: string | null;
          short_description?: string | null;
          full_description?: string | null;
          specifications?: Record<string, unknown>;
          featured_image?: string | null;
          gallery_images?: string[];
          is_featured?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          category_id?: string | null;
          short_description?: string | null;
          full_description?: string | null;
          specifications?: Record<string, unknown>;
          featured_image?: string | null;
          gallery_images?: string[];
          is_featured?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string | null;
          featured_image: string | null;
          author: string;
          publish_date: string;
          is_published: boolean;
          meta_title: string | null;
          meta_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content?: string | null;
          featured_image?: string | null;
          author?: string;
          publish_date?: string;
          is_published?: boolean;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: string | null;
          featured_image?: string | null;
          author?: string;
          publish_date?: string;
          is_published?: boolean;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          company: string | null;
          inquiry_type: string;
          source_page: string | null;
          message: string | null;
          product_id: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          company?: string | null;
          inquiry_type?: string;
          source_page?: string | null;
          message?: string | null;
          product_id?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          company?: string | null;
          inquiry_type?: string;
          source_page?: string | null;
          message?: string | null;
          product_id?: string | null;
          status?: string;
          created_at?: string;
        };
      };
      booking_requests: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          company: string | null;
          preferred_date: string | null;
          preferred_time: string | null;
          topic: string | null;
          message: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          company?: string | null;
          preferred_date?: string | null;
          preferred_time?: string | null;
          topic?: string | null;
          message?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          company?: string | null;
          preferred_date?: string | null;
          preferred_time?: string | null;
          topic?: string | null;
          message?: string | null;
          status?: string;
          created_at?: string;
        };
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: string | null;
          updated_at?: string;
        };
      };
    };
  };
}

export type ProductCategory = Database['public']['Tables']['product_categories']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
export type Lead = Database['public']['Tables']['leads']['Row'];
export type BookingRequest = Database['public']['Tables']['booking_requests']['Row'];
export type SiteSetting = Database['public']['Tables']['site_settings']['Row'];

export type ProductWithCategory = Product & {
  product_categories: ProductCategory | null;
};
