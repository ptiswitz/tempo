<script setup lang="ts">
import { computed } from 'vue';
import { formatSecondsToHHMMSS } from '../utils/formatTime';

const props = defineProps<{
  taskName: string;
  elapsedSeconds: number;
}>();

const formattedTime = computed(() => formatSecondsToHHMMSS(props.elapsedSeconds));
</script>

<template>
  <div class="active-task" aria-live="polite">
    <div class="active-task-name">{{ taskName }}</div>
    <div class="timer-display" aria-label="Time elapsed">{{ formattedTime }}</div>
  </div>
</template>

<style scoped>
/* Copy relevant styles from wireframe .active-task, .active-task-name, .timer-display */
.active-task {
    background-color: rgba(124, 77, 255, 0.1);
    padding: var(--spacing-medium);
    border-radius: var(--border-radius);
    margin-top: var(--spacing-medium);
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
</style>