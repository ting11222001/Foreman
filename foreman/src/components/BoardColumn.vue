<!-- setup means you are using the Composition API. lang="ts" means TypeScript is on.-->
<script setup lang="ts">
import TaskCard from './TaskCard.vue'
import type { Task, Status } from '../stores/tasks' // Task and Status are TypeScript types from your store
import { ref } from 'vue'

// Props are values passed in from the parent (App.vue). BoardColumn expects three things: a title string, a status like 'todo', and an array of tasks.
const props = defineProps<{
  title: string
  status: Status
  tasks: Task[]
}>()

// Emits are events this component sends up to the parent. Think of it like calling back to App.vue and saying "hey, something happened."
// defineEmits is like a contract. You are saying: "this component can send these events to its parent, with these argument types."
// Means: when I emit dropTask, I must pass a string and a Status.
const emit = defineEmits<{
  editTask: [task: Task]                        // editTask tells the parent to open the edit modal for a task. editTask: [task: Task] means when this component emits the editTask event, it must pass one argument, and that argument must be of type Task.
  deleteTask: [id: string]                      // deleteTask tells the parent to delete a task by its ID.
  dropTask: [taskId: string, status: Status]    // dropTask tells the parent to move a task to a new status.
}>()

const isDragOver = ref(false)     // when isDragOver = true, it visually highlights the column

// These three handlers come from the browser's drag-and-drop API. The browser event names are dragover, dragleave, and drop.
// You can read about it here: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API

// onDragOver fires repeatedly while you hold a card over the column. 
// The e.preventDefault() is a browser rule: by default, most elements reject drops. 
// Calling preventDefault() tells the browser "this column accepts drops." Without it, onDrop never runs. 
function onDragOver(e: DragEvent) {
  // console.log('dragging over', props.status)
  e.preventDefault()
  isDragOver.value = true
}

// onDragLeave fires when you drag the card back out without dropping. It just turns off the highlight.
function onDragLeave() {
  // console.log('dragging leave', props.status)
  isDragOver.value = false
}

// onDrop fires when you release the card. 
// You drag a card and the browser stores the task ID in dataTransfer (set during dragstart)
// You release the card over the "Done" column
// The browser fires drop on that column's element
// onDrop runs, reads the ID, and emits dropTask with the ID and "done"
// The parent updates the task's status to "done"
function onDrop(e: DragEvent) {
  isDragOver.value = false

  const id = e.dataTransfer?.getData('taskId')
  // console.log(`Dropped task ${id} into ${props.status}`)
  if (id) emit('dropTask', id, props.status)
}
</script>

<template>
  <!-- :class="{ 'drag-over': isDragOver }" adds the CSS class drag-over when isDragOver is true -->
  <!-- data-testid attribute is added for cypress tests e.g. [data-testid="column-done"] -->
  <div
    class="column"
    :class="{ 'drag-over': isDragOver }"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
    :data-testid="`column-${status}`"
  >
    <!-- Column header -->
    <div class="col-header">
      <span class="col-title">{{ title }}</span>
      <span class="col-count">{{ tasks.length }}</span>
    </div>

    <!-- Rendering the cards -->
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
