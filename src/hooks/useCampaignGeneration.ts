
import { useState } from 'react';
import { CampaignFormData, CampaignResult, WebhookCampaignResult } from '@/types/campaign';
import { toast } from '@/hooks/use-toast';

export const useCampaignGeneration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaignResults, setCampaignResults] = useState<CampaignResult | null>(null);

  const generateCampaign = async (formData: CampaignFormData) => {
    setIsLoading(true);
    
    try {
      // Get the webhook URL from settings
      const webhookSettings = localStorage.getItem('webhookSettings');
      let webhookUrl = '';
      
      if (webhookSettings) {
        const settings = JSON.parse(webhookSettings);
        webhookUrl = settings.campaignPlanner;
      }
      
      if (!webhookUrl) {
        toast({
          title: "Webhook Not Configured",
          description: "Please configure the Campaign Planner webhook in Settings before generating campaigns.",
          variant: "destructive",
        });
        return;
      }

      console.log('Calling webhook with data:', formData);
      console.log('Webhook URL:', webhookUrl);
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: formData.topic,
          duration: formData.duration,
          tone: formData.tone,
          channels: formData.channels,
          mode: formData.mode,
          startDate: formData.startDate,
          dailyIteration: formData.dailyIteration,
          notifications: formData.notifications
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const webhookResult: WebhookCampaignResult = await response.json();
      console.log('Webhook response:', webhookResult);

      // Parse the weeks string from the webhook response
      let parsedWeeks;
      try {
        parsedWeeks = JSON.parse(webhookResult.weeks);
      } catch (parseError) {
        console.error('Error parsing weeks JSON:', parseError);
        throw new Error('Invalid response format from webhook');
      }

      // Transform to our expected format
      const result: CampaignResult = {
        campaignTitle: webhookResult.campaignTitle,
        campaignHashtag: webhookResult.campaignHashtag,
        weeks: parsedWeeks
      };

      console.log('Final campaign result:', result);
      setCampaignResults(result);

      toast({
        title: "Campaign Generated!",
        description: "Your AI-powered campaign plan has been created successfully.",
      });

    } catch (error) {
      console.error('Error generating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to generate campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    campaignResults,
    generateCampaign
  };
};
