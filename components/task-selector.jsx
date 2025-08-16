"use client"

import { TaskCard } from "./task-card"
import { Button } from "./ui/button"
import { X, Zap } from "lucide-react"

export function TaskSelector({ tasks, onSelectTask, onCancel }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Choose Task for Blitz Mode</h1>
              <p className="text-gray-600 dark:text-gray-400">Select which task you want to focus on</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="cursor-pointer transform hover:scale-[1.02] transition-transform"
              onClick={() => onSelectTask(task)}
            >
              <TaskCard task={task} />
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No tasks available for Blitz mode</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Add some tasks to your Today list first</p>
          </div>
        )}
      </div>
    </div>
  )
}
