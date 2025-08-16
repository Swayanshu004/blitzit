"use client"

import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { ArrowRight, Trash2, Calendar, AlertTriangle, RotateCcw, Zap } from "lucide-react"

export function QuickActions({ tasks, onMoveAll, onClearCompleted, onDeleteTask }) {
  const todayTasks = tasks.filter((task) => task.column === "today")
  const thisWeekTasks = tasks.filter((task) => task.column === "thisWeek")
  const backlogTasks = tasks.filter((task) => task.column === "backlog")
  const doneTasks = tasks.filter((task) => task.column === "done")
  const urgentTasks = tasks.filter((task) => task.priority === "urgent" && task.column !== "done")

  const moveUrgentToToday = () => {
    urgentTasks.forEach((task) => {
      if (task.column !== "today") {
        onMoveAll(task.column, "today")
      }
    })
  }

  const promoteWeekToToday = () => {
    if (thisWeekTasks.length > 0) {
      onMoveAll("thisWeek", "today")
    }
  }

  const archiveCompleted = () => {
    if (doneTasks.length > 0) {
      onClearCompleted()
    }
  }

  return (
    <Card className="bg-gradient-to-t from-amber-800 to-black border-amber-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {urgentTasks.length > 0 && (
            <Button
              onClick={moveUrgentToToday}
              size="sm"
              className="bg-gradient-to-b from-red-500 to-amber-500 hover:bg-gradient-to-t text-white"
            >
              <AlertTriangle className="w-3 h-3 mr-1" />
              Move {urgentTasks.length} Urgent to Today
            </Button>
          )}

          {thisWeekTasks.length > 0 && (
            <Button
              onClick={promoteWeekToToday}
              size="sm"
              variant="outline"
              className="border-blue-200 text-blue-700 hover:bg-blue-500 hover:text-white bg-white"
            >
              <ArrowRight className="w-3 h-3 mr-1" />
              Promote Week to Today ({thisWeekTasks.length})
            </Button>
          )}

          {backlogTasks.length > 0 && (
            <Button
              onClick={() => onMoveAll("backlog", "thisWeek")}
              size="sm"
              variant="outline"
              className="border-green-200 text-green-700 bg-white hover:bg-green-100"
            >
              <Calendar className="w-3 h-3 mr-1" />
              Plan Backlog ({backlogTasks.length})
            </Button>
          )}

          {doneTasks.length > 0 && (
            <Button
              onClick={archiveCompleted}
              size="sm"
              variant="outline"
              className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-white"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Archive {doneTasks.length} Completed
            </Button>
          )}

          {todayTasks.length === 0 && thisWeekTasks.length > 0 && (
            <Button
              onClick={() => onMoveAll("thisWeek", "today")}
              size="sm"
              className="bg-gradient-to-t from-neutral-600 to-neutral-950 hover:bg-gradient-to-b text-white"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Fill Today from This Week
            </Button>
          )}

          {tasks.length === 0 && (
            <div className="text-sm text-gray-500 italic">Create some tasks to see quick actions here</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
