<script setup lang="ts">
import { ref, computed } from 'vue';

const taskName = defineModel<string>('taskName', { default: '' });
const props = defineProps<{ isTracking: boolean; isPaused: boolean }>();
const emit = defineEmits(['start', 'stop', 'pause', 'resume']);

const inputRef = ref<HTMLInputElement | null>(null); // To focus input after stop

const buttonText = computed(() => props.isTracking ? 'Stop Tracking' : 'Start Tracking');
const buttonClass = computed(() => props.isTracking ? 'action-button tracking' : 'action-button');
const pauseButtonText = computed(() => props.isPaused ? 'Resume' : 'Pause');

function handleSubmit() {
  // Prevent form submission if used inside a <form> tag
}

function handleTrackButtonClick() {
  if (props.isTracking) {
    emit('stop');
    // Focus input after stopping for quick entry of next task
    inputRef.value?.focus();
  } else {
    // Use 'Unnamed Task' if input is empty, trim whitespace
    const nameToTrack = taskName.value.trim() || 'Unnamed Task';
    emit('start', nameToTrack);
  }
}

function handlePauseButtonClick() {
  if (props.isPaused) {
    emit('resume');
  } else {
    emit('pause');
  }
}

function handleKeydown(event: KeyboardEvent) {
    // Allow Ctrl+Enter or Alt+Enter to start/stop tracking
    if (event.key === 'Enter' && (event.ctrlKey || event.altKey)) {
        handleTrackButtonClick();
        event.preventDefault(); // Prevent newline in input if any
    }
}
</script>

<template>
  <section class="task-form" aria-labelledby="tracking-section-title">
    <h2 id="tracking-section-title" class="sr-only">Task Tracking</h2>

    <!-- Although we handle button click, using form helps semantic structure -->
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="taskName" class="form-label sr-only">Task Name</label>
        <input
          ref="inputRef"
          type="text"
          id="taskName"
          class="task-input"
          placeholder="What are you working on?"
          aria-label="Enter the task name"
          v-model="taskName"
          :disabled="isTracking"
          autocomplete="off"
          @keydown="handleKeydown"
        />
      </div>

      <button
        type="button"
        id="trackButton"
        :class="buttonClass"
        :aria-pressed="isTracking"
        @click="handleTrackButtonClick"
      >
        {{ buttonText }}
      </button>
      <button
        v-if="isTracking"
        type="button"
        id="pauseButton"
        class="pause-button"
        :aria-pressed="isPaused"
        @click="handlePauseButtonClick"
      >
        {{ pauseButtonText }}
      </button>
    </form>
  </section>
</template>

<style scoped>
/* Copy relevant styles from wireframe .task-form, .form-group, .form-label, .task-input, .action-button */
.task-form {
    padding: var(--spacing-large);
    border-bottom: 1px solid var(--color-surface-variant);
}

.form-group {
    margin-bottom: var(--spacing-medium);
}

.form-label { /* Keep sr-only styles in main.css */
    display: block;
    margin-bottom: var(--spacing-small);
    font-weight: 500;
    color: var(--color-on-background);
}

.task-input {
    width: 100%;
    background-color: rgba(20, 20, 20, 0.7);
    border: 1px solid var(--color-surface-variant);
    border-radius: var(--border-radius);
    padding: var(--spacing-medium);
    font-size: 16px;
    color: var(--color-on-surface);
    outline: none;
    transition: border-color 0.3s ease, box-shadow 0.3s ease; /* Optimized transition */
}

.task-input:disabled {
    background-color: rgba(40, 40, 40, 0.5);
    cursor: not-allowed;
    opacity: 0.7;
}


.task-input:focus {
    border-color: var(--focus-ring-color);
    box-shadow: 0 0 0 2px rgba(124, 77, 255, 0.2);
}

/* Using :focus-visible for better accessibility */
.task-input:focus-visible {
    outline: 3px solid var(--focus-ring-color);
    outline-offset: 1px;
    box-shadow: none; /* Remove inner glow when outline is present */
    border-color: transparent; /* Hide default border */
}


.action-button {
    width: 100%;
    margin-top: var(--spacing-medium);
    background: linear-gradient(45deg, var(--color-primary), var(--color-primary-variant));
    color: var(--color-on-primary);
    border: none;
    border-radius: var(--border-radius);
    padding: var(--spacing-medium);
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.action-button:hover:not(:disabled) { /* Only apply hover when not disabled */
    transform: translateY(-2px);
    box-shadow: 0 7px 14px rgba(0, 0, 0, 0.3), 0 3px 6px rgba(0, 0, 0, 0.2);
}

.action-button:active:not(:disabled) {
    transform: translateY(0);
}

.action-button:focus-visible {
    outline: 3px solid var(--focus-ring-color);
    outline-offset: 2px;
}

.action-button.tracking {
    background: linear-gradient(45deg, var(--color-error), #ff1744);
}

.pause-button {
    width: 100%;
    margin-top: var(--spacing-small);
    background-color: var(--color-surface-variant);
    color: var(--color-on-surface);
    border: none;
    border-radius: var(--border-radius);
    padding: var(--spacing-medium);
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.pause-button:hover:not(:disabled) {
    background-color: var(--color-surface-variant-hover, #444);
}

/* High contrast mode adjustments */
@media (forced-colors: active) {
    .action-button {
        border: 1px solid CanvasText;
        background: ButtonFace;
        color: ButtonText;
        forced-color-adjust: auto;
    }
    .action-button.tracking {
        background: Highlight;
        color: HighlightText;
    }
     .task-input {
        border: 1px solid CanvasText;
        background-color: Canvas;
        color: CanvasText;
    }
    .task-input:disabled {
        background-color: GrayText;
        border-color: GrayText;
        color: Canvas;
    }
}
</style>