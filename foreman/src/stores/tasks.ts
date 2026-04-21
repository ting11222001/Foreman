import { defineStore } from 'pinia'
import { ref } from 'vue'

export type Status = 'todo' | 'inprogress' | 'done'

export interface Task {
  id: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  status: Status
}

const STORAGE_KEY = 'kanban-tasks'

function load(): Task[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function save(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>(load())

  function addTask(task: Omit<Task, 'id'>) {
    tasks.value.push({ ...task, id: crypto.randomUUID() })
    save(tasks.value)
  }

  function updateTask(id: string, updates: Partial<Omit<Task, 'id'>>) {
    const i = tasks.value.findIndex(t => t.id === id)
    if (i !== -1) {
      tasks.value[i] = { ...tasks.value[i], ...updates } as Task
      save(tasks.value)
    }
  }

  function deleteTask(id: string) {
    tasks.value = tasks.value.filter(t => t.id !== id)
    save(tasks.value)
  }

  function moveTask(id: string, status: Status) {
    updateTask(id, { status })
  }

  function byStatus(status: Status) {
    return tasks.value.filter(t => t.status === status)
  }

  return { tasks, addTask, updateTask, deleteTask, moveTask, byStatus }
})
