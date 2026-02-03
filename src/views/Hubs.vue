<template>
  <div class="mx-auto max-w-5xl px-4 py-6">
    <h1 class="mb-4 text-2xl font-semibold md:text-3xl">Volunteering hubs</h1>
    <p class="mb-3 text-sm text-slate-400">
      Choose a task to enroll and start volunteering.
    </p>
    <p class="mb-4 text-sm text-slate-300">
      There are multiple students that can do one task since there are several patients.
    </p>

    <div
      v-if="loading"
      class="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
    >
      Loading…
    </div>

    <div v-else class="space-y-3">
      <button
        v-if="hasInProgress"
        class="mb-4 inline-flex items-center justify-center rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:border-indigo-400"
        @click="$router.push('/dashboard')"
      >
        Submit evidence on dashboard
      </button>

      <div
        v-for="task in tasks"
        :key="task.id"
        class="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
      >
        <h3 class="text-lg font-semibold">{{ task.title }}</h3>

        <p class="mt-1 text-sm text-slate-400">
          Hub: {{ task.hub }} · Difficulty: {{ task.difficulty }}
        </p>

        <p class="mt-2 text-sm">Points: {{ task.points }}</p>
        <div class="mt-2 inline-flex items-center gap-2 text-xs">
          <span class="text-slate-400">Status:</span>
          <span
            class="rounded-full border px-2 py-0.5 font-semibold"
            :class="statusClass(getAssignment(task.id)?.status || 'Available')"
            :title="statusHelp(getAssignment(task.id)?.status || 'Available')"
          >
            {{ getAssignment(task.id)?.status || "Available" }}
          </span>
        </div>

        
        <button
          v-if="!getAssignment(task.id)"
          class="mt-3 inline-flex items-center justify-center rounded-lg border border-indigo-600 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
          @click="enroll(task.id)"
        >
          Enroll
        </button>

        <div
          v-else-if="getAssignment(task.id)?.status === 'In Progress'"
          class="mt-3 text-sm text-slate-400"
        >
          In progress — submit evidence from your dashboard.
        </div>

        <div
          v-else-if="getAssignment(task.id)?.status === 'Awaiting Approval'"
          class="mt-3 text-sm text-slate-400"
        >
          Submitted for approval.
        </div>

        <div
          v-else-if="getAssignment(task.id)?.status === 'Approved'"
          class="mt-3 text-sm text-emerald-300"
        >
          Approved.
        </div>

      </div>
    </div>

    <div
      v-if="error"
      class="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200"
    >
      {{ error }}
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { db } from "../firebase"
import {
  collection,
  getDocs,
  doc,
  runTransaction,
  query,
  where
} from "firebase/firestore"

const loading = ref(true)
const error = ref("")
const tasks = ref([])
const assignments = ref([])
const hasInProgress = computed(() =>
  assignments.value.some(a => a.status === "In Progress")
)

const auth = getAuth()

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      error.value = "Not logged in"
      loading.value = false
      return
    }

    try {
      const allSnap = await getDocs(collection(db, "tasks"))
      const all = allSnap.docs.map(d => ({ id: d.id, ...d.data() }))

      tasks.value = all

      const assignmentSnap = await getDocs(
        query(collection(db, "assignments"), where("userId", "==", user.uid))
      )
      assignments.value = assignmentSnap.docs.map(d => ({ id: d.id, ...d.data() }))
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  })
})

const enroll = async (taskId) => {
  const user = auth.currentUser
  if (!user) return

  const assignmentId = `${user.uid}_${taskId}`
  const assignmentRef = doc(db, "assignments", assignmentId)

  try {
    await runTransaction(db, async (tx) => {
      const existing = await tx.get(assignmentRef)
      if (existing.exists()) {
        throw new Error("You are already enrolled in this task.")
      }

      tx.set(assignmentRef, {
        taskId,
        userId: user.uid,
        status: "In Progress",
        createdAt: new Date()
      })
    })

    assignments.value.push({
      id: assignmentId,
      taskId,
      userId: user.uid,
      status: "In Progress"
    })
  } catch (e) {
    error.value = e.message || "Unable to enroll in task."
  }
}

const getAssignment = (taskId) =>
  assignments.value.find(a => a.taskId === taskId)

const statusClass = (status) => {
  if (status === "In Progress") return "border-amber-500/40 bg-amber-500/10 text-amber-200"
  if (status === "Awaiting Approval") return "border-orange-500/40 bg-orange-500/10 text-orange-200"
  if (status === "Approved") return "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
  return "border-slate-600/60 bg-slate-800/60 text-slate-200"
}

const statusHelp = (status) => {
  if (status === "In Progress") return "You are working on this task."
  if (status === "Awaiting Approval") return "Submitted; waiting for admin approval."
  if (status === "Approved") return "Approved by admin."
  return "Available to enroll."
}


</script>
