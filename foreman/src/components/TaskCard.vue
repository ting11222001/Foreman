<script setup lang="ts">
import type { Task } from '../stores/tasks'

defineProps<{ task: Task }>()
const emit = defineEmits<{
  edit: [task: Task]
  delete: [id: string]
}>()

const priorityLabel: Record<Task['priority'], string> = {
  low: 'Low',
  medium: 'Med',
  high: 'High',
}
</script>

<template>
  <div class="card" @click="emit('edit', task)">
    <div class="card-top">
      <span class="priority" :class="task.priority">{{ priorityLabel[task.priority] }}</span>
      <button
        class="delete-btn"
        @click.stop="emit('delete', task.id)"
        aria-label="Delete task"
      >✕</button>
    </div>
    <p class="title">{{ task.title }}</p>
    <p v-if="task.description" class="desc">{{ task.description }}</p>
  </div>
</template>

<style scoped>
.card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 10px;
  padding: 14px;
  cursor: pointer;
  transition: border-color 0.15s, transform 0.1s;
  margin-bottom: 10px;
}
.card:hover {
  border-color: var(--accent);
  transform: translateY(-1px);
}
.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.priority {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 99px;
  letter-spacing: 0.04em;
}
.priority.low    { background: #1a2e1a; color: #6ee76e; }
.priority.medium { background: #2e2510; color: #f5c542; }
.priority.high   { background: #2e1212; color: #f56565; }

.delete-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 12px;
  padding: 2px 4px;
  border-radius: 4px;
  line-height: 1;
  transition: color 0.1s, background 0.1s;
}
.delete-btn:hover {
  color: #f56565;
  background: #2e1212;
}
.title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0 0 4px;
  line-height: 1.4;
}
.desc {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
