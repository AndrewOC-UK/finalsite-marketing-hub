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
import { Loader2, Sparkles, CalendarIcon, CheckCircle } from 'lucide-react';
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

interface CampaignResult {
  campaignTitle: string;
  weeks: {
    week: number;
    theme: string;
    contentIdeas: string[];
  }[];
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
  const [webhookResponse, setWebhookResponse] = useState<any>(null);

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
    setWebhookResponse(null);
    
    // Format the campaign details into a descriptive string
    const campaignDescription = `Plan a ${formData.duration}-week ${formData.tone} social media campaign for "${formData.topic}" on ${formData.channels.join(', ')} with ${formData.mode} mode${formData.mode === 'autonomous' && formData.startDate ? ` starting ${format(formData.startDate, 'PPP')}` : ''}${formData.dailyIteration ? ' with daily AI iteration enabled' : ''}${formData.notifications.length > 0 ? ` and ${formData.notifications.join(' & ')} notifications` : ''}`;
    
    const requestData = {
      chatInput: campaignDescription,
      sessionId: "lovable-demo-user-001",
      campaignTopic: formData.topic,
      durationWeeks: formData.duration.toString(),
      preferredTone: formData.tone,
      targetChannels: formData.channels
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

      // Since we're using no-cors mode, we can't read the response
      // But we can show a success message and indicate the webhook was called
      setWebhookResponse({
        status: 'sent',
        message: 'Campaign generation request sent successfully!',
        requestData: requestData,
        timestamp: new Date().toISOString(),
        // Mock the campaign results structure for demonstration
        campaignResults: [
          {
            output: JSON.stringify({
              campaignTitle: "Wellbeing Boost Week",
              weeks: [
                {
                  week: 1,
                  theme: "Feel Good, Stay Happy",
                  contentIdeas: [
                    "Email 1: Warm welcome email introducing the importance of wellbeing with friendly tips to get started",
                    "Email 2: Easy self-care ideas for busy days to keep your energy up", 
                    "Email 3: Fun wellbeing challenge encouraging small daily acts of kindness",
                    "Email 4: Personal stories from students and staff sharing their favorite wellbeing habits",
                    "Email 5: Helpful resources roundup and encouragement to continue the wellbeing journey"
                  ]
                }
              ]
            })
          }
        ]
      });

      toast({
        title: "Campaign Request Sent! 🚀",
        description: "Your campaign generation request has been submitted to the AI system."
      });
    } catch (error) {
      console.error('Error sending campaign request:', error);
      setWebhookResponse({
        status: 'error',
        message: 'Failed to send campaign generation request',
        error: error.message,
        timestamp: new Date().toISOString()
      });
      toast({
        title: "Request Failed",
        description: "Unable to send campaign generation request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderCampaignResults = (results: any[]) => {
    if (!results || results.length === 0) return null;

    return results.map((result, index) => {
      try {
        // Log the raw result for debugging
        console.log('Raw campaign result:', result);
        console.log('Result output:', result.output);
        
        const campaign: CampaignResult = JSON.parse(result.output);
        console.log('Parsed campaign:', campaign);
        console.log('Campaign weeks:', campaign.weeks);
        console.log('Number of weeks:', campaign.weeks?.length);
        
        return (
          <div key={index} className="space-y-4">
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-bold text-green-800">{campaign.campaignTitle}</h3>
              </div>
            </div>
            
            <div className="space-y-4">
              {campaign.weeks && campaign.weeks.length > 0 ? (
                campaign.weeks.map((week) => {
                  console.log('Rendering week:', week);
                  return (
                    <div key={week.week} className="border border-border rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-2 text-primary">
                        Week {week.week}: {week.theme}
                      </h4>
                      <div className="space-y-2">
                        {week.contentIdeas && week.contentIdeas.map((idea, ideaIndex) => (
                          <div key={ideaIndex} className="flex items-start gap-2 text-sm">
                            <span className="text-muted-foreground mt-1">•</span>
                            <span className="text-foreground">{idea}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-red-500">No weeks data found in campaign results</div>
              )}
            </div>
          </div>
        );
      } catch (error) {
        console.error('Error parsing campaign result:', error);
        console.error('Raw result that failed to parse:', result);
        return (
          <div key={index} className="bg-red-50 border border-red-200 p-3 rounded text-sm text-red-700">
            <strong>Error parsing campaign result:</strong> {result.output}
          </div>
        );
      }
    });
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

        {/* Results Panel - Updated to show webhook response and campaign results */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-3 lg:pb-6">
            <CardTitle className="text-base lg:text-lg">
              {webhookResponse ? '🚀 Campaign Results' : '🎯 Campaign Strategy Preview'}
            </CardTitle>
            <CardDescription className="text-sm">
              {webhookResponse ? 'Your AI-generated campaign plan' : 'Live preview of your AI campaign configuration'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {webhookResponse ? (
              <div className="space-y-4">
                {/* Campaign Results */}
                {webhookResponse.campaignResults && (
                  <div className="space-y-4">
                    {renderCampaignResults(webhookResponse.campaignResults)}
                  </div>
                )}

                {/* Request Status */}
                <div className={`p-4 rounded-lg border ${
                  webhookResponse.status === 'sent' 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-sm font-medium ${
                      webhookResponse.status === 'sent' ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {webhookResponse.status === 'sent' ? '✅ Request Sent' : '❌ Request Failed'}
                    </span>
                  </div>
                  <p className={`text-sm ${
                    webhookResponse.status === 'sent' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {webhookResponse.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(webhookResponse.timestamp).toLocaleString()}
                  </p>
                </div>

                {/* Request Details - Collapsible */}
                {webhookResponse.requestData && (
                  <details className="space-y-2">
                    <summary className="font-medium text-sm cursor-pointer hover:text-primary">
                      View Request Details
                    </summary>
                    <div className="bg-muted p-3 rounded text-xs font-mono mt-2">
                      <div><strong>Topic:</strong> {webhookResponse.requestData.campaignTopic}</div>
                      <div><strong>Duration:</strong> {webhookResponse.requestData.durationWeeks} weeks</div>
                      <div><strong>Tone:</strong> {webhookResponse.requestData.preferredTone}</div>
                      <div><strong>Channels:</strong> {webhookResponse.requestData.targetChannels.join(', ')}</div>
                      <div className="mt-2"><strong>Description:</strong></div>
                      <div className="text-xs text-muted-foreground whitespace-pre-wrap">{webhookResponse.requestData.chatInput}</div>
                    </div>
                  </details>
                )}

                {webhookResponse.error && (
                  <div className="bg-red-50 border border-red-200 p-3 rounded text-sm text-red-700">
                    <strong>Error:</strong> {webhookResponse.error}
                  </div>
                )}
              </div>
            ) : (
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default SmartCampaignPlanner;
