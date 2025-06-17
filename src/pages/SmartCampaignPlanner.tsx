
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { CampaignFormData } from '@/types/campaign';
import { useCampaignGeneration } from '@/hooks/useCampaignGeneration';
import CampaignForm from '@/components/campaign/CampaignForm';
import CampaignResults from '@/components/campaign/CampaignResults';
import CampaignPreview from '@/components/campaign/CampaignPreview';

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

  const { isLoading, campaignResults, generateCampaign } = useCampaignGeneration();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generateCampaign(formData);
  };

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
        <CampaignForm
          formData={formData}
          isLoading={isLoading}
          onFormDataChange={setFormData}
          onSubmit={handleSubmit}
        />

        {campaignResults ? (
          <CampaignResults campaignResults={campaignResults} />
        ) : (
          <CampaignPreview formData={formData} />
        )}
      </div>
    </div>
  );
};

export default SmartCampaignPlanner;
