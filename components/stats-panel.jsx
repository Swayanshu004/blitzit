"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Progress } from "./ui/progress"
import { Clock, Target, CheckCircle2, AlertCircle, Calendar } from "lucide-react"

export function StatsPanel({ tasks }) {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.column === "done").length
  const todayTasks = tasks.filter((task) => task.column === "today").length
  const urgentTasks = tasks.filter((task) => task.priority === "urgent" && task.column !== "done").length

  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const totalEstimatedTime = tasks
    .filter((task) => task.column !== "done")
    .reduce((acc, task) => acc + task.estimatedTime, 0)

  const completedTime = tasks
    .filter((task) => task.column === "done")
    .reduce((acc, task) => acc + task.estimatedTime, 0)

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const priorityStats = {
    urgent: tasks.filter((task) => task.priority === "urgent").length,
    high: tasks.filter((task) => task.priority === "high").length,
    medium: tasks.filter((task) => task.priority === "medium").length,
    low: tasks.filter((task) => task.priority === "low").length,
  }

  const scheduledToday = tasks.filter((task) => {
    if (!task.scheduledTime) return false
    const now = new Date()
    const today = now.toDateString()
    return task.scheduledTime && task.column !== "done"
  }).length

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-800">Completion Rate</CardTitle>
          <Target className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{completionRate.toFixed(0)}%</div>
          <Progress value={completionRate} className="mt-2" />
          <p className="text-xs text-blue-600 mt-1">
            {completedTasks} of {totalTasks} tasks completed
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-800">Today's Focus</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-900">{todayTasks}</div>
          <p className="text-xs text-orange-600 mt-1">Tasks in Today column</p>
          {scheduledToday > 0 && (
            <div className="flex items-center mt-2 text-xs text-orange-700">
              <Calendar className="w-3 h-3 mr-1" />
              {scheduledToday} scheduled for today
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-800">Urgent Tasks</CardTitle>
          <AlertCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-900">{urgentTasks}</div>
          <p className="text-xs text-red-600 mt-1">Require immediate attention</p>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-red-600">High: {priorityStats.high}</span>
              <span className="text-orange-600">Med: {priorityStats.medium}</span>
              <span className="text-green-600">Low: {priorityStats.low}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-800">Time Tracking</CardTitle>
          <Clock className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">{formatTime(totalEstimatedTime)}</div>
          <p className="text-xs text-green-600 mt-1">Remaining work time</p>
          <div className="text-xs text-green-700 mt-1">Completed: {formatTime(completedTime)}</div>
        </CardContent>
      </Card>
    </div>
  )
}
