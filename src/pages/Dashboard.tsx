
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquare, TrendingUp, Activity } from 'lucide-react'
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Marketing Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your Marketing Agents Portal. Manage your automated marketing workflows below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Actions Card */}
        <Card className="border border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Generate content and start campaigns instantly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full"
              onClick={() => navigate('/content-agent')}
            >
              Generate New Social Posts
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              disabled
            >
              Start New Email Outreach
              <span className="ml-2 text-xs">(Coming Soon)</span>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity Card */}
        <Card className="border border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your latest marketing activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex justify-between items-start text-sm">
                  <span className="text-foreground flex-1">{activity.action}</span>
                  <span className="text-muted-foreground text-xs ml-2">{activity.timestamp}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Snapshot Card */}
        <Card className="border border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
              Performance Snapshot
            </CardTitle>
            <CardDescription>
              Key metrics from your campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Campaign Reach This Week</span>
                <span className="text-2xl font-bold text-primary">12.5K</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Engagement Rate</span>
                <span className="text-lg font-semibold text-green-600">+15.3%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Posts Generated</span>
                <span className="text-lg font-semibold text-foreground">24</span>
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
