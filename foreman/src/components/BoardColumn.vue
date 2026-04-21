<script setup lang="ts">
import TaskCard from './TaskCard.vue'
import type { Task, Status } from '../stores/tasks'
import { ref } from 'vue'

const props = defineProps<{
  title: string
  status: Status
  tasks: Task[]
}>()

const emit = defineEmits<{
  editTask: [task: Task]
  deleteTask: [id: string]
  dropTask: [taskId: string, status: Status]
}>()

const isDragOver = ref(false)

function onDragOver(e: DragEvent) {
  e.preventDefault()
  isDragOver.value = true
}

function onDragLeave() {
  isDragOver.value = false
}

function onDrop(e: DragEvent) {
  isDragOver.value = false
  const id = e.dataTransfer?.getData('taskId')
  if (id) emit('dropTask', id, props.status)
}
</script>

<template>
  <div
    class="column"
    :class="{ 'drag-over': isDragOver }"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
    :data-testid="`column-${status}`"
  >
    <div class="col-header">
      <span class="col-title">{{ title }}</span>
      <span class="col-count">{{ tasks.length }}</span>
    </div>

    <div class="cards-area">
      <div
        v-for="task in tasks"
        :key="task.id"
        draggable="true"
        @dragstart="(e) => e.dataTransfer?.setData('taskId', task.id)"
      >
        <TaskCard
          :task="task"
          @edit="emit('editTask', $event)"
          @delete="emit('deleteTask', $event)"
        />
      </div>

      <div v-if="tasks.length === 0" class="empty">
        Drop tasks here
      </div>
    </div>
  </div>
</template>

<style scoped>
.column {
  background: var(--col-bg);
  border: 1px solid var(--col-border);
  border-radius: 14px;
  padding: 16px;
  flex: 1;
  min-width: 0;
  transition: border-color 0.15s, background 0.15s;
}
.column.drag-over {
  border-color: var(--accent);
  background: var(--col-drag-bg);
}
.col-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.col-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.col-count {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 99px;
  padding: 1px 9px;
}
.cards-area {
  min-height: 60px;
}
.empty {
  font-size: 12px;
  color: var(--text-muted);
  text-align: center;
  padding: 20px 0;
  border: 1px dashed var(--col-border);
  border-radius: 8px;
}
</style>
