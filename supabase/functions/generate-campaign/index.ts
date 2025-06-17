
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    
    console.log('Received campaign request:', requestData);

    // Make the request to N8N webhook directly with the request data
    const webhookUrl = 'https://andrewoconnor.app.n8n.cloud/webhook/generate-campaign-plan';
    
    console.log('Sending request data directly to N8N:', requestData);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData) // Send the request data directly
    });

    if (!response.ok) {
      console.error(`N8N webhook error! status: ${response.status}`);
      const errorText = await response.text();
      console.error('N8N error response:', errorText);
      throw new Error(`N8N webhook error! status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Raw N8N response:', responseData);
    
    // Parse the stringified weeks JSON
    let parsedResponse = responseData;
    if (responseData.weeks && typeof responseData.weeks === 'string') {
      try {
        parsedResponse.weeks = JSON.parse(responseData.weeks);
        console.log('Successfully parsed weeks data:', parsedResponse.weeks);
      } catch (parseError) {
        console.error('Failed to parse weeks JSON:', parseError);
        console.error('Raw weeks string:', responseData.weeks);
        // Return error response if parsing fails
        return new Response(
          JSON.stringify({ 
            error: 'Failed to parse campaign data',
            details: parseError.message,
            rawWeeks: responseData.weeks
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    return new Response(
      JSON.stringify(parsedResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in generate-campaign function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate campaign', 
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
