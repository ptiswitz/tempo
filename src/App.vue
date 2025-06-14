<script setup lang="ts">
import { ref, computed, onBeforeUnmount, watch } from 'vue';
import TaskForm from './components/TaskForm.vue';
import ActiveTaskDisplay from './components/ActiveTaskDisplay.vue';
import ActivityList from './components/ActivityList.vue';
import { formatSecondsToHHMMSS } from './utils/formatTime'; // If needed here, else handled in components
import type { CurrentTask, CompletedTask } from './types';

// State
const taskNameInput = ref('');
const currentTask = ref<CurrentTask | null>(null);
const completedTasks = ref<CompletedTask[]>([]);
const timerInterval = ref<number | null>(null);
const screenReaderAnnouncer = ref<HTMLDivElement | null>(null);

// Computed Properties
const isTracking = computed(() => currentTask.value !== null);
const isPaused = computed(() => currentTask.value?.isPaused ?? false);

const totalDurationSeconds = computed(() => {
  return completedTasks.value.reduce((total, task) => total + task.durationSeconds, 0);
});

function updateElapsed() {
  if (currentTask.value && !currentTask.value.isPaused) {
    currentTask.value.elapsedSeconds =
      currentTask.value.accumulatedSeconds +
      Math.floor((Date.now() - currentTask.value.lastResumeTime) / 1000);
  }
}

// Methods
function startTracking(taskName: string) {
  if (isTracking.value) return; // Prevent starting if already tracking

  const newTask: CurrentTask = {
    id: `task-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: taskName,
    startTime: Date.now(),
    lastResumeTime: Date.now(),
    elapsedSeconds: 0,
    accumulatedSeconds: 0,
    isPaused: false,
  };
  currentTask.value = newTask;
  taskNameInput.value = ''; // Clear input after starting

  // Start the timer interval
  timerInterval.value = window.setInterval(updateElapsed, 1000);

  announceToScreenReader(`Started tracking: ${taskName}`);
}

function pauseTracking() {
  if (!isTracking.value || !currentTask.value || currentTask.value.isPaused) return;
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
  updateElapsed();
  currentTask.value.accumulatedSeconds = currentTask.value.elapsedSeconds;
  currentTask.value.isPaused = true;
  announceToScreenReader(`Paused tracking: ${currentTask.value.name}`);
}

function resumeTracking() {
  if (!isTracking.value || !currentTask.value || !currentTask.value.isPaused) return;
  currentTask.value.isPaused = false;
  currentTask.value.lastResumeTime = Date.now();
  timerInterval.value = window.setInterval(updateElapsed, 1000);
  announceToScreenReader(`Resumed tracking: ${currentTask.value.name}`);
}

function stopTracking() {
  if (!isTracking.value || !currentTask.value) return; // Prevent stopping if not tracking

  // Clear interval first
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }

  if (!currentTask.value.isPaused) {
    updateElapsed();
    currentTask.value.accumulatedSeconds = currentTask.value.elapsedSeconds;
  }

  const endTime = Date.now();
  const durationSeconds = currentTask.value.elapsedSeconds;

  const finishedTask: CompletedTask = {
    id: currentTask.value.id,
    name: currentTask.value.name,
    startTime: currentTask.value.startTime,
    endTime: endTime,
    durationSeconds: durationSeconds,
  };

  // Add to the beginning of the list
  completedTasks.value.unshift(finishedTask);
  const stoppedTaskName = currentTask.value.name; // Store name before clearing
  currentTask.value = null; // Stop tracking

  announceToScreenReader(`Stopped tracking: ${stoppedTaskName}. Duration: ${formatSecondsToHHMMSS(durationSeconds)}`);
}

// Screen reader announcements
function announceToScreenReader(message: string) {
    if (screenReaderAnnouncer.value) {
        // Set content to empty first to ensure announcement even if same message
        screenReaderAnnouncer.value.textContent = '';
        // Small delay helps ensure it's picked up
        setTimeout(() => {
            if(screenReaderAnnouncer.value) { // Check again as component might unmount
                 screenReaderAnnouncer.value.textContent = message;
            }
        }, 50);
    }
}

// Lifecycle Hook
onBeforeUnmount(() => {
  // Ensure timer is cleared if component is destroyed while tracking
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
});

// Optional: Persist data to localStorage (Simple Example)
const STORAGE_KEY = 'tempo-time-tracker-tasks';

// Load tasks on component mount
try {
    const storedTasks = localStorage.getItem(STORAGE_KEY);
    if (storedTasks) {
        completedTasks.value = JSON.parse(storedTasks);
    }
} catch(e) {
    console.error("Failed to load tasks from localStorage", e);
}


// Watch for changes in completed tasks and save
watch(completedTasks, (newTasks) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
    } catch (e) {
        console.error("Failed to save tasks to localStorage", e);
    }

}, { deep: true }); // Use deep watch for changes within the array/objects


</script>

<template>
  <div class="container" role="application" aria-label="Tempo Time Tracker">
    <div class="app-card">
      <header class="app-header">
        <!-- SVG Logo from wireframe -->
        <div class="brand">
            <svg width="36" height="36" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" class="logo" aria-hidden="true" focusable="false">
                <defs>
                    <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#7c4dff" />
                    <stop offset="100%" stop-color="#536dfe" />
                    </linearGradient>
                    <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
                <circle cx="150" cy="150" r="120" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="4" />
                <path d="M150,30 A120,120 0 0,1 270,150" fill="none" stroke="url(#accentGradient)" stroke-width="8" stroke-linecap="round" filter="url(#softGlow)" />
                <line x1="150" y1="150" x2="150" y2="60" stroke="white" stroke-width="3" stroke-linecap="round" />
                <line x1="150" y1="150" x2="210" y2="190" stroke="white" stroke-width="4" stroke-linecap="round" />
                <circle cx="150" cy="150" r="10" fill="url(#accentGradient)" filter="url(#softGlow)" />
                <circle cx="150" cy="150" r="5" fill="white" />
            </svg>
            <h1 class="app-title">Tempo</h1>
        </div>
      </header>

      <main>
        <TaskForm
          v-model:taskName="taskNameInput"
          :is-tracking="isTracking"
          :is-paused="isPaused"
          @start="startTracking"
          @stop="stopTracking"
          @pause="pauseTracking"
          @resume="resumeTracking"
        />

        <ActiveTaskDisplay
          v-if="isTracking && currentTask"
          :task-name="currentTask.name"
          :elapsed-seconds="currentTask.elapsedSeconds"
        />

        <ActivityList
          :tasks="completedTasks"
          :total-duration-seconds="totalDurationSeconds"
        />
      </main>
    </div>

     <!-- Screen Reader Announcer -->
     <div ref="screenReaderAnnouncer" class="sr-only" aria-live="assertive"></div>
  </div>
</template>

<style scoped>
/* Copy relevant styles for .app-card, .app-header, .brand, .logo, .app-title from wireframe */
/* Ensure .container styles are in main.css or here if not global */

/* Styles specific to App.vue layout */
.app-card {
    background-color: var(--color-surface);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 50px rgba(124, 77, 255, 0.1);
    overflow: hidden;
    border: 1px solid var(--color-surface-variant);
}

.app-header {
    padding: var(--spacing-large);
    display: flex;
    align-items: center;
    justify-content: center; /* Center brand */
    border-bottom: 1px solid var(--color-surface-variant);
}

.brand {
    display: flex;
    align-items: center;
    justify-content: center;
}

.logo {
    margin-right: var(--spacing-medium);
}

.app-title {
    margin: 0;
    font-size: 24px;
    font-weight: 500;
    color: var(--color-on-surface);
}

main {
    padding: 0; /* Remove padding if sections have their own */
}

/* Screen reader only style - place in main.css or keep here */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}

/* High contrast mode adjustments */
@media (forced-colors: active) {
    .app-card {
        border: 1px solid CanvasText;
        background-color: Canvas;
    }
    .app-header {
         border-bottom-color: CanvasText;
    }
    .app-title {
        color: CanvasText;
    }
    /* Adjust SVG colors if needed for high contrast */
    .logo path, .logo line, .logo circle[fill="none"] {
        stroke: CanvasText;
    }
    .logo circle:not([fill="none"]) {
        fill: CanvasText;
    }
     .logo circle[fill="white"] {
        fill: Canvas; /* Make inner dot background color */
    }
}
</style>