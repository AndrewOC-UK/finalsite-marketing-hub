
import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'
import type { AgentSettings } from '@/types/contentAgent'

export const useContentGeneration = (settings: AgentSettings, onPostsGenerated: () => void) => {
  const { user } = useAuth()
  const [generating, setGenerating] = useState(false)

  const generateContent = async () => {
    if (!user) return

    if (!settings.topics || settings.topics.trim() === '') {
      toast({
        title: "Topics Required",
        description: "Please enter topics/keywords before generating content.",
        variant: "destructive",
      })
      return
    }

    setGenerating(true)
    try {
      console.log('Starting AI content generation with topics:', settings.topics)
      
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { 
          topics: settings.topics,
          postCount: 3
        }
      })

      if (error) {
        console.error('Supabase function error:', error)
        throw new Error(error.message || 'Failed to generate content')
      }

      if (!data?.posts || !Array.isArray(data.posts)) {
        console.error('Invalid response format:', data)
        throw new Error('Invalid response format from AI service')
      }

      console.log('AI generated posts:', data.posts)

      const insertPromises = data.posts.map(content => 
        supabase
          .from('social_posts')
          .insert({
            user_id: user.id,
            content,
            status: 'draft',
            generation_source: 'manual'
          })
      )

      const results = await Promise.all(insertPromises)
      
      const errors = results.filter(result => result.error)
      if (errors.length > 0) {
        console.error('Database insertion errors:', errors)
        throw new Error('Failed to save some posts to database')
      }

      onPostsGenerated()
      toast({
        title: "🎉 AI Content Generated!",
        description: `${data.posts.length} new social media posts have been created and saved as drafts.`,
      })
    } catch (error) {
      console.error('Content generation error:', error)
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate content. Please check your topics and try again.",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  return {
    generating,
    generateContent
  }
}
