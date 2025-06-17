
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
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CampaignFormData } from '@/types/campaign';

interface CampaignFormProps {
  formData: CampaignFormData;
  isLoading: boolean;
  onFormDataChange: (data: CampaignFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const CampaignForm = ({ formData, isLoading, onFormDataChange, onSubmit }: CampaignFormProps) => {
  const handleTopicChange = (value: string) => {
    onFormDataChange({
      ...formData,
      topic: value
    });
  };

  const handleDurationChange = (value: string) => {
    onFormDataChange({
      ...formData,
      duration: parseInt(value)
    });
  };

  const handleToneChange = (value: string) => {
    onFormDataChange({
      ...formData,
      tone: value
    });
  };

  const handleModeChange = (value: string) => {
    onFormDataChange({
      ...formData,
      mode: value,
      dailyIteration: value === 'autonomous' ? true : formData.dailyIteration
    });
  };

  const handleChannelChange = (channel: string, checked: boolean) => {
    onFormDataChange({
      ...formData,
      channels: checked ? [...formData.channels, channel] : formData.channels.filter(c => c !== channel)
    });
  };

  const handleNotificationChange = (method: string, checked: boolean) => {
    onFormDataChange({
      ...formData,
      notifications: checked ? [...formData.notifications, method] : formData.notifications.filter(n => n !== method)
    });
  };

  const handleDailyIterationChange = (checked: boolean) => {
    onFormDataChange({
      ...formData,
      dailyIteration: checked
    });
  };

  const handleStartDateChange = (date: Date | undefined) => {
    onFormDataChange({
      ...formData,
      startDate: date
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

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-3 lg:pb-6">
        <CardTitle className="text-base lg:text-lg">Campaign Parameters</CardTitle>
        <CardDescription className="text-sm">Configure your AI-driven marketing campaign. AI may propose other settings for your campaign.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Campaign Topic *</Label>
            <Input 
              id="topic" 
              placeholder="e.g., Student Wellbeing Week, Spring Sports Events" 
              value={formData.topic} 
              onChange={e => handleTopicChange(e.target.value)} 
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
            <Label>Target Channels * (Your guidance, AI may propose)</Label>
            <div className="grid grid-cols-2 gap-3">
              {channels.map(channel => (
                <div key={channel.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={channel.id} 
                    checked={formData.channels.includes(channel.id)} 
                    onCheckedChange={checked => handleChannelChange(channel.id, checked as boolean)} 
                  />
                  <Label htmlFor={channel.id} className="text-sm font-normal cursor-pointer">
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
                    disabled={date => date < new Date()} 
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
              {notifications.map(notification => (
                <div key={notification.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={notification.id} 
                    checked={formData.notifications.includes(notification.id)} 
                    onCheckedChange={checked => handleNotificationChange(notification.id, checked as boolean)} 
                  />
                  <Label htmlFor={notification.id} className="text-sm font-normal cursor-pointer">
                    {notification.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[hsl(var(--ubiq-yellow))] hover:bg-[hsl(var(--ubiq-yellow))]/90 text-black font-semibold" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Launching Campaign Strategy...
              </>
            ) : (
              <>
                🤖 <Sparkles className="mr-1 h-4 w-4" /> Launch Campaign Strategy ✨
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CampaignForm;
