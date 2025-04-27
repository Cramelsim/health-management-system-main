import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req: Request) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  // Get client ID from URL
  const url = new URL(req.url);
  const clientId = url.pathname.split("/").pop();

  // Check for API key
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Missing or invalid API key",
      }),
      {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  // Validate API key - in a real implementation, you would check this against a stored value
  // For demo purposes, we're accepting any API key
  const apiKey = authHeader.split(" ")[1];
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Invalid API key format",
      }),
      {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (!clientId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Client ID is required",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get client data
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("*")
      .eq("id", clientId)
      .single();

    if (clientError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: clientError.message,
        }),
        {
          status: clientError.code === "PGRST116" ? 404 : 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get client programs
    const { data: enrollments, error: programsError } = await supabase
      .from("enrollments")
      .select(`
        id,
        enrollment_date,
        status,
        programs (
          id,
          name,
          description
        )
      `)
      .eq("client_id", clientId);

    if (programsError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: programsError.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Transform programs data
    const programs = enrollments.map((enrollment) => ({
      id: enrollment.programs.id,
      name: enrollment.programs.name,
      enrollment_status: enrollment.status,
      enrollment_date: enrollment.enrollment_date,
    }));

    // Return client data with programs
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          ...client,
          programs,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});