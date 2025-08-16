"use client"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { TaskCard } from "./task-card"
import { TaskInput } from "./task-input"
import { Button } from "./ui/button"
import { StatsPanel } from "./stats-panel"
import { QuickActions } from "./quick-actions"
import { Zap, CheckCircle2, BarChart3, Moon, Sun } from "lucide-react"
import { useState } from "react"
import { useTheme } from "next-themes"

export function TaskBoard({
  tasks,
  setTasks,
  todayTasks,
  thisWeekTasks,
  backlogTasks,
  doneTasks,
  onStartBlitz,
  onUpdateTask,
}) {
  const [showDone, setShowDone] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const { theme, setTheme } = useTheme()

  const addTask = (title, estimatedTime, timerDuration, scheduledTime, priority = "medium") => {
    const newTask = {
      id: Date.now().toString(),
      title,
      estimatedTime,
      timerDuration,
      scheduledTime,
      priority,
      column: "today",
      order: todayTasks.length,
      createdAt: new Date(),
      subtasks: [],
    }
    setTasks((prev) => [...prev, newTask])
  }

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    const sourceColumn = source.droppableId
    const destColumn = destination.droppableId

    setTasks((prev) => {
      const newTasks = [...prev]
      const draggedTask = newTasks.find((task) => task.id === draggableId)

      if (!draggedTask) return prev

      if (destColumn === "done" && sourceColumn !== "done") {
        draggedTask.completedAt = new Date()
      } else if (sourceColumn === "done" && destColumn !== "done") {
        draggedTask.completedAt = undefined
      }

      draggedTask.column = destColumn
      draggedTask.order = destination.index

      const destTasks = newTasks.filter((task) => task.column === destColumn && task.id !== draggableId)
      destTasks.splice(destination.index, 0, draggedTask)
      destTasks.forEach((task, index) => {
        task.order = index
      })

      if (sourceColumn !== destColumn) {
        const sourceTasks = newTasks.filter((task) => task.column === sourceColumn)
        sourceTasks.forEach((task, index) => {
          task.order = index
        })
      }

      return newTasks
    })
  }

  const getTasksByColumn = (column) => {
    return tasks.filter((task) => task.column === column).sort((a, b) => a.order - b.order)
  }

  const clearCompletedTasks = () => {
    setTasks((prev) => prev.filter((task) => task.column !== "done"))
  }

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  const moveAllToColumn = (fromColumn, toColumn) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.column === fromColumn) {
          return {
            ...task,
            column: toColumn,
            completedAt: toColumn === "done" ? new Date() : undefined,
          }
        }
        return task
      }),
    )
  }

  const startBlitzWithTask = (task) => {
    onStartBlitz(task)
  }

  return (
    <div className="main-container min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-black dark:via-gray-900 dark:to-black transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 p-4 component-bg rounded-2xl border shadow-lg">
          <h1 className="text-4xl font-bold bg-gradient-to-t from-blue-600 to-purple-600 dark:from-amber-600 dark:to-yellow-200 bg-clip-text text-transparent">
            Blitzit
          </h1>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              variant="outline"
              size="sm"
              className="component-bg border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-high-contrast"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button
              onClick={() => setShowStats(!showStats)}
              variant="outline"
              className="flex items-center gap-2 component-bg border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-high-contrast"
            >
              <BarChart3 className="w-4 h-4" />
              Stats
            </Button>
            <Button
              onClick={() => setShowDone(!showDone)}
              variant="outline"
              className="flex items-center gap-2 component-bg border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-high-contrast"
            >
              <CheckCircle2 className="w-4 h-4" />
              {showDone ? "Hide Done" : `Done (${doneTasks.length})`}
            </Button>
            <Button
              onClick={() => onStartBlitz()}
              disabled={todayTasks.length === 0}
              className="bg-gradient-to-t from-amber-700 to-yellow-400 hover:from-yellow-400 hover:to-amber-700 text-black font-semibold px-6 py-2 rounded-lg flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="w-4 h-4" />
              BLITZ NOW
            </Button>
          </div>
        </div>

        {showStats && (
          <div className="mb-6">
            <StatsPanel tasks={tasks} />
          </div>
        )}

        <DragDropContext onDragEnd={onDragEnd} className="z-0">
          <div className="task-columns">
            <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30">
              <div className="p-6 border-b border-white/20 dark:border-gray-700/30 bg-white/5 dark:bg-black/10 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white drop-shadow-sm">Today</h2>
                <p className="text-sm text-gray-700 dark:text-gray-300 drop-shadow-sm">{todayTasks.length} tasks</p>
              </div>

              <Droppable droppableId="today">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[400px] p-4 transition-colors ${
                      snapshot.isDraggingOver ? "bg-blue-50/30 dark:bg-blue-900/20 backdrop-blur-sm" : ""
                    }`}
                  >
                    {getTasksByColumn("today").map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={snapshot.isDragging ? "rotate-2" : ""}
                          >
                            <TaskCard
                              task={task}
                              onDelete={() => deleteTask(task.id)}
                              onStartBlitz={() => startBlitzWithTask(task)}
                              onUpdateTask={onUpdateTask}
                              showBlitzButton={true}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <div className="p-4 border-t border-white/20 dark:border-gray-700/30 bg-white/5 dark:bg-black backdrop-blur-sm">
                <TaskInput onAddTask={addTask} />
              </div>
            </div>

            <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30">
              <div className="p-6 border-b border-white/20 dark:border-gray-700/30 bg-white/5 dark:bg-black/10 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white drop-shadow-sm">This Week</h2>
                <p className="text-sm text-gray-700 dark:text-gray-300 drop-shadow-sm">{thisWeekTasks.length} tasks</p>
              </div>

              <Droppable droppableId="thisWeek">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[400px] p-4 transition-colors ${
                      snapshot.isDraggingOver ? "bg-blue-50/30 dark:bg-blue-900/20 backdrop-blur-sm" : ""
                    }`}
                  >
                    {getTasksByColumn("thisWeek").map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={snapshot.isDragging ? "rotate-2" : ""}
                          >
                            <TaskCard task={task} onDelete={() => deleteTask(task.id)} onUpdateTask={onUpdateTask} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30">
              <div className="p-6 border-b border-white/20 dark:border-gray-700/30 bg-white/5 dark:bg-black/10 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white drop-shadow-sm">Backlog</h2>
                <p className="text-sm text-gray-700 dark:text-gray-300 drop-shadow-sm">{backlogTasks.length} tasks</p>
              </div>

              <Droppable droppableId="backlog">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[400px] p-4 transition-colors ${
                      snapshot.isDraggingOver ? "bg-blue-50/30 dark:bg-blue-900/20 backdrop-blur-sm" : ""
                    }`}
                  >
                    {getTasksByColumn("backlog").map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={snapshot.isDragging ? "rotate-2" : ""}
                          >
                            <TaskCard task={task} onDelete={() => deleteTask(task.id)} onUpdateTask={onUpdateTask} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            {showDone && (
              <div className="bg-green-100/20 dark:bg-green-950/30 backdrop-blur-md rounded-2xl shadow-xl border border-green-300/30 dark:border-green-700/30">
                <div className="p-6 border-b border-green-200/30 dark:border-green-800/30 flex items-center justify-between bg-green-50/20 dark:bg-green-900/20 backdrop-blur-sm">
                  <div>
                    <h2 className="text-xl font-bold text-green-800 dark:text-green-200 flex items-center gap-2 drop-shadow-sm">
                      <CheckCircle2 className="w-6 h-6" />
                      Done
                    </h2>
                    <p className="text-sm text-green-600 dark:text-green-400 drop-shadow-sm">
                      {doneTasks.length} completed
                    </p>
                  </div>
                  {doneTasks.length > 0 && (
                    <Button
                      onClick={clearCompletedTasks}
                      variant="outline"
                      size="sm"
                      className="text-xs border-green-300/50 dark:border-green-600/50 text-green-700 dark:text-green-300 hover:bg-green-200/30 dark:hover:bg-green-900/30 bg-white/20 dark:bg-black/20 backdrop-blur-sm"
                    >
                      Clear All
                    </Button>
                  )}
                </div>

                <Droppable droppableId="done">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[400px] p-4 transition-colors ${
                        snapshot.isDraggingOver ? "bg-green-100/30 dark:bg-green-900/20 backdrop-blur-sm" : ""
                      }`}
                    >
                      {getTasksByColumn("done").map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={snapshot.isDragging ? "rotate-2" : ""}
                            >
                              <TaskCard task={task} onDelete={() => deleteTask(task.id)} onUpdateTask={onUpdateTask} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {doneTasks.length === 0 && (
                        <div className="text-center text-green-600 dark:text-green-400 py-8">
                          <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p className="text-sm font-medium drop-shadow-sm">Completed tasks will appear here</p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            )}
          </div>
        </DragDropContext>
        <div className="mb-6">
          <QuickActions
            tasks={tasks}
            onMoveAll={moveAllToColumn}
            onClearCompleted={clearCompletedTasks}
            onDeleteTask={deleteTask}
          />
        </div>
      </div>
    </div>
  )
}
