"use client"

import {
  Calendar,
  Zap,
  CheckCircle2,
  Trash2,
  MoreHorizontal,
  Play,
  Plus,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { useState } from "react"

export function TaskCard({ task, onDelete, onStartBlitz, onUpdateTask, showBlitzButton = false }) {
  const [showSubtasks, setShowSubtasks] = useState(false)
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("")
  const [isAddingSubtask, setIsAddingSubtask] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes}m`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  const getPriorityColors = (priority) => {
    switch (priority) {
      case "urgent":
        return "priority-urgent bg-gradient-to-br from-red-500/20 via-red-600/30 to-red-500/20 dark:from-red-600 dark:via-red-500 dark:to-red-600 border-red-300 dark:border-red-400 shadow-xl shadow-red-500/20 backdrop-blur-sm"
      case "high":
        return "priority-high bg-gradient-to-br from-orange-500/20 via-orange-600/30 to-orange-500/20 dark:from-orange-600 dark:via-orange-500 dark:to-orange-600 border-orange-300 dark:border-orange-400 shadow-xl shadow-orange-500/20 backdrop-blur-sm"
      case "medium":
        return "priority-medium bg-gradient-to-br from-blue-500/20 via-blue-600/30 to-blue-500/20 dark:from-blue-600 dark:via-blue-500 dark:to-blue-600 border-blue-300 dark:border-blue-400 shadow-xl shadow-blue-500/20 backdrop-blur-sm"
      case "low":
        return "priority-low bg-gradient-to-br from-green-500/20 via-green-600/30 to-green-500/20 dark:from-green-600 dark:via-green-500 dark:to-green-600 border-green-300 dark:border-green-400 shadow-xl shadow-green-500/20 backdrop-blur-sm"
      default:
        return "bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 border-gray-300 dark:border-gray-500 shadow-xl shadow-gray-500/20 backdrop-blur-sm"
    }
  }

  const getPriorityDot = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/40 ring-2 ring-red-200 dark:ring-red-800/50"
      case "high":
        return "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/40 ring-2 ring-orange-200 dark:ring-orange-800/50"
      case "medium":
        return "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/40 ring-2 ring-blue-200 dark:ring-blue-800/50"
      case "low":
        return "bg-gradient-to-r from-green-500 to-green-600 shadow-lg shadow-green-500/40 ring-2 ring-green-200 dark:ring-green-800/50"
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 shadow-lg shadow-gray-500/40 ring-2 ring-gray-200 dark:ring-gray-700/50"
    }
  }

  const addSubtask = () => {
    if (!newSubtaskTitle.trim() || !onUpdateTask) return

    const newSubtask = {
      id: Date.now().toString(),
      title: newSubtaskTitle.trim(),
      completed: false,
      createdAt: new Date(),
    }

    const updatedTask = {
      ...task,
      subtasks: [...task.subtasks, newSubtask],
    }

    onUpdateTask(updatedTask)
    setNewSubtaskTitle("")
    setIsAddingSubtask(false)
  }

  const toggleSubtask = (subtaskId) => {
    if (!onUpdateTask) return

    const updatedSubtasks = task.subtasks.map((subtask) =>
      subtask.id === subtaskId
        ? {
            ...subtask,
            completed: !subtask.completed,
            completedAt: !subtask.completed ? new Date() : undefined,
          }
        : subtask,
    )

    const updatedTask = {
      ...task,
      subtasks: updatedSubtasks,
    }

    onUpdateTask(updatedTask)
  }

  const deleteSubtask = (subtaskId) => {
    if (!onUpdateTask) return

    const updatedTask = {
      ...task,
      subtasks: task.subtasks.filter((subtask) => subtask.id !== subtaskId),
    }

    onUpdateTask(updatedTask)
  }

  const completedSubtasks = task.subtasks.filter((subtask) => subtask.completed).length
  const totalSubtasks = task.subtasks.length
  const isCompleted = task.column === "done"

  return (
    <div
      className={`${getPriorityColors(task.priority)} border-2 rounded-2xl p-5 mb-4 hover:shadow-2xl transition-all duration-300 cursor-grab active:cursor-grabbing group hover:scale-[1.02] ${
        isCompleted ? "opacity-80 scale-95" : ""
      } backdrop-blur-lg bg-white/5 dark:bg-black/10 border-white/10 dark:border-gray-700/20`}
    >
      {/* Header with title and actions */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className={`w-4 h-4 rounded-full ${getPriorityDot(task.priority)} flex-shrink-0`} />
          <div className="flex-1">
            <h3
              className={`font-bold text-lg leading-tight ${isCompleted ? "line-through opacity-60" : ""} text-gray-900 dark:text-white drop-shadow-sm`}
            >
              {task.title}
            </h3>
            {totalSubtasks > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 drop-shadow-sm">
                  {completedSubtasks}/{totalSubtasks} subtasks
                </div>
                <div className="flex-1 bg-white/30 dark:bg-black/30 rounded-full h-2 max-w-20 backdrop-blur-sm">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-300 shadow-sm"
                    style={{ width: `${totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-3">
          {totalSubtasks > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-700 hover:text-gray-900 hover:bg-white/20 dark:text-gray-300 dark:hover:text-white dark:hover:bg-black/20 rounded-xl backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation()
                setShowSubtasks(!showSubtasks)
              }}
            >
              {showSubtasks ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          )}

          {showBlitzButton && onStartBlitz && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 opacity-70 hover:opacity-100 transition-all duration-200 text-orange-600 hover:text-orange-700 hover:bg-orange-100/30 dark:text-orange-400 dark:hover:text-orange-300 dark:hover:bg-orange-900/30 rounded-xl backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation()
                onStartBlitz()
              }}
              title="Start Blitz Mode"
            >
              <Play className="w-4 h-4" />
            </Button>
          )}

          {onDelete && (
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-70 hover:opacity-100 transition-all duration-200 text-gray-700 hover:text-gray-900 hover:bg-white/20 dark:text-gray-300 dark:hover:text-white dark:hover:bg-black/20 rounded-xl backdrop-blur-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-white/20 dark:border-gray-700/50 shadow-2xl rounded-xl"
                sideOffset={5}
              >
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsAddingSubtask(true)
                    setDropdownOpen(false)
                  }}
                  className="text-blue-600 focus:text-blue-700 dark:text-blue-400 dark:focus:text-blue-300 focus:bg-blue-50/80 dark:focus:bg-blue-900/20 cursor-pointer rounded-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Subtask
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete()
                    setDropdownOpen(false)
                  }}
                  className="text-red-600 focus:text-red-700 dark:text-red-400 dark:focus:text-red-300 focus:bg-red-50/80 dark:focus:bg-red-900/20 cursor-pointer rounded-lg"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />}
        </div>
      </div>

      {(showSubtasks || isAddingSubtask) && (
        <div className="mb-4 space-y-2 p-4 bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-xl border border-white/30 dark:border-gray-600/30">
          {task.subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className="flex items-center gap-3 p-3 bg-white/40 dark:bg-black/40 backdrop-blur-md rounded-lg border border-white/30 dark:border-gray-600/30 shadow-sm hover:bg-white/50 dark:hover:bg-black/50 transition-all duration-200"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleSubtask(subtask.id)
                }}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                  subtask.completed
                    ? "bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/30"
                    : "border-gray-400 dark:border-gray-500 hover:border-green-400 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm"
                }`}
              >
                {subtask.completed && <CheckCircle2 className="w-3 h-3" />}
              </button>
              <span
                className={`flex-1 text-sm font-medium ${
                  subtask.completed
                    ? "line-through text-gray-500 dark:text-gray-400"
                    : "text-gray-900 dark:text-white drop-shadow-sm"
                }`}
              >
                {subtask.title}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-50/80 dark:hover:bg-red-900/30 rounded-lg backdrop-blur-sm opacity-70 hover:opacity-100 transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteSubtask(subtask.id)
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}

          {isAddingSubtask && (
            <div className="flex items-center gap-2 p-3 bg-blue-50/90 dark:bg-blue-900/40 backdrop-blur-md rounded-lg border border-blue-200/50 dark:border-blue-600/50">
              <Input
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Enter subtask..."
                className="flex-1 text-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addSubtask()
                  } else if (e.key === "Escape") {
                    setIsAddingSubtask(false)
                    setNewSubtaskTitle("")
                  }
                }}
                autoFocus
              />
              <Button
                size="sm"
                onClick={addSubtask}
                disabled={!newSubtaskTitle.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-3 py-1 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-200"
              >
                Add
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAddingSubtask(false)
                  setNewSubtaskTitle("")
                }}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 px-2 py-1 rounded-lg backdrop-blur-sm"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white/20 dark:bg-black/20 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 dark:border-gray-600/20 shadow-sm">
            <span className="font-semibold text-gray-900 dark:text-white drop-shadow-sm">
              {formatTime(task.estimatedTime)}
            </span>
          </div>

          {task.timerDuration !== task.estimatedTime && (
            <div className="flex items-center bg-orange-100/90 dark:bg-orange-900/50 backdrop-blur-md px-3 py-2 rounded-xl border border-orange-300/50 dark:border-orange-600/50 shadow-sm">
              <Zap className="w-4 h-4 mr-2 text-orange-600 dark:text-orange-400" />
              <span className="font-semibold text-orange-800 dark:text-orange-200 drop-shadow-sm">
                {formatTime(task.timerDuration)}
              </span>
            </div>
          )}
        </div>

        {task.scheduledTime && (
          <div className="flex items-center bg-blue-100/90 dark:bg-blue-900/50 backdrop-blur-md px-3 py-2 rounded-xl border border-blue-300/50 dark:border-blue-600/50 shadow-sm">
            <Calendar className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-blue-800 dark:text-blue-200 drop-shadow-sm">{task.scheduledTime}</span>
          </div>
        )}
      </div>

      {/* Completion timestamp */}
      {isCompleted && task.completedAt && (
        <div className="mt-4 text-sm font-medium text-green-700 dark:text-green-300 bg-green-100/80 dark:bg-green-900/30 backdrop-blur-md px-3 py-2 rounded-xl inline-flex items-center border border-green-200/50 dark:border-green-700/50 shadow-sm">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Completed {new Date(task.completedAt).toLocaleDateString()}
        </div>
      )}
    </div>
  )
}
