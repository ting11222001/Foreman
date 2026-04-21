<script setup lang="ts">
import { ref } from 'vue'
import BoardColumn from './components/BoardColumn.vue'
import TaskModal from './components/TaskModal.vue'
import { useTaskStore } from './stores/tasks'
import type { Task, Status } from './stores/tasks'

const store = useTaskStore()

const modalOpen = ref(false)
const editingTask = ref<Task | null>(null)

const columns: { title: string; status: Status }[] = [
  { title: 'To Do',       status: 'todo' },
  { title: 'In Progress', status: 'inprogress' },
  { title: 'Done',        status: 'done' },
]

function openNew() {
  editingTask.value = null
  modalOpen.value = true
}

function openEdit(task: Task) {
  editingTask.value = task
  modalOpen.value = true
}

function handleSave(data: Omit<Task, 'id'> & { id?: string }) {
  if (data.id) {
    store.updateTask(data.id, {
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: data.status,
    })
  } else {
    store.addTask({
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: data.status,
    })
  }
  modalOpen.value = false
}
</script>

<template>
  <div class="app">
    <header class="header">
      <div class="header-inner">
        <div>
          <h1 class="app-title">Task Board</h1>
          <p class="app-sub">{{ store.tasks.length }} task{{ store.tasks.length === 1 ? '' : 's' }}</p>
        </div>
        <button class="btn-add" @click="openNew" data-testid="btn-add-task">
          + New task
        </button>
      </div>
    </header>

    <main class="board">
      <BoardColumn
        v-for="col in columns"
        :key="col.status"
        :title="col.title"
        :status="col.status"
        :tasks="store.byStatus(col.status)"
        @editTask="openEdit"
        @deleteTask="store.deleteTask"
        @dropTask="store.moveTask"
      />
    </main>

    <TaskModal
      :open="modalOpen"
      :task="editingTask"
      @save="handleSave"
      @close="modalOpen = false"
    />
  </div>
</template>

<style>
/* Dark mode design tokens */
:root {
  --bg:         #0f1117;
  --col-bg:     #161b27;
  --col-border: #272e40;
  --col-drag-bg:#1a2238;
  --card-bg:    #1c2233;
  --card-border:#272e40;
  --modal-bg:   #161b27;
  --input-bg:   #0f1117;
  --accent:     #4f8ef7;
  --text-primary:   #e8eaf0;
  --text-secondary: #8b92a8;
  --text-muted:     #555e78;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: var(--bg);
  color: var(--text-primary);
  font-family: 'DM Sans', system-ui, sans-serif;
  min-height: 100vh;
}

.app { min-height: 100vh; display: flex; flex-direction: column; }

.header {
  border-bottom: 1px solid var(--col-border);
  padding: 20px 28px;
}
.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
}
.app-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}
.app-sub {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 2px;
}
.btn-add {
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 9px 18px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}
.btn-add:hover { opacity: 0.85; }

.board {
  display: flex;
  gap: 16px;
  padding: 24px 28px;
  flex: 1;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
  align-items: flex-start;
}

@media (max-width: 640px) {
  .board { flex-direction: column; padding: 16px; }
}
</style>
