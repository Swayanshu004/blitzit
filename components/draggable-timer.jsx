"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause } from "lucide-react"

export function DraggableTimer({ timeLeft, totalTime, isRunning, onToggle }) {
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const timerRef = useRef()

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleMouseDown = (e) => {
    if (timerRef.current) {
      const rect = timerRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
      setIsDragging(true)
    }
  }

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x
      const newY = e.clientY - dragOffset.y

      const maxX = typeof window !== "undefined" ? window.innerWidth - 120 : 0
      const maxY = typeof window !== "undefined" ? window.innerHeight - 120 : 0

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, dragOffset])

  const progress = ((totalTime - timeLeft) / totalTime) * 100

  return (
    <div
      ref={timerRef}
      className={`fixed z-50 w-32 h-32 rounded-full shadow-2xl flex flex-col items-center justify-center cursor-move select-none ${
        isDragging ? "scale-110" : "hover:scale-105"
      } transition-all duration-300`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        background: `conic-gradient(from 0deg, #f97316 0%, #ef4444 ${progress}%, #e5e7eb ${progress}%, #e5e7eb 100%)`,
        boxShadow: isDragging
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(249, 115, 22, 0.3)"
          : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(249, 115, 22, 0.2)",
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="w-28 h-28 rounded-full bg-gradient-to-br from-white to-gray-50 flex flex-col items-center justify-center shadow-inner border border-white/50">
        <div className="text-sm font-mono font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent leading-tight">
          {formatTime(timeLeft)}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggle()
          }}
          className="mt-1 p-2 rounded-full hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-200 group"
        >
          {isRunning ? (
            <Pause className="w-4 h-4 text-orange-500 group-hover:text-red-500 transition-colors" />
          ) : (
            <Play className="w-4 h-4 text-orange-500 group-hover:text-red-500 transition-colors" />
          )}
        </button>
      </div>
    </div>
  )
}
