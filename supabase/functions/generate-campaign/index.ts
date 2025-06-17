

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

    // Make the request to N8N webhook with text/plain content-type to match working version
    const webhookUrl = 'https://andrewoconnor.app.n8n.cloud/webhook/generate-campaign-plan';
    
    console.log('Sending request to N8N webhook:', webhookUrl);
    console.log('Request payload:', requestData);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8'
      },
      body: JSON.stringify(requestData)
    });

    console.log('N8N response status:', response.status);
    console.log('N8N response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`N8N webhook error! status: ${response.status}`);
      console.error('N8N error response text:', errorText);
      
      return new Response(
        JSON.stringify({ 
          error: 'N8N webhook failed',
          status: response.status,
          details: errorText
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get the response text first to check if it's empty
    const responseText = await response.text();
    console.log('N8N raw response text:', responseText);
    console.log('Response text length:', responseText.length);

    if (!responseText || responseText.trim() === '') {
      console.error('N8N returned empty response');
      return new Response(
        JSON.stringify({ 
          error: 'N8N returned empty response',
          details: 'The webhook responded successfully but returned no data'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Try to parse the JSON response
    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log('Successfully parsed N8N response:', responseData);
    } catch (parseError) {
      console.error('Failed to parse N8N response as JSON:', parseError);
      console.error('Raw response text that failed to parse:', responseText);
      
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON response from N8N',
          details: parseError.message,
          rawResponse: responseText
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Parse the stringified weeks JSON if needed
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

