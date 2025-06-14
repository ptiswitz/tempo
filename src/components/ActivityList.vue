<script setup lang="ts">
import { computed } from 'vue';
import TaskItem from './TaskItem.vue';
import { formatSecondsToHHMMSS } from '../utils/formatTime';
import type { CompletedTask } from '../types';

const props = defineProps<{
  tasks: CompletedTask[];
  totalDurationSeconds: number;
}>();

const emit = defineEmits(['clear']);

const formattedTotalTime = computed(() => formatSecondsToHHMMSS(props.totalDurationSeconds));

const totalTimeLabel = computed(() => {
    const parts = formattedTotalTime.value.split(':');
    return `Total time: ${parseInt(parts[0], 10)} hours, ${parseInt(parts[1], 10)} minutes, ${parseInt(parts[2], 10)} seconds`;
});
</script>

<template>
  <section class="activity-section" aria-labelledby="activity-section-title">
    <h2 id="activity-section-title" class="section-title">Today's Activity</h2>

    <div class="activity-list" role="list" tabindex="0" aria-label="List of completed tasks">
      <p v-if="tasks.length === 0">No activity recorded yet today.</p>
      <TaskItem
        v-for="task in tasks"
        :key="task.id"
        :task="task"
      />
    </div>

    <div class="total-time" aria-live="polite">
      <div>Total</div>
      <div :aria-label="totalTimeLabel">{{ formattedTotalTime }}</div>
    </div>

    <a
      href="#"
      class="clear-link"
      v-if="tasks.length > 0"
      @click.prevent="emit('clear')"
    >Clear Activity</a>
  </section>
</template>

<style scoped>
/* Copy relevant styles from wireframe .activity-section, .section-title, .activity-list, .total-time */
.activity-section {
    padding: var(--spacing-large);
}

.activity-list {
    max-height: 300px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
    padding: var(--spacing-small); /* For scrollbar */
    margin-bottom: var(--spacing-medium); /* Space before total */
}

/* Add focus style for the scrollable list itself */
.activity-list:focus {
    outline: 2px solid var(--focus-ring-color);
    outline-offset: 2px;
    border-radius: 4px; /* Optional: makes focus outline look nicer */
}

.activity-list p {
    color: #bdbdbd;
    text-align: center;
    padding: var(--spacing-medium) 0;
}


.section-title {
    margin-top: 0;
    margin-bottom: var(--spacing-medium);
    font-size: 18px;
    font-weight: 500;
    color: var(--color-on-surface);
}

.total-time {
    margin-top: var(--spacing-medium);
    padding-top: var(--spacing-medium);
    border-top: 1px solid var(--color-surface-variant);
    display: flex;
    justify-content: space-between;
    color: var(--color-on-surface);
    font-weight: 500;
    font-variant-numeric: tabular-nums;
}

.clear-link {
    margin-top: var(--spacing-small);
    display: inline-block;
    color: var(--color-primary);
    cursor: pointer;
    text-decoration: underline;
}

.clear-link:hover {
    text-decoration: none;
}

.clear-link:focus-visible {
    outline: 2px solid var(--focus-ring-color);
    outline-offset: 2px;
    border-radius: 4px;
}
</style>