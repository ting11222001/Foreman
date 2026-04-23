import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// Define the sape Task interface and Status type
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

// localStorage helpers --> will replace this part with Laravel APIs
const STORAGE_KEY = 'kanban-tasks'

function load(): Task[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') // JSON.parse converts the string back to an array and defaults to an empty array string
  } catch {
    return []
  }
}

function save(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)) // JSON.stringify converts the array to a string so localStorage can store it.
}

// Define the store using Pinia's defineStore function. The first argument is the unique name of the store, and the second is a setup function that returns the state and actions.
// A composable is a function that contains reusable logic using the Composition API.
// Think of it like a helper function you can call inside any component to get shared state or behavior. In Vue, the convention is to name these functions with use at the start, like useTaskStore
export const useTaskStore = defineStore('tasks', () => {
  // ref makes the array reactive. Vue will re-render anything that reads tasks.value when it changes. 
  // load() runs once at startup to restore tasks from localStorage.
  const tasks = ref<Task[]>(load())

  // addTask takes a task without an id, generates one, pushes it to the array, then saves.
  function addTask(task: Omit<Task, 'id'>) {
    tasks.value.push({ ...task, id: crypto.randomUUID() }) // update store
    save(tasks.value)                                      // persist the change                              
  }

  // updateTask takes a task ID and an object containing the updates, finds the task, and updates it.
  function updateTask(id: string, updates: Partial<Omit<Task, 'id'>>) {
    const i = tasks.value.findIndex(t => t.id === id)
    if (i !== -1) {
      tasks.value[i] = { ...tasks.value[i], ...updates } as Task  // update store
      save(tasks.value)                                           // persist the change  
    }
  }

  // deleteTask replaces the array with a filtered version that excludes the target id.
  function deleteTask(id: string) {
    tasks.value = tasks.value.filter(t => t.id !== id)  // update store
    save(tasks.value)                                   // persist the change
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

  return { tasks, addTask, updateTask, deleteTask, moveTask, byStatus  }
})
