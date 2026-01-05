import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface LeadData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  inquiry_type?: string;
  source_page?: string;
  message?: string;
  product_id?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const googleSheetsWebhook = Deno.env.get("GOOGLE_SHEETS_WEBHOOK_URL");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const leadData: LeadData = await req.json();

    const { data, error } = await supabase
      .from("leads")
      .insert({
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone || null,
        company: leadData.company || null,
        inquiry_type: leadData.inquiry_type || "general",
        source_page: leadData.source_page || null,
        message: leadData.message || null,
        product_id: leadData.product_id || null,
        status: "new",
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (googleSheetsWebhook) {
      try {
        await fetch(googleSheetsWebhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            name: leadData.name,
            email: leadData.email,
            phone: leadData.phone || "",
            company: leadData.company || "",
            inquiry_type: leadData.inquiry_type || "general",
            source_page: leadData.source_page || "",
            message: leadData.message || "",
            product_id: leadData.product_id || "",
          }),
        });
      } catch (sheetsError) {
        console.error("Google Sheets error:", sheetsError);
      }
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
