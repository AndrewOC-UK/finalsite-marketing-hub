
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Settings as SettingsIcon, Sparkles, Loader2 } from 'lucide-react'
import type { AgentSettings } from '@/types/contentAgent'

interface ConfigurationSectionProps {
  settings: AgentSettings
  setSettings: (settings: AgentSettings) => void
  loading: boolean
  generating: boolean
  onSaveSettings: () => void
  onGenerateContent: () => void
}

export const ConfigurationSection = ({
  settings,
  setSettings,
  loading,
  generating,
  onSaveSettings,
  onGenerateContent
}: ConfigurationSectionProps) => {
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SettingsIcon className="h-5 w-5 text-black" />
          Agent Configuration
        </CardTitle>
        <CardDescription>
          Configure how your Content Agent generates and manages social media posts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="topics">Topics/Keywords for AI Generation</Label>
            <Textarea
              id="topics"
              placeholder="Enter topics like: school events, academic achievements, community news, STEM education, student success stories..."
              value={settings.topics}
              onChange={(e) => setSettings({ ...settings, topics: e.target.value })}
              className="min-h-[100px]"
            />
            <p className="text-xs text-gray-500">
              Be specific with your topics to get better AI-generated content
            </p>
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
            onClick={onSaveSettings} 
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
          <Button 
            onClick={onGenerateContent} 
            disabled={generating || !settings.topics.trim()}
            variant="outline"
            className="border-black text-black hover:bg-black hover:text-white"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating with AI...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate with AI
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
