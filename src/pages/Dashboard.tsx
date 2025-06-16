
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquare, TrendingUp, Activity, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate()

  const recentActivity = [
    { action: 'Weekly social posts generated', timestamp: '2 hours ago' },
    { action: 'Content Agent settings updated', timestamp: '1 day ago' },
    { action: 'Monthly insight report emailed', timestamp: '3 days ago' },
    { action: 'New campaign launched', timestamp: '5 days ago' },
    { action: 'Engagement metrics reviewed', timestamp: '1 week ago' },
  ]

  return (
    <div className="space-y-4 lg:space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Marketing Dashboard</h1>
        <p className="text-muted-foreground mt-1 lg:mt-2 text-sm lg:text-base">
          Welcome to your Marketing Agents Portal. Manage your automated marketing workflows below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {/* Quick Actions Card */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-3 lg:pb-6">
            <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
              <MessageSquare className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription className="text-sm">
              Generate content and start campaigns instantly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 lg:space-y-3 pt-0">
            <Button 
              className="w-full text-sm lg:text-base h-9 lg:h-10"
              onClick={() => navigate('/content-agent')}
            >
              Generate New Social Posts
            </Button>
            <Button 
              className="w-full text-sm lg:text-base h-9 lg:h-10"
              onClick={() => navigate('/smart-campaign-planner')}
              variant="outline"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Plan AI Campaign
            </Button>
            <Button 
              variant="outline" 
              className="w-full text-sm lg:text-base h-9 lg:h-10"
              disabled
            >
              Start New Email Outreach
              <span className="ml-2 text-xs">(Coming Soon)</span>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity Card */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-3 lg:pb-6">
            <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
              <Activity className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-sm">
              Your latest marketing activities
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 lg:space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-start text-sm gap-1 sm:gap-2">
                  <span className="text-foreground flex-1 text-sm lg:text-sm">{activity.action}</span>
                  <span className="text-muted-foreground text-xs">{activity.timestamp}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Snapshot Card */}
        <Card className="border border-border shadow-sm lg:col-span-2 xl:col-span-1">
          <CardHeader className="pb-3 lg:pb-6">
            <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
              <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
              Performance Snapshot
            </CardTitle>
            <CardDescription className="text-sm">
              Key metrics from your campaigns
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3 lg:space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Campaign Reach This Week</span>
                <span className="text-xl lg:text-2xl font-bold text-primary">12.5K</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Engagement Rate</span>
                <span className="text-base lg:text-lg font-semibold text-green-600">+15.3%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Posts Generated</span>
                <span className="text-base lg:text-lg font-semibold text-foreground">24</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full w-3/4"></div>
              </div>
              <p className="text-xs text-muted-foreground">Campaign performance vs. goals</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
