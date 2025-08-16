/**
 * @typedef {Object} Subtask
 * @property {string} id
 * @property {string} title
 * @property {boolean} completed
 * @property {Date} createdAt
 * @property {Date} [completedAt]
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {number} estimatedTime - in minutes
 * @property {number} timerDuration - in minutes - custom timer duration for blitz mode
 * @property {string} [scheduledTime] - optional scheduled time like "7:00pm"
 * @property {"low" | "medium" | "high" | "urgent"} priority
 * @property {"today" | "thisWeek" | "backlog" | "done"} column
 * @property {number} order
 * @property {Date} createdAt
 * @property {Date} [completedAt]
 * @property {Subtask[]} subtasks
 */

/**
 * @typedef {"today" | "thisWeek" | "backlog" | "done"} Column
 */

// Export empty object to make this a module
export {}
