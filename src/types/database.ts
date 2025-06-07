
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      social_posts: {
        Row: {
          id: string
          user_id: string
          created_at: string
          content: string
          status: 'draft' | 'posted' | 'failed'
          generation_source: 'manual' | 'automated'
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          content: string
          status?: 'draft' | 'posted' | 'failed'
          generation_source?: 'manual' | 'automated'
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          content?: string
          status?: 'draft' | 'posted' | 'failed'
          generation_source?: 'manual' | 'automated'
        }
      }
      agent_settings: {
        Row: {
          id: string
          user_id: string
          agent_name: string
          settings_json: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          agent_name: string
          settings_json?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          agent_name?: string
          settings_json?: any
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
