
export interface CampaignFormData {
  topic: string;
  duration: number;
  tone: string;
  channels: string[];
  mode: string;
  startDate?: Date;
  dailyIteration: boolean;
  notifications: string[];
}

export interface CampaignResult {
  campaignTitle: string;
  weeks: {
    week: number;
    theme: string;
    contentIdeas: {
      [channel: string]: string[];
    };
  }[];
}

export interface WebhookCampaignResult {
  campaignTitle: string;
  weeks: string;
}
