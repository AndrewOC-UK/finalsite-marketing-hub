
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'
import type { SocialPost } from '@/types/contentAgent'
import type { Database } from '@/integrations/supabase/types'

type DbSocialPost = Database['public']['Tables']['social_posts']['Row']

export const usePosts = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState<SocialPost[]>([])

  const loadPosts = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('social_posts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (data && !error) {
      const transformedPosts: SocialPost[] = data.map((post: DbSocialPost) => ({
        id: post.id,
        content: post.content,
        status: post.status as 'draft' | 'posted' | 'failed',
        generation_source: post.generation_source as 'manual' | 'automated',
        created_at: post.created_at
      }))
      setPosts(transformedPosts)
    }
  }

  const updatePostStatus = async (postId: string, newStatus: 'draft' | 'posted' | 'failed') => {
    const { error } = await supabase
      .from('social_posts')
      .update({ status: newStatus })
      .eq('id', postId)

    if (!error) {
      await loadPosts()
      toast({
        title: "Status Updated",
        description: `Post status changed to ${newStatus}.`,
      })
    }
  }

  const deletePost = async (postId: string) => {
    const { error } = await supabase
      .from('social_posts')
      .delete()
      .eq('id', postId)

    if (!error) {
      await loadPosts()
      toast({
        title: "Post Deleted",
        description: "The post has been removed from your content library.",
      })
    }
  }

  useEffect(() => {
    if (user) {
      loadPosts()
    }
  }, [user])

  return {
    posts,
    loadPosts,
    updatePostStatus,
    deletePost
  }
}
