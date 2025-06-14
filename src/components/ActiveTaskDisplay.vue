<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue';
import { formatSecondsToHHMMSS } from '../utils/formatTime';

const props = defineProps<{
  taskName: string;
  elapsedSeconds: number;
}>();

const emit = defineEmits(['rename']);

const isEditing = ref(false);
const editableName = ref(props.taskName);
const inputRef = ref<HTMLInputElement | null>(null);

watch(
  () => props.taskName,
  (newName) => {
    if (!isEditing.value) {
      editableName.value = newName;
    }
  }
);

function startEditing() {
  isEditing.value = true;
  editableName.value = props.taskName;
  nextTick(() => {
    inputRef.value?.focus();
  });
}

function confirmEdit() {
  emit('rename', editableName.value.trim() || props.taskName);
  isEditing.value = false;
}

const formattedTime = computed(() => formatSecondsToHHMMSS(props.elapsedSeconds));
</script>

<template>
  <div class="active-task" aria-live="polite">
    <div class="active-task-name">
      <span v-if="!isEditing" @click="startEditing">{{ taskName }}</span>
      <input
        v-else
        ref="inputRef"
        type="text"
        v-model="editableName"
        @keydown.enter.prevent="confirmEdit"
        @blur="confirmEdit"
        class="rename-input"
      />
    </div>
    <div class="timer-display" aria-label="Time elapsed">{{ formattedTime }}</div>
  </div>
</template>

<style scoped>
/* Copy relevant styles from wireframe .active-task, .active-task-name, .timer-display */
.active-task {
    background-color: rgba(124, 77, 255, 0.1);
    padding: var(--spacing-medium);
    border-radius: var(--border-radius);
    margin: var(--spacing-medium);
    border-left: 3px solid var(--color-primary);
}

.active-task-name {
    font-weight: 500;
    color: var(--color-on-surface);
    font-size: 18px;
    margin-bottom: 4px;
    /* Handle long names */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.timer-display {
    /* margin-top: var(--spacing-medium); remove? Already spaced by active-task padding */
    text-align: center;
    font-size: 32px;
    font-weight: 300;
    color: var(--color-on-surface);
    font-variant-numeric: tabular-nums;
    letter-spacing: 2px;
}

.rename-input {
    font-size: 18px;
    font-weight: 500;
    color: var(--color-on-surface);
    background-color: transparent;
    border: 1px solid var(--color-surface-variant);
    border-radius: var(--border-radius);
    padding: 2px 4px;
    width: 100%;
}

.rename-input:focus-visible {
    outline: 3px solid var(--focus-ring-color);
    outline-offset: 2px;
}
</style>