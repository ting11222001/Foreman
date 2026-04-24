<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Task, Status } from '../stores/tasks'
import * as yup from 'yup'

const props = defineProps<{
  open: boolean
  task?: Task | null
}>()

const emit = defineEmits<{
  save: [data: Omit<Task, 'id'> & { id?: string }]
  close: []
}>()

const title = ref('')
const description = ref('')
const priority = ref<Task['priority']>('medium')
const status = ref<Status>('todo')
const titleError = ref('')

/**
 * This is a watcher. It runs code when props.open changes.
 * Watch a prop by wrapping it in an arrow function. When props.open changes, the second function runs. val is the new value.
 */
watch(() => props.open, (val) => {
  /**
   * Every time the modal opens, this resets the form to show the current task's data or blank defaults
   * Only do something when props.open becomes true. This means: "the modal just opened."
   */
  if (val) {
    title.value = props.task?.title ?? ''
    description.value = props.task?.description ?? ''
    priority.value = props.task?.priority ?? 'medium'
    status.value = props.task?.status ?? 'todo'
    titleError.value = ''
  }
})

// Yup schema for validation (can be expanded for more complex validation rules)
const schema = yup.object({
  title: yup.string().required('Task name is required'),
})

/**
 * Marking a function async does two things. It lets you use await inside it. It also makes the function itself return a Promise.
 * await pauses the function until the Promise finishes.
 */
async function validate(): Promise<boolean> {
  // console.log('Validating!')
  try {
    /**
     * Give me an object to check, optionally some settings, and I will either give you back the cleaned object (success) or throw an error (failure).
     */
    await schema.validate({ title: title.value.trim() })
    
    // if we get here, validation passed
    titleError.value = ''
    return true
  } catch (err) {
    if (err instanceof yup.ValidationError) { // When Yup validation fails, it does not return false. It throws a ValidationError
      titleError.value = err.message
    }
    return false
  }
}

async function submit() {
  if (!(await validate())) return

  // once validated, emit the save event to App.vue > @save="handleSave"
  emit('save', {
    id: props.task?.id,
    title: title.value.trim(),
    description: description.value.trim(),
    priority: priority.value,
    status: status.value,
  })
}

/**
 * e.target is the element you actually clicked. 
 * The check classList.contains('overlay') asks: did you click the overlay itself, not something inside it?
 */
function onOverlayClick(e: MouseEvent) {
  if ((e.target as HTMLElement).classList.contains('overlay')) emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="overlay" @click="onOverlayClick" data-testid="modal">
      <div class="modal" role="dialog" aria-modal="true" aria-label="Task form">
        <div class="modal-header">
          <span class="modal-title">{{ task ? 'Edit task' : 'New task' }}</span>
          <button class="close-btn" @click="emit('close')" aria-label="Close">✕</button>
        </div>

        <div class="field">
          <label class="label" for="task-title">Task name <span class="required">*</span></label>
          <input
            id="task-title"
            v-model="title"
            class="input"
            :class="{ error: titleError }"
            placeholder="What needs to be done?"
            @input="titleError = ''"
            data-testid="input-title"
            autofocus
          />
          <span v-if="titleError" class="error-msg" data-testid="title-error">{{ titleError }}</span>
        </div>

        <div class="field">
          <label class="label" for="task-desc">Description</label>
          <textarea
            id="task-desc"
            v-model="description"
            class="input textarea"
            placeholder="Optional details..."
            rows="3"
          />
        </div>

        <div class="row">
          <div class="field">
            <label class="label" for="task-priority">Priority</label>
            <select id="task-priority" v-model="priority" class="input select">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div class="field">
            <label class="label" for="task-status">Column</label>
            <select id="task-status" v-model="status" class="input select">
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        <div class="actions">
          <button class="btn-secondary" @click="emit('close')">Cancel</button>
          <button class="btn-primary" @click="submit" data-testid="btn-save">
            {{ task ? 'Save changes' : 'Add task' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(2px);
}
.modal {
  background: var(--modal-bg);
  border: 1px solid var(--col-border);
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 420px;
  margin: 16px;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.modal-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}
.close-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 14px;
  padding: 4px 6px;
  border-radius: 6px;
  transition: color 0.1s, background 0.1s;
}
.close-btn:hover { color: var(--text-primary); background: var(--card-bg); }

.field { margin-bottom: 16px; flex: 1; }
.label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 6px;
  letter-spacing: 0.03em;
}
.required { color: #f56565; }
.input {
  width: 100%;
  background: var(--input-bg);
  border: 1px solid var(--col-border);
  border-radius: 8px;
  padding: 9px 12px;
  color: var(--text-primary);
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s;
  box-sizing: border-box;
}
.input:focus { border-color: var(--accent); }
.input.error { border-color: #f56565; }
.textarea { resize: vertical; min-height: 70px; }
.select { cursor: pointer; }

.error-msg {
  font-size: 12px;
  color: #f56565;
  margin-top: 4px;
  display: block;
}

.row {
  display: flex;
  gap: 12px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
}
.btn-secondary {
  background: none;
  border: 1px solid var(--col-border);
  border-radius: 8px;
  color: var(--text-secondary);
  padding: 8px 18px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.1s, color 0.1s;
}
.btn-secondary:hover { background: var(--card-bg); color: var(--text-primary); }
.btn-primary {
  background: var(--accent);
  border: none;
  border-radius: 8px;
  color: #fff;
  padding: 8px 18px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}
.btn-primary:hover { opacity: 0.85; }
</style>
