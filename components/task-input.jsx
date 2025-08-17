"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Label } from "./ui/label"
import { Plus, Clock, Calendar, Sparkles } from "lucide-react"

export function TaskInput({ onAddTask }) {
  const [input, setInput] = useState("")
  const [timerDuration, setTimerDuration] = useState("15")
  const [scheduledTime, setScheduledTime] = useState("0:0am")
  const [priority, setPriority] = useState("medium")
  const [showAdvanced, setShowAdvanced] = useState(true)

  const parseTimeFromText = (text) => {
    const patterns = [
      /(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h)\s*(?:(\d+(?:\.\d+)?)\s*(?:minutes?|mins?|m))?/gi,
      /(\d+(?:\.\d+)?)\s*(?:minutes?|mins?|m)/gi,
      /(\d+(?:\.\d+)?)\s*(?:h|hr|hrs|hours?)\s*(\d+(?:\.\d+)?)\s*(?:m|min|mins|minutes?)/gi,
    ]

    let totalMinutes = 25 // Default 25 minutes
    let cleanTitle = text

    for (const pattern of patterns) {
      const matches = Array.from(text.matchAll(pattern))
      if (matches.length > 0) {
        const match = matches[0]

        if (pattern.source.includes("hours?|hrs?|h")) {
          const hours = Number.parseFloat(match[1]) || 0
          const minutes = Number.parseFloat(match[2]) || 0
          totalMinutes = hours * 60 + minutes
        } else {
          totalMinutes = Number.parseFloat(match[1]) || 25
        }

        cleanTitle = text.replace(match[0], "").trim()
        break
      }
    }

    return {
      title: cleanTitle || text,
      time: Math.max(1, Math.round(totalMinutes)),
    }
  }

  const formatTimeInput = (value) => {
    // Remove any non-digit characters except colon
    const cleaned = value.replace(/[^\d:]/g, "")

    // Handle basic time format
    if (cleaned.includes(":")) {
      const [hours, minutes] = cleaned.split(":")
      if (hours && minutes) {
        const h = Number.parseInt(hours)
        const m = Number.parseInt(minutes)
        if (h >= 1 && h <= 12 && m >= 0 && m <= 59) {
          return cleaned
        }
      }
    }

    return cleaned
  }

  const handleTimeChange = (e) => {
    const formatted = formatTimeInput(e.target.value)
    setScheduledTime(formatted)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) {
      const { title, time } = parseTimeFromText(input.trim())
      onAddTask(title, time, Number.parseInt(timerDuration), scheduledTime || undefined, priority)
      setInput("")
      setScheduledTime("")
      setShowAdvanced(false)
    }
  }

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a task (e.g., 'Review code for 1h 30m')"
            className="flex-1 bg-white backdrop-blur-sm border-gray-200 focus:border-amber-500  text-black font-semibold"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`px-3 transition-all duration-200 ${
              showAdvanced
                ? "bg-gradient-to-t from-amber-600 to-yellow-300 shadow-lg"
                : "bg-neutral-900 backdrop-blur-sm border-gray-200 hover:bg-gradient-to-t hover:from-amber-600 hover:to-yellow-300"
            }`}
          >
            <Sparkles className="w-4 h-4" />
          </Button>
          <Button
            type="submit"
            size="sm"
            className="px-3 bg-gradient-to-t from-amber-600 to-yellow-300 hover:from-yellow-300 hover:to-amber-600 shadow-lg"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {showAdvanced && (
          <div className="bg-gradient-to-br from-blue-50/80 to-purple-50/80 backdrop-blur-sm p-4 rounded-xl border border-blue-200/50 shadow-lg space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timer-duration" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Timer Duration
                </Label>
                <Select value={timerDuration} onValueChange={setTimerDuration}>
                  <SelectTrigger className="h-9 bg-white/80 backdrop-blur-sm focus:border-blue-400 text-black">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15" selected>15 min</SelectItem>
                    <SelectItem value="25">25 min</SelectItem>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="45">45 min</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="180">3 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-red-400" />
                  Priority
                </Label>
                <Select value={priority} onValueChange={(value) => setPriority(value)}>
                  <SelectTrigger className="h-9 bg-white/80 backdrop-blur-sm border-blue-200 focus:border-blue-400 text-black">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-lime-500" />
                        Low
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-400" />
                        Medium
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        High
                      </div>
                    </SelectItem>
                    <SelectItem value="urgent">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        Urgent
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="scheduled-time" className="text-sm font-medium flex items-center gap-1 text-black">
                <Calendar className="w-3 h-3" />
                Scheduled Time (optional)
              </Label>
              <div className="flex gap-2">
                <Input
                  id="scheduled-time"
                  value={scheduledTime}
                  onChange={handleTimeChange}
                  placeholder="7:00"
                  className="flex-1 h-9 bg-white/80 backdrop-blur-sm focus:ring-amber-400 text-black"
                  maxLength={5}
                />
                <Select
                  value={scheduledTime.includes("am") ? "am" : scheduledTime.includes("pm") ? "pm" : ""}
                  onValueChange={(period) => {
                    if (scheduledTime && !scheduledTime.includes("am") && !scheduledTime.includes("pm")) {
                      setScheduledTime(scheduledTime + period)
                    } else {
                      setScheduledTime(scheduledTime.replace(/(am|pm)/, period))
                    }
                  }}
                >
                  <SelectTrigger className="w-20 h-9 bg-white/80 backdrop-blur-sm border-blue-200 focus:border-blue-400 text-black text-xs px-2">
                    <SelectValue placeholder="am | pm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="am" selected>am</SelectItem>
                    <SelectItem value="pm">pm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
