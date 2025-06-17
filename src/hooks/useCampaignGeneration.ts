
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
      
      console.log('Raw webhook settings from localStorage:', webhookSettings);
      
      if (webhookSettings) {
        const settings = JSON.parse(webhookSettings);
        webhookUrl = settings.campaignPlanner;
        console.log('Parsed webhook URL:', webhookUrl);
        console.log('Full settings object:', settings);
      }
      
      if (!webhookUrl) {
        console.error('No webhook URL found in settings');
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

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get response as text first to debug
      const responseText = await response.text();
      console.log('Raw response text:', responseText);
      console.log('Response text length:', responseText.length);

      if (!responseText || responseText.trim() === '') {
        console.error('Empty response from webhook');
        throw new Error('Empty response from webhook');
      }

      let webhookResult: WebhookCampaignResult;
      try {
        webhookResult = JSON.parse(responseText);
        console.log('Parsed webhook response:', webhookResult);
      } catch (parseError) {
        console.error('Failed to parse webhook response as JSON:', parseError);
        console.error('Raw response that failed to parse:', responseText);
        throw new Error('Invalid JSON response from webhook');
      }

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
