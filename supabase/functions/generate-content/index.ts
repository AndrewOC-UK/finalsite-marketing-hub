
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

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
    const { topics, postCount = 3 } = await req.json();
    
    console.log('Generating content with topics:', topics, 'postCount:', postCount);

    if (!topics || topics.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Topics are required for content generation' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const prompt = `You are a professional educational marketing content creator. Generate ${postCount} diverse, engaging social media posts for an educational institution.

Topics/Keywords to focus on: ${topics}

Requirements:
- Each post should be 1-2 sentences maximum
- Include relevant emojis
- Add 2-3 relevant hashtags at the end
- Make posts suitable for platforms like LinkedIn, Facebook, or Twitter
- Focus on educational achievements, community engagement, student success, or learning opportunities
- Vary the tone and style between posts
- Make them inspiring and professional

Return only the posts, one per line, nothing else.`;

    console.log('Calling OpenAI with prompt length:', prompt.length);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received, choices:', data.choices?.length);

    const generatedContent = data.choices[0].message.content;
    const posts = generatedContent
      .split('\n')
      .filter(post => post.trim() !== '')
      .map(post => post.trim());

    console.log('Generated posts count:', posts.length);

    return new Response(
      JSON.stringify({ posts }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in generate-content function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate content', 
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
