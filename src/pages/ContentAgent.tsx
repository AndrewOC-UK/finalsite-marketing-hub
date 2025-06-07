
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { MessageSquare, Settings as SettingsIcon, History, Play } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'
import type { Database } from '@/integrations/supabase/types'

// Type aliases for better type safety
type DbSocialPost = Database['public']['Tables']['social_posts']['Row']
type DbAgentSettings = Database['public']['Tables']['agent_settings']['Row']

interface SocialPost {
  id: string
  content: string
  status: 'draft' | 'posted' | 'failed'
  generation_source: 'manual' | 'automated'
  created_at: string
}

interface AgentSettings {
  topics: string
  frequency: string
  automationEnabled: boolean
  postingMode: string
}

const ContentAgent = () => {
  const { user } = useAuth()
  const [settings, setSettings] = useState<AgentSettings>({
    topics: '',
    frequency: 'weekly',
    automationEnabled: false,
    postingMode: 'drafts'
  })
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (user) {
      loadSettings()
      loadPosts()
    }
  }, [user])

  const loadSettings = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('agent_settings')
      .select('*')
      .eq('user_id', user.id)
      .eq('agent_name', 'Content Agent')
      .single()

    if (data && !error) {
      // Safely cast the Json type to AgentSettings
      const settingsData = data.settings_json as unknown as AgentSettings
      setSettings(settingsData)
    }
  }

  const saveSettings = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('agent_settings')
        .upsert({
          user_id: user.id,
          agent_name: 'Content Agent',
          settings_json: settings as any, // Cast to satisfy Json type
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      toast({
        title: "Settings Saved",
        description: "Your Content Agent settings have been updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadPosts = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('social_posts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (data && !error) {
      // Transform database posts to match our interface
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

  const generateContent = async () => {
    if (!user) return

    setGenerating(true)
    try {
      // Simulate content generation
      const samplePosts = [
        "🎓 Exciting news from our school community! Our students continue to excel in both academics and extracurricular activities. #SchoolPride #Education",
        "📚 New learning resources now available in our library! Come explore the latest books and digital tools to enhance your educational journey. #Learning #Resources",
        "🏆 Congratulations to our debate team for their outstanding performance at the regional championship! Your hard work and dedication inspire us all. #Achievement #Debate"
      ]

      for (const content of samplePosts) {
        const { error } = await supabase
          .from('social_posts')
          .insert({
            user_id: user.id,
            content,
            status: 'draft',
            generation_source: 'manual'
          })

        if (error) throw error
      }

      await loadPosts()
      toast({
        title: "Content Generated",
        description: `${samplePosts.length} new social media posts have been created and saved as drafts.`,
      })
    } catch (error) {
      toast({
        title: "Generation Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'posted': return 'default'
      case 'draft': return 'secondary'
      case 'failed': return 'destructive'
      default: return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare className="h-8 w-8 text-[#0072b8]" />
          Content Agent
        </h1>
        <p className="text-gray-600 mt-2">
          Automate and manage your social media content generation with AI-powered assistance.
        </p>
      </div>

      {/* Configuration Section */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-[#0072b8]" />
            Agent Configuration
          </CardTitle>
          <CardDescription>
            Configure how your Content Agent generates and manages social media posts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="topics">Default Topics/Keywords</Label>
              <Textarea
                id="topics"
                placeholder="Enter topics like: school events, academic achievements, community news..."
                value={settings.topics}
                onChange={(e) => setSettings({ ...settings, topics: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="frequency">Generation Frequency</Label>
                <Select
                  value={settings.frequency}
                  onValueChange={(value) => setSettings({ ...settings, frequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Automation Status</Label>
                  <p className="text-sm text-gray-500">
                    {settings.automationEnabled ? 'Automated generation enabled' : 'Manual generation only'}
                  </p>
                </div>
                <Switch
                  checked={settings.automationEnabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, automationEnabled: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label>Posting Mode</Label>
                <Select
                  value={settings.postingMode}
                  onValueChange={(value) => setSettings({ ...settings, postingMode: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="drafts">Create Drafts for Review</SelectItem>
                    <SelectItem value="auto-post">Auto-Post to Socials</SelectItem>
                  </SelectContent>
                </Select>
                {settings.postingMode === 'auto-post' && (
                  <p className="text-xs text-amber-600">
                    Requires webhook configuration in Settings
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={saveSettings} 
              disabled={loading}
              className="bg-[#0072b8] hover:bg-[#005a94]"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </Button>
            <Button 
              onClick={generateContent} 
              disabled={generating}
              variant="outline"
              className="border-[#0072b8] text-[#0072b8] hover:bg-[#0072b8] hover:text-white"
            >
              <Play className="h-4 w-4 mr-2" />
              {generating ? 'Generating...' : 'Generate Now'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content History Section */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-[#0072b8]" />
            Content History
          </CardTitle>
          <CardDescription>
            View and manage all your generated social media content
          </CardDescription>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No content generated yet</p>
              <p className="text-sm text-gray-400">Click "Generate Now" to create your first batch of posts</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-gray-900 mb-2">{post.content}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="capitalize">{post.generation_source}</span>
                      </div>
                    </div>
                    <Badge variant={getStatusBadgeVariant(post.status)} className="ml-3">
                      {post.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    {post.status === 'draft' && (
                      <Button
                        size="sm"
                        onClick={() => updatePostStatus(post.id, 'posted')}
                        className="bg-[#0072b8] hover:bg-[#005a94]"
                      >
                        Mark as Posted
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deletePost(post.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ContentAgent
