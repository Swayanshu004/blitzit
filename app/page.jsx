"use client"

import { useState, useEffect } from "react"
import { TaskBoard } from "@/components/task-board"
import { BlitzMode } from "@/components/blitz-mode"
import { TaskSelector } from "@/components/task-selector"

export default function Home() {
  const [tasks, setTasks] = useState([])
  const [isBlitzMode, setIsBlitzMode] = useState(false)
  const [showTaskSelector, setShowTaskSelector] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load tasks from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTasks = localStorage.getItem("blitzit-tasks")
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks)
        const migratedTasks = parsedTasks.map((task) => ({
          ...task,
          timerDuration: task.timerDuration || task.estimatedTime || 25,
          priority: task.priority || "medium",
          column: task.column === "done" ? "done" : task.column || "today",
          subtasks: task.subtasks || [],
        }))
        setTasks(migratedTasks)
      }
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("blitzit-tasks", JSON.stringify(tasks))
    }
  }, [tasks])

  if (!isClient) {
    return null
  }

  const todayTasks = tasks.filter((task) => task.column === "today")
  const thisWeekTasks = tasks.filter((task) => task.column === "thisWeek")
  const backlogTasks = tasks.filter((task) => task.column === "backlog")
  const doneTasks = tasks.filter((task) => task.column === "done")

  const startBlitzMode = (task) => {
    if (task) {
      setSelectedTask(task)
      setIsBlitzMode(true)
    } else if (todayTasks.length > 0) {
      setShowTaskSelector(true)
    }
  }

  const selectTaskForBlitz = (task) => {
    setSelectedTask(task)
    setShowTaskSelector(false)
    setIsBlitzMode(true)
  }

  const exitBlitzMode = () => {
    setIsBlitzMode(false)
    setSelectedTask(null)
  }

  const completeCurrentTask = () => {
    if (selectedTask) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === selectedTask.id
            ? { ...task, column: "done", completedAt: new Date(), order: doneTasks.length }
            : task,
        ),
      )
      exitBlitzMode()
    }
  }

  const updateTask = (updatedTask) => {
    setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
  }

  if (showTaskSelector) {
    return (
      <TaskSelector tasks={todayTasks} onSelectTask={selectTaskForBlitz} onCancel={() => setShowTaskSelector(false)} />
    )
  }

  if (isBlitzMode && selectedTask) {
    return <BlitzMode task={selectedTask} onComplete={completeCurrentTask} onStop={exitBlitzMode} />
  }

  return (
    <TaskBoard
      tasks={tasks}
      setTasks={setTasks}
      todayTasks={todayTasks}
      thisWeekTasks={thisWeekTasks}
      backlogTasks={backlogTasks}
      doneTasks={doneTasks}
      onStartBlitz={startBlitzMode}
      onUpdateTask={updateTask}
    />
  )
}
