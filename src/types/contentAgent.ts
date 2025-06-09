
export interface SocialPost {
  id: string
  content: string
  status: 'draft' | 'posted' | 'failed'
  generation_source: 'manual' | 'automated'
  created_at: string
}

export interface AgentSettings {
  topics: string
  frequency: string
  automationEnabled: boolean
  postingMode: string
}
