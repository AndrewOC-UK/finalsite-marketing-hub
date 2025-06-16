
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, Sparkles } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface CampaignFormData {
  topic: string
  duration: number
  tone: string
  channels: string[]
}

const SmartCampaignPlanner = () => {
  const [formData, setFormData] = useState<CampaignFormData>({
    topic: '',
    duration: 1,
    tone: '',
    channels: []
  })
  const [isLoading, setIsLoading] = useState(false)
  const [campaignPlan, setCampaignPlan] = useState<string | null>(null)

  const handleTopicChange = (value: string) => {
    setFormData(prev => ({ ...prev, topic: value }))
  }

  const handleDurationChange = (value: string) => {
    setFormData(prev => ({ ...prev, duration: parseInt(value) }))
  }

  const handleToneChange = (value: string) => {
    setFormData(prev => ({ ...prev, tone: value }))
  }

  const handleChannelChange = (channel: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      channels: checked 
        ? [...prev.channels, channel]
        : prev.channels.filter(c => c !== channel)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.topic || !formData.tone || formData.channels.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select at least one channel.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    console.log('Sending campaign data to webhook:', formData)

    try {
      // Placeholder webhook URL - replace with actual n8n webhook
      const webhookUrl = 'https://your-n8n-webhook-url.com/campaign-planner'
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
          source: 'smart-campaign-planner'
        }),
      })

      // Mock campaign plan for now
      const mockPlan = `
# ${formData.topic} Campaign Plan (${formData.duration} weeks)

**Tone:** ${formData.tone}
**Channels:** ${formData.channels.join(', ')}

## Week 1: Launch & Awareness
- Create engaging announcement posts
- Share behind-the-scenes content
- Launch hashtag campaign

## Week 2: Community Engagement
- Host interactive Q&A sessions
- Share success stories
- Encourage user-generated content

${formData.duration > 2 ? `
## Week 3: Deep Dive Content
- Educational posts and resources
- Expert interviews or testimonials
- Visual storytelling content
` : ''}

${formData.duration > 3 ? `
## Week 4: Mid-Campaign Boost
- Refresh visual assets
- Partner collaborations
- Community challenges or contests
` : ''}

${formData.duration > 4 ? `
## Week 5: Testimonials & Proof
- Success story highlights
- Parent/student testimonials
- Impact metrics sharing
` : ''}

${formData.duration > 5 ? `
## Week 6: Celebration & Next Steps
- Campaign success celebration
- Thank you messages
- Preview of upcoming initiatives
` : ''}

## Recommended Posting Schedule:
- **${formData.channels.includes('Instagram') ? 'Instagram: 3-4 posts/week' : ''}**
- **${formData.channels.includes('Facebook') ? 'Facebook: 2-3 posts/week' : ''}**
- **${formData.channels.includes('Twitter') ? 'Twitter: 5-7 posts/week' : ''}**
- **${formData.channels.includes('Email') ? 'Email: 1 newsletter/week' : ''}**
- **${formData.channels.includes('Website') ? 'Website: 1-2 blog posts/week' : ''}**
      `

      setCampaignPlan(mockPlan)
      
      toast({
        title: "Campaign Plan Generated!",
        description: "Your AI-powered campaign plan is ready for review.",
      })
    } catch (error) {
      console.error('Error generating campaign:', error)
      toast({
        title: "Generation Failed",
        description: "Unable to generate campaign plan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const channels = [
    { id: 'instagram', label: 'Instagram' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'twitter', label: 'Twitter' },
    { id: 'email', label: 'Email' },
    { id: 'website', label: 'Website' }
  ]

  return (
    <div className="space-y-4 lg:space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
          ✨ Plan Your Campaign with AI ✨
        </h1>
        <p className="text-muted-foreground mt-1 lg:mt-2 text-sm lg:text-base">
          Create multi-week, AI-powered marketing campaigns for student wellbeing, school events, and parent engagement.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Campaign Form */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-3 lg:pb-6">
            <CardTitle className="text-base lg:text-lg">Campaign Details</CardTitle>
            <CardDescription className="text-sm">
              Configure your marketing campaign parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Campaign Topic *</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Student Wellbeing Week, Spring Sports Events"
                  value={formData.topic}
                  onChange={(e) => handleTopicChange(e.target.value)}
                  className="text-sm lg:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Campaign Duration (weeks) *</Label>
                <Select value={formData.duration.toString()} onValueChange={handleDurationChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 week</SelectItem>
                    <SelectItem value="2">2 weeks</SelectItem>
                    <SelectItem value="3">3 weeks</SelectItem>
                    <SelectItem value="4">4 weeks</SelectItem>
                    <SelectItem value="5">5 weeks</SelectItem>
                    <SelectItem value="6">6 weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">Preferred Tone *</Label>
                <Select value={formData.tone} onValueChange={handleToneChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="fun">Fun</SelectItem>
                    <SelectItem value="inspiring">Inspiring</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Target Channels * (Select at least one)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {channels.map((channel) => (
                    <div key={channel.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={channel.id}
                        checked={formData.channels.includes(channel.id)}
                        onCheckedChange={(checked) => 
                          handleChannelChange(channel.id, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={channel.id} 
                        className="text-sm font-normal cursor-pointer"
                      >
                        {channel.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Campaign...
                  </>
                ) : (
                  'Generate Campaign Plan'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Campaign Preview */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-3 lg:pb-6">
            <CardTitle className="text-base lg:text-lg">Campaign Preview</CardTitle>
            <CardDescription className="text-sm">
              Your AI-generated campaign plan will appear here
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : campaignPlan ? (
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm font-mono bg-muted p-4 rounded-md overflow-auto max-h-96">
                  {campaignPlan}
                </pre>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Fill out the form and click "Generate Campaign Plan" to see your AI-powered marketing strategy.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SmartCampaignPlanner
