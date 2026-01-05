import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface BookingData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  preferred_date?: string;
  preferred_time?: string;
  topic?: string;
  message?: string;
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

    const bookingData: BookingData = await req.json();

    const { data, error } = await supabase
      .from("booking_requests")
      .insert({
        name: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone || null,
        company: bookingData.company || null,
        preferred_date: bookingData.preferred_date || null,
        preferred_time: bookingData.preferred_time || null,
        topic: bookingData.topic || null,
        message: bookingData.message || null,
        status: "pending",
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
            type: "booking",
            name: bookingData.name,
            email: bookingData.email,
            phone: bookingData.phone || "",
            company: bookingData.company || "",
            preferred_date: bookingData.preferred_date || "",
            preferred_time: bookingData.preferred_time || "",
            topic: bookingData.topic || "",
            message: bookingData.message || "",
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
