
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'
import type { AgentSettings } from '@/types/contentAgent'

export const useAgentSettings = () => {
  const { user } = useAuth()
  const [settings, setSettings] = useState<AgentSettings>({
    topics: '',
    frequency: 'weekly',
    automationEnabled: false,
    postingMode: 'drafts'
  })
  const [loading, setLoading] = useState(false)

  const loadSettings = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('agent_settings')
      .select('*')
      .eq('user_id', user.id)
      .eq('agent_name', 'Content Agent')
      .single()

    if (data && !error) {
      const settingsData = data.settings_json as unknown as AgentSettings
      setSettings(settingsData)
    }
  }

  const saveSettings = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('agent_settings')
        .upsert({
          user_id: user.id,
          agent_name: 'Content Agent',
          settings_json: settings as any,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      toast({
        title: "Settings Saved",
        description: "Your Content Agent settings have been updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadSettings()
    }
  }, [user])

  return {
    settings,
    setSettings,
    loading,
    saveSettings
  }
}
