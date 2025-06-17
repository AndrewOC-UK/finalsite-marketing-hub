
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { CampaignFormData, CampaignResult } from '@/types/campaign';

export const useCampaignGeneration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaignResults, setCampaignResults] = useState<CampaignResult | null>(null);

  const generateCampaign = async (formData: CampaignFormData) => {
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
    setCampaignResults(null);
    
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
    
    console.log('Sending campaign data to Supabase Edge Function:', requestData);
    
    try {
      // Use the Supabase Edge Function instead of direct webhook call
      const { data, error } = await supabase.functions.invoke('generate-campaign', {
        body: requestData
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to generate campaign');
      }

      console.log('Campaign generation response:', data);
      
      // Set the campaign results for display
      setCampaignResults(data);

      toast({
        title: "Campaign Generated! 🚀",
        description: "Your AI-powered campaign plan is ready!"
      });
    } catch (error) {
      console.error('Error generating campaign:', error);
      toast({
        title: "Request Failed",
        description: "Unable to generate campaign. Please try again.",
        variant: "destructive"
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
