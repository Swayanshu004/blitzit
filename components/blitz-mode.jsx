"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "./ui/button"
import { Check, Square, CheckCircle2, Circle, Play, Pause } from "lucide-react"

export function BlitzMode({ task, onComplete, onStop }) {
  const [timeLeft, setTimeLeft] = useState(task.timerDuration * 60)
  const [isRunning, setIsRunning] = useState(true)
  const [completedSubtasks, setCompletedSubtasks] = useState(new Set())
  const intervalRef = useRef()

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            setTimeout(onComplete, 100)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft, onComplete])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const toggleSubtask = (subtaskId) => {
    const newCompleted = new Set(completedSubtasks)
    if (newCompleted.has(subtaskId)) {
      newCompleted.delete(subtaskId)
    } else {
      newCompleted.add(subtaskId)
    }
    setCompletedSubtasks(newCompleted)
  }

  const progress = ((task.timerDuration * 60 - timeLeft) / (task.timerDuration * 60)) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-slate-950 flex flex-col items-center justify-center p-6 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />

      <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-4 truncate">{task.title}</h1>

        <div className="mb-6">
          <div className="text-6xl font-mono font-bold text-white mb-4 tracking-wider">{formatTime(timeLeft)}</div>

          <div className="w-full bg-white/10 rounded-full h-2 mb-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>

          <Button
            onClick={toggleTimer}
            variant="ghost"
            className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white hover:text-white mb-4"
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
        </div>

        {task.subtasks && task.subtasks.length > 0 && (
          <div className="mb-6">
            <div className="text-sm text-gray-300 mb-3">
              {completedSubtasks.size}/{task.subtasks.length} subtasks
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {task.subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  className="flex items-center gap-3 p-2 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                  onClick={() => toggleSubtask(subtask.id)}
                >
                  {completedSubtasks.has(subtask.id) ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                  <span
                    className={`text-sm truncate ${
                      completedSubtasks.has(subtask.id) ? "line-through text-gray-400" : "text-white"
                    }`}
                  >
                    {subtask.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <Button
            onClick={onComplete}
            className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30 backdrop-blur-md flex-1 py-2 text-sm"
          >
            <Check className="w-4 h-4 mr-2" />
            Complete
          </Button>
          <Button
            onClick={onStop}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 backdrop-blur-md flex-1 py-2 text-sm bg-transparent"
          >
            <Square className="w-4 h-4 mr-2" />
            Stop
          </Button>
        </div>

        <div className="mt-4 flex justify-center gap-4 text-xs text-gray-400">
          <span>{task.timerDuration}min session</span>
          {task.scheduledTime && <span>{task.scheduledTime}</span>}
        </div>
      </div>
    </div>
  )
}
