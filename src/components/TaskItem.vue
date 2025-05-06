<script setup lang="ts">
import { computed } from 'vue';
import { formatSecondsToHHMMSS } from '../utils/formatTime';
import type { CompletedTask } from '../types'; // We'll define this type

const props = defineProps<{
  task: CompletedTask;
}>();

const formattedTime = computed(() => formatSecondsToHHMMSS(props.task.durationSeconds));
const timeLabel = computed(() => {
    const parts = formattedTime.value.split(':');
    return `${parseInt(parts[0], 10)} hours, ${parseInt(parts[1], 10)} minutes, ${parseInt(parts[2], 10)} seconds`;
});
</script>

<template>
  <div class="task-item" role="listitem">
    <div class="task-name">{{ task.name }}</div>
    <div class="task-time" :aria-label="timeLabel">{{ formattedTime }}</div>
  </div>
</template>

<style scoped>
/* Copy relevant styles from wireframe .task-item, .task-name, .task-time */
.task-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-small) var(--spacing-medium);
    background-color: rgba(255, 255, 255, 0.03);
    border-radius: var(--border-radius);
    margin-bottom: var(--spacing-small);
    transition: all 0.2s ease;
}

.task-item:hover {
    background-color: rgba(255, 255, 255, 0.05);
}

.task-name {
    color: var(--color-on-background);
    font-weight: 400;
    /* Limit width and allow wrap/ellipsis if needed */
    max-width: 70%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.task-time {
    color: #e0e0e0; /* Use improved contrast color */
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
}

/* Focus state if task items become interactive later */
/* .task-item:focus-within {
    outline: 2px solid var(--focus-ring-color);
    outline-offset: 1px;
} */
</style>