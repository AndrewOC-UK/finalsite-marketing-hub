
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { CampaignFormData } from '@/types/campaign';

interface CampaignPreviewProps {
  formData: CampaignFormData;
}

const CampaignPreview = ({ formData }: CampaignPreviewProps) => {
  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-3 lg:pb-6">
        <CardTitle className="text-base lg:text-lg">
          🎯 Campaign Strategy Preview
        </CardTitle>
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
          
          {formData.mode === 'autonomous' && formData.startDate && (
            <div>
              <span className="font-medium text-foreground">Start Date:</span>{' '}
              <span className="text-muted-foreground">
                {format(formData.startDate, 'PPP')}
              </span>
            </div>
          )}

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
              {formData.dailyIteration && formData.mode === 'autonomous' && (
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-muted-foreground text-xs">Adapt based on engagement</span>
                </div>
              )}
              {formData.notifications.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-muted-foreground text-xs">
                    Send updates via {formData.notifications.join(' & ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignPreview;
