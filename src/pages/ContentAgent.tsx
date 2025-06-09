
import { MessageSquare } from 'lucide-react'
import { useAgentSettings } from '@/hooks/useAgentSettings'
import { usePosts } from '@/hooks/usePosts'
import { useContentGeneration } from '@/hooks/useContentGeneration'
import { ConfigurationSection } from '@/components/content-agent/ConfigurationSection'
import { ContentHistorySection } from '@/components/content-agent/ContentHistorySection'

const ContentAgent = () => {
  const { settings, setSettings, loading, saveSettings } = useAgentSettings()
  const { posts, loadPosts, updatePostStatus, deletePost } = usePosts()
  const { generating, generateContent } = useContentGeneration(settings, loadPosts)

  return (
    <div className="space-y-4 lg:space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare className="h-6 w-6 lg:h-8 lg:w-8 text-black" />
          Content Agent
        </h1>
        <p className="text-gray-600 mt-1 lg:mt-2 text-sm lg:text-base">
          Automate and manage your social media content generation with AI-powered assistance.
        </p>
      </div>

      <ConfigurationSection
        settings={settings}
        setSettings={setSettings}
        loading={loading}
        generating={generating}
        onSaveSettings={saveSettings}
        onGenerateContent={generateContent}
      />

      <ContentHistorySection
        posts={posts}
        onUpdatePostStatus={updatePostStatus}
        onDeletePost={deletePost}
      />
    </div>
  )
}

export default ContentAgent
