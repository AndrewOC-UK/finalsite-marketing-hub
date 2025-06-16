import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Loader2, Sparkles, CalendarIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CampaignFormData {
  topic: string;
  duration: number;
  tone: string;
  channels: string[];
  mode: string;
  startDate?: Date;
  dailyIteration: boolean;
  notifications: string[];
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
  });
  const [isLoading, setIsLoading] = useState(false);
  const [campaignPlan, setCampaignPlan] = useState<string | null>(null);
  const handleTopicChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      topic: value
    }));
  };
  const handleDurationChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      duration: parseInt(value)
    }));
  };
  const handleToneChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      tone: value
    }));
  };
  const handleModeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      mode: value,
      dailyIteration: value === 'autonomous' ? true : prev.dailyIteration
    }));
  };
  const handleChannelChange = (channel: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      channels: checked ? [...prev.channels, channel] : prev.channels.filter(c => c !== channel)
    }));
  };
  const handleNotificationChange = (method: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      notifications: checked ? [...prev.notifications, method] : prev.notifications.filter(n => n !== method)
    }));
  };
  const handleDailyIterationChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      dailyIteration: checked
    }));
  };
  const handleStartDateChange = (date: Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      startDate: date
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic || !formData.tone || formData.channels.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select at least one channel.",
        variant: "destructive"
      });
      return;
    }
    if (formData.mode === 'autonomous' && !formData.startDate) {
      toast({
        title: "Missing Start Date",
        description: "Start date is required for autonomous campaigns.",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    
    // Format the campaign details into a descriptive string
    const campaignDescription = `Plan a ${formData.duration}-week ${formData.tone} social media campaign for "${formData.topic}" on ${formData.channels.join(', ')} with ${formData.mode} mode${formData.mode === 'autonomous' && formData.startDate ? ` starting ${format(formData.startDate, 'PPP')}` : ''}${formData.dailyIteration ? ' with daily AI iteration enabled' : ''}${formData.notifications.length > 0 ? ` and ${formData.notifications.join(' & ')} notifications` : ''}`;
    
    const requestData = {
      chatInput: campaignDescription
    };
    
    console.log('Sending campaign data to webhook:', requestData);
    try {
      const webhookUrl = 'https://andrewoconnor.app.n8n.cloud/webhook/generate-campaign-plan';
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'no-cors',
        body: JSON.stringify(requestData)
      });

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
${formData.mode === 'autonomous' ? '• AI will autonomously post daily content based on engagement metrics' : '• AI will generate daily content drafts for your approval'}
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
${formData.mode === 'autonomous' ? '✅ Autonomous daily posting\n✅ Real-time engagement optimization\n✅ Automatic content adaptation' : '✅ Daily content generation\n✅ Performance insights\n✅ Manual approval workflow'}
${formData.dailyIteration ? '\n✅ AI learning from engagement data' : ''}
${formData.notifications.length > 0 ? `\n✅ Updates via ${formData.notifications.join(' & ')}` : ''}

## 🎯 Expected Outcomes
• Increased engagement by 25-40%
• Consistent brand messaging across channels
• ${formData.mode === 'autonomous' ? 'Autonomous campaign execution' : 'Streamlined content approval process'}
• Data-driven content optimization
      `;
      setCampaignPlan(mockPlan);
      toast({
        title: "Campaign Strategy Generated! 🚀",
        description: "Your AI-powered campaign strategy is ready for deployment."
      });
    } catch (error) {
      console.error('Error generating campaign:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate campaign strategy. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const channels = [{
    id: 'instagram',
    label: 'Instagram'
  }, {
    id: 'facebook',
    label: 'Facebook'
  }, {
    id: 'email',
    label: 'Email'
  }, {
    id: 'twitter',
    label: 'Twitter'
  }, {
    id: 'website',
    label: 'Website'
  }];
  const notifications = [{
    id: 'email',
    label: 'Email'
  }, {
    id: 'slack',
    label: 'Slack'
  }, {
    id: 'none',
    label: 'None'
  }];
  return <div className="space-y-4 lg:space-y-6">
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
            <CardDescription className="text-sm">Configure your AI-driven marketing campaign. AI may propose other settings for your campaign.

          </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Campaign Topic *</Label>
                <Input id="topic" placeholder="e.g., Student Wellbeing Week, Spring Sports Events" value={formData.topic} onChange={e => handleTopicChange(e.target.value)} className="text-sm lg:text-base" />
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
                <Label>Target Channels * (Your guidance, AI may propose)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {channels.map(channel => <div key={channel.id} className="flex items-center space-x-2">
                      <Checkbox id={channel.id} checked={formData.channels.includes(channel.id)} onCheckedChange={checked => handleChannelChange(channel.id, checked as boolean)} />
                      <Label htmlFor={channel.id} className="text-sm font-normal cursor-pointer">
                        {channel.label}
                      </Label>
                    </div>)}
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

              {formData.mode === 'autonomous' && <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.startDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={formData.startDate} onSelect={handleStartDateChange} disabled={date => date < new Date()} initialFocus className="pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>}

              {formData.mode === 'autonomous' && <div className="flex items-center space-x-2">
                  <Switch id="dailyIteration" checked={formData.dailyIteration} onCheckedChange={handleDailyIterationChange} />
                  <Label htmlFor="dailyIteration" className="text-sm font-normal">
                    Let AI adjust post style based on engagement data?
                  </Label>
                </div>}

              <div className="space-y-3">
                <Label>Notification Method</Label>
                <div className="grid grid-cols-2 gap-3">
                  {notifications.map(notification => <div key={notification.id} className="flex items-center space-x-2">
                      <Checkbox id={notification.id} checked={formData.notifications.includes(notification.id)} onCheckedChange={checked => handleNotificationChange(notification.id, checked as boolean)} />
                      <Label htmlFor={notification.id} className="text-sm font-normal cursor-pointer">
                        {notification.label}
                      </Label>
                    </div>)}
                </div>
              </div>

              <Button type="submit" className="w-full bg-[hsl(var(--ubiq-yellow))] hover:bg-[hsl(var(--ubiq-yellow))]/90 text-black font-semibold" disabled={isLoading}>
                {isLoading ? <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Launching Campaign Strategy...
                  </> : <>
                    🤖 <Sparkles className="mr-1 h-4 w-4" /> Launch Campaign Strategy ✨
                  </>}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Strategy Preview */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-3 lg:pb-6">
            <CardTitle className="text-base lg:text-lg">🎯 Campaign Strategy Preview</CardTitle>
            <CardDescription className="text-sm">
              Live preview of your AI campaign configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4 text-sm">
              <div>
                <span className="font-medium text-foreground">Topic:</span>{' '}
                <span className="text-muted-foreground">
                  {formData.topic || 'Not specified'}
                </span>
              </div>
              
              <div>
                <span className="font-medium text-foreground">Duration:</span>{' '}
                <span className="text-muted-foreground">
                  {formData.duration} week{formData.duration > 1 ? 's' : ''}
                </span>
              </div>
              
              <div>
                <span className="font-medium text-foreground">Tone:</span>{' '}
                <span className="text-muted-foreground">
                  {formData.tone || 'Not selected'}
                </span>
              </div>
              
              <div>
                <span className="font-medium text-foreground">Channels:</span>{' '}
                <span className="text-muted-foreground">
                  {formData.channels.length > 0 ? formData.channels.join(', ') : 'None selected'}
                </span>
              </div>
              
              <div>
                <span className="font-medium text-foreground">Mode:</span>{' '}
                <span className="text-muted-foreground">
                  {formData.mode === 'autonomous' ? 'AI-Autonomous' : 'Manual Approval'}
                </span>
              </div>
              
              {formData.mode === 'autonomous' && formData.startDate && <div>
                  <span className="font-medium text-foreground">Start Date:</span>{' '}
                  <span className="text-muted-foreground">
                    {format(formData.startDate, 'PPP')}
                  </span>
                </div>}

              <div className="border-t pt-4 mt-4">
                <p className="font-medium text-foreground mb-2">AI will:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-muted-foreground text-xs">Generate content</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-muted-foreground text-xs">
                      {formData.mode === 'autonomous' ? 'Schedule and send posts automatically' : 'Create drafts for your approval'}
                    </span>
                  </div>
                  {formData.dailyIteration && formData.mode === 'autonomous' && <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span className="text-muted-foreground text-xs">Adapt based on engagement</span>
                    </div>}
                  {formData.notifications.length > 0 && <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span className="text-muted-foreground text-xs">
                        Send updates via {formData.notifications.join(' & ')}
                      </span>
                    </div>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Plan Results */}
      {campaignPlan && <Card className="border border-border shadow-sm">
          <CardHeader className="pb-3 lg:pb-6">
            <CardTitle className="text-base lg:text-lg">AI Campaign Strategy</CardTitle>
            <CardDescription className="text-sm">
              Your generated campaign strategy
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-sm font-mono bg-muted p-4 rounded-md overflow-auto max-h-96">
                {campaignPlan}
              </pre>
            </div>
          </CardContent>
        </Card>}
    </div>;
};
export default SmartCampaignPlanner;
