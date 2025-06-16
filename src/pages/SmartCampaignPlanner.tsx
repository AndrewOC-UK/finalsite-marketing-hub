
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Loader2, Sparkles, CalendarIcon } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface CampaignFormData {
  topic: string
  duration: number
  tone: string
  channels: string[]
  mode: string
  startDate?: Date
  dailyIteration: boolean
  notifications: string[]
}

const SmartCampaignPlanner = () => {
  const [formData, setFormData] = useState<CampaignFormData>({
    topic: '',
    duration: 1,
    tone: '',
    channels: [],
    mode: 'manual',
    startDate: undefined,
    dailyIteration: true,
    notifications: []
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

  const handleModeChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      mode: value,
      dailyIteration: value === 'autonomous' ? true : prev.dailyIteration
    }))
  }

  const handleChannelChange = (channel: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      channels: checked 
        ? [...prev.channels, channel]
        : prev.channels.filter(c => c !== channel)
    }))
  }

  const handleNotificationChange = (method: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      notifications: checked 
        ? [...prev.notifications, method]
        : prev.notifications.filter(n => n !== method)
    }))
  }

  const handleDailyIterationChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, dailyIteration: checked }))
  }

  const handleStartDateChange = (date: Date | undefined) => {
    setFormData(prev => ({ ...prev, startDate: date }))
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

    if (formData.mode === 'autonomous' && !formData.startDate) {
      toast({
        title: "Missing Start Date",
        description: "Start date is required for autonomous campaigns.",
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
          startDate: formData.startDate?.toISOString(),
          timestamp: new Date().toISOString(),
          source: 'smart-campaign-planner'
        }),
      })

      // Mock campaign plan for now
      const mockPlan = `
🎯 AI Campaign Strategy: "${formData.topic}"

📅 Duration: ${formData.duration} week${formData.duration > 1 ? 's' : ''}
🎭 Tone: ${formData.tone}
📱 Channels: ${formData.channels.join(', ')}
🤖 Mode: ${formData.mode === 'autonomous' ? 'AI-Autonomous' : 'Manual Approval'}
${formData.startDate ? `📆 Start Date: ${format(formData.startDate, 'PPP')}` : ''}
🔄 Daily Iteration: ${formData.dailyIteration ? 'Enabled' : 'Disabled'}
🔔 Notifications: ${formData.notifications.length > 0 ? formData.notifications.join(', ') : 'None'}

## 🧠 AI Agent Strategy Overview

**Week 1: Foundation & Launch**
${formData.mode === 'autonomous' ? 
'• AI will autonomously post daily content based on engagement metrics' : 
'• AI will generate daily content drafts for your approval'}
• Initial awareness posts with ${formData.tone.toLowerCase()} tone
• Community engagement monitoring
• Baseline metrics establishment

${formData.duration > 1 ? `
**Week 2: Engagement Amplification**
• AI-driven content optimization based on Week 1 performance
• Interactive content deployment
• Community feedback integration
${formData.dailyIteration ? '• Daily AI adjustments based on engagement data' : ''}
` : ''}

${formData.duration > 2 ? `
**Week 3: Deep Engagement**
• Advanced AI content personalization
• Cross-channel content synchronization
• Performance-driven content pivots
` : ''}

${formData.duration > 3 ? `
**Week 4: Campaign Optimization**
• AI-powered content refresh
• Community-driven content creation
• Final push optimization
` : ''}

## 📊 AI Automation Features
${formData.mode === 'autonomous' ? 
'✅ Autonomous daily posting\n✅ Real-time engagement optimization\n✅ Automatic content adaptation' : 
'✅ Daily content generation\n✅ Performance insights\n✅ Manual approval workflow'}
${formData.dailyIteration ? '\n✅ AI learning from engagement data' : ''}
${formData.notifications.length > 0 ? `\n✅ Updates via ${formData.notifications.join(' & ')}` : ''}

## 🎯 Expected Outcomes
• Increased engagement by 25-40%
• Consistent brand messaging across channels
• ${formData.mode === 'autonomous' ? 'Autonomous campaign execution' : 'Streamlined content approval process'}
• Data-driven content optimization
      `

      setCampaignPlan(mockPlan)
      
      toast({
        title: "Campaign Strategy Generated! 🚀",
        description: "Your AI-powered campaign strategy is ready for deployment.",
      })
    } catch (error) {
      console.error('Error generating campaign:', error)
      toast({
        title: "Generation Failed",
        description: "Unable to generate campaign strategy. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const channels = [
    { id: 'instagram', label: 'Instagram' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'email', label: 'Email' },
    { id: 'twitter', label: 'Twitter' },
    { id: 'website', label: 'Website' }
  ]

  const notifications = [
    { id: 'email', label: 'Email' },
    { id: 'slack', label: 'Slack' },
    { id: 'none', label: 'None' }
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
            <CardTitle className="text-base lg:text-lg">Campaign Parameters</CardTitle>
            <CardDescription className="text-sm">
              Configure your AI-driven marketing campaign
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
                    <SelectItem value="excited">Excited</SelectItem>
                    <SelectItem value="calm">Calm</SelectItem>
                    <SelectItem value="empathetic">Empathetic</SelectItem>
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

              <div className="space-y-2">
                <Label htmlFor="mode">How should AI run this campaign? *</Label>
                <Select value={formData.mode} onValueChange={handleModeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select campaign mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual Approval (You decide each post)</SelectItem>
                    <SelectItem value="autonomous">AI-Autonomous (Let the AI act daily)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.mode === 'autonomous' && (
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={handleStartDateChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {formData.mode === 'autonomous' && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="dailyIteration"
                    checked={formData.dailyIteration}
                    onCheckedChange={handleDailyIterationChange}
                  />
                  <Label htmlFor="dailyIteration" className="text-sm font-normal">
                    Let AI adjust post style based on engagement data?
                  </Label>
                </div>
              )}

              <div className="space-y-3">
                <Label>Notification Method</Label>
                <div className="grid grid-cols-2 gap-3">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={notification.id}
                        checked={formData.notifications.includes(notification.id)}
                        onCheckedChange={(checked) => 
                          handleNotificationChange(notification.id, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={notification.id} 
                        className="text-sm font-normal cursor-pointer"
                      >
                        {notification.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Launching Campaign Strategy...
                  </>
                ) : (
                  '🚀 Launch Campaign Strategy'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Campaign Preview */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-3 lg:pb-6">
            <CardTitle className="text-base lg:text-lg">AI Campaign Strategy</CardTitle>
            <CardDescription className="text-sm">
              Your AI-generated campaign strategy will appear here
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
                <p className="text-sm">Configure your campaign parameters and click "Launch Campaign Strategy" to see your AI-powered marketing plan.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SmartCampaignPlanner
