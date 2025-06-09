
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { History, MessageSquare } from 'lucide-react'
import type { SocialPost } from '@/types/contentAgent'

interface ContentHistorySectionProps {
  posts: SocialPost[]
  onUpdatePostStatus: (postId: string, newStatus: 'draft' | 'posted' | 'failed') => void
  onDeletePost: (postId: string) => void
}

export const ContentHistorySection = ({
  posts,
  onUpdatePostStatus,
  onDeletePost
}: ContentHistorySectionProps) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'posted': return 'default'
      case 'draft': return 'secondary'
      case 'failed': return 'destructive'
      default: return 'secondary'
    }
  }

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-black" />
          Content History
        </CardTitle>
        <CardDescription>
          View and manage all your AI-generated social media content
        </CardDescription>
      </CardHeader>
      <CardContent>
        {posts.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No content generated yet</p>
            <p className="text-sm text-gray-400">Add your topics above and click "Generate with AI" to create your first batch of posts</p>
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
                      <span>•</span>
                      <span className="text-blue-600">AI Generated</span>
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
                      onClick={() => onUpdatePostStatus(post.id, 'posted')}
                    >
                      Mark as Posted
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDeletePost(post.id)}
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
  )
}
