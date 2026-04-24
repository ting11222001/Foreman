import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// Define the shape of Task interface and Status type
// This is a union type. It means Status can only ever be one of those three strings.
export type Status = 'todo' | 'inprogress' | 'done'

// interface defines the shape of an object. 
export interface Task {
  id: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  status: Status
}

// Base URL for all API calls — points to your Laravel backend
const API_BASE = 'http://localhost:8000/api/tasks'

// Define the store using Pinia's defineStore function. The first argument is the unique name of the store, and the second is a setup function that returns the state and actions.
// A composable is a function that contains reusable logic using the Composition API.
// Think of it like a helper function you can call inside any component to get shared state or behavior. In Vue, the convention is to name these functions with use at the start, like useTaskStore
export const useTaskStore = defineStore('tasks', () => {
  // ref makes the array reactive. Vue will re-render anything that reads tasks.value when it changes. 
  // tasks start empty. fetchTasks() will populate it from the API
  const tasks = ref<Task[]>([])

  // --- FETCH: GET /api/tasks ---
  // Loads all tasks from the API and stores them in tasks.value
  async function fetchTasks() {
    const res = await fetch(API_BASE)
    tasks.value = await res.json()
  }

  // --- ADD: POST /api/tasks ---
  // Sends the new task to the API, then adds the returned task (with its real ID) to the store
  async function addTask(task: Omit<Task, 'id'>) {
    const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      })
      const created: Task = await res.json()
      tasks.value.push(created)                          
  }

  // --- UPDATE: PUT /api/tasks/{id} ---
  // Sends only the changed fields to the API, then updates the matching task in the store
  async function updateTask(id: string, updates: Partial<Omit<Task, 'id'>>) {
    // Update the store to make UI feel instant
    const i = tasks.value.findIndex(t => t.id === id)
    if (i !== -1) {
      tasks.value[i] = { ...tasks.value[i], ...updates } as Task
    }

    // Then send the API request
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    const updated: Task = await res.json()

    // Apply the API response to the store in case the backend made any adjustments (e.g. updated_at timestamp)
    if (i !== -1) tasks.value[i] = updated
  }

  // --- DELETE: DELETE /api/tasks/{id} ---
  // Tells the API to delete the task, then removes it from the store
  async function deleteTask(id: string) {
    await fetch(`${API_BASE}/${id}`, { method: 'DELETE' })
    tasks.value = tasks.value.filter(t => t.id !== id)
  }

  function moveTask(id: string, status: Status) {
    updateTask(id, { status: status })
  }

  // byStatus was a plain function, not a computed. This means it does not cache. Every time a component calls byStatus('todo'), it filters the full array again.
  // function byStatus(status: Status) {
  //   console.log('byStatus!') 
  //   return tasks.value.filter(t => t.status === status)
  // }

  // byStatus is now Creating a computed property and it returns a plain object (the map). Vue will run this function once, cache the result, and only re-run it when tasks.value changes
  const byStatus = computed(() => {
    // console.log('byStatus!')

    // map is an object where every key is a Status and every value is an array of Tasks with that status
    const map: Record<Status, Task[]> = {
      todo: [],
      inprogress: [],
      done: [],
    }
    for (const task of tasks.value) {
      map[task.status].push(task)
    }

    // after this loop, map.todo holds all todo tasks, map.inprogress holds all in-progress tasks, and so on.
    return map
  })

  return { tasks, addTask, updateTask, deleteTask, moveTask, byStatus, fetchTasks  }
})
