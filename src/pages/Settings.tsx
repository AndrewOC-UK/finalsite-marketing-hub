
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Settings as SettingsIcon, Webhook, User, Sparkles } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'

const Settings = () => {
  const { user } = useAuth()
  const [webhooks, setWebhooks] = useState({
    contentGeneration: '',
    insightReport: '',
    emailOutreach: '',
    campaignPlanner: ''
  })
  const [loading, setLoading] = useState(false)

  const saveWebhooks = async () => {
    setLoading(true)
    try {
      // Here you would save to Supabase or your preferred storage
      // For now, we'll just save to localStorage for demo purposes
      localStorage.setItem('webhookSettings', JSON.stringify(webhooks))
      
      toast({
        title: "Webhooks Saved",
        description: "Your webhook configurations have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save webhook settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Load saved webhooks from localStorage
    const saved = localStorage.getItem('webhookSettings')
    if (saved) {
      setWebhooks(JSON.parse(saved))
    }
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <SettingsIcon className="h-8 w-8 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and configure external integrations
        </p>
      </div>

      {/* Profile Section */}
      <Card className="border border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Your account details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input 
                value={user?.email || ''} 
                disabled 
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email address cannot be changed. Contact support if you need assistance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Webhook Configuration */}
      <Card className="border border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="h-5 w-5 text-primary" />
            Webhook Configuration
          </CardTitle>
          <CardDescription>
            Connect your n8n automation workflows to enable advanced features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-webhook" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Campaign Planner Webhook
              </Label>
              <Input
                id="campaign-webhook"
                placeholder="https://your-n8n-instance.com/webhook/generate-campaign-plan"
                value={webhooks.campaignPlanner}
                onChange={(e) => setWebhooks({ ...webhooks, campaignPlanner: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                This webhook will be used for AI campaign generation. If left empty, the default workflow will be used.
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="content-webhook">Content Generation Webhook</Label>
              <Input
                id="content-webhook"
                placeholder="https://your-n8n-instance.com/webhook/content-generation"
                value={webhooks.contentGeneration}
                onChange={(e) => setWebhooks({ ...webhooks, contentGeneration: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                This webhook will be triggered when generating new social media content
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="insight-webhook">Insight Report Webhook</Label>
              <Input
                id="insight-webhook"
                placeholder="https://your-n8n-instance.com/webhook/insight-report"
                value={webhooks.insightReport}
                onChange={(e) => setWebhooks({ ...webhooks, insightReport: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                This webhook will be used for generating and delivering insight reports
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="outreach-webhook">Email Outreach Webhook</Label>
              <Input
                id="outreach-webhook"
                placeholder="https://your-n8n-instance.com/webhook/email-outreach"
                value={webhooks.emailOutreach}
                onChange={(e) => setWebhooks({ ...webhooks, emailOutreach: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                This webhook will handle automated email outreach campaigns
              </p>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              onClick={saveWebhooks} 
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Webhook Settings'}
            </Button>
          </div>

          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2">How to set up webhooks:</h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Create your automation workflow in n8n</li>
              <li>Add a webhook trigger node to your workflow</li>
              <li>Copy the webhook URL from n8n</li>
              <li>Paste the URL in the appropriate field above</li>
              <li>Save your settings to activate the integration</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Settings
