
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { CampaignResult } from '@/types/campaign';

interface CampaignResultsProps {
  campaignResults: CampaignResult | null;
}

const CampaignResults = ({ campaignResults }: CampaignResultsProps) => {
  const renderCampaignResults = (result: CampaignResult) => {
    if (!result) return null;

    console.log('Raw campaign result:', result);
    console.log('Campaign title:', result.campaignTitle);
    console.log('Weeks data:', result.weeks);
    console.log('Is weeks an array?', Array.isArray(result.weeks));
    
    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h3 className="font-bold text-green-800">{result.campaignTitle}</h3>
          </div>
        </div>
        
        <div className="space-y-4">
          {result.weeks && Array.isArray(result.weeks) && result.weeks.length > 0 ? (
            result.weeks.map((week) => {
              console.log('Rendering week:', week);
              return (
                <div key={week.week} className="border border-border rounded-lg p-4">
                  <h4 className="font-semibold text-lg mb-2 text-primary">
                    Week {week.week}: {week.theme}
                  </h4>
                  <div className="space-y-3">
                    {week.contentIdeas && Object.entries(week.contentIdeas).map(([channel, ideas]) => (
                      <div key={channel} className="space-y-2">
                        <h5 className="font-medium text-sm text-primary capitalize">{channel}:</h5>
                        <div className="ml-4 space-y-1">
                          {Array.isArray(ideas) && ideas.map((idea, ideaIndex) => (
                            <div key={ideaIndex} className="flex items-start gap-2 text-sm">
                              <span className="text-muted-foreground mt-1">•</span>
                              <span className="text-foreground">{idea}</span>
                            </div>
                          ))}
                        </div>
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
  };

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-3 lg:pb-6">
        <CardTitle className="text-base lg:text-lg">
          {campaignResults ? '🚀 Your Campaign Plan' : '🎯 Campaign Strategy Preview'}
        </CardTitle>
        <CardDescription className="text-sm">
          {campaignResults ? 'Your AI-generated campaign plan is ready!' : 'Live preview of your AI campaign configuration'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {campaignResults ? (
          renderCampaignResults(campaignResults)
        ) : null}
      </CardContent>
    </Card>
  );
};

export default CampaignResults;
