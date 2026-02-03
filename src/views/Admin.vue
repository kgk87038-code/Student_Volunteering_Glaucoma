<!--hiiiiiiiiiii-->
<template>
  <div class="mx-auto max-w-5xl px-4 py-6">
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-2xl font-semibold md:text-3xl">Admin approvals</h1>
      <div class="flex flex-wrap gap-2">
        <button
          class="inline-flex items-center justify-center rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:border-indigo-400"
          @click="$router.push('/dashboard')"
        >
          Back to dashboard
        </button>
        <button
          class="inline-flex items-center justify-center rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:border-indigo-400"
          @click="logout"
        >
          Logout
        </button>
      </div>
    </div>

    <div
      v-if="loading"
      class="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
    >
      Loading…
    </div>

    <div v-else class="space-y-3">
      <div
        v-if="requests.length === 0"
        class="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300"
      >
        No pending requests.
      </div>

      <div
        v-for="r in requests"
        :key="r.assignmentId"
        class="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
      >
        <p class="text-lg font-semibold">{{ r.title }}</p>
        <p class="mt-1 text-sm text-slate-400">Student: {{ r.userId }}</p>
        <p class="mt-2 text-sm">Status: {{ r.status }}</p>
        <p class="text-sm">Points: {{ r.points }}</p>
        <p class="text-sm">Hours: {{ r.hours }}</p>
        <p v-if="r.evidenceText" class="mt-2 text-sm text-slate-300">
          Evidence: {{ r.evidenceText }}
        </p>
        <a
          v-if="r.evidenceUrl"
          :href="r.evidenceUrl"
          target="_blank"
          rel="noreferrer"
          class="mt-1 inline-flex text-sm text-indigo-400 hover:text-indigo-300"
        >
          View evidence photo
        </a>

        <button
          class="mt-3 inline-flex items-center justify-center rounded-lg border border-indigo-600 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
          @click="approve(r)"
        >
          Approve
        </button>
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
import { ref, onMounted } from "vue"
import { db } from "../firebase"
import { getAuth, signOut } from "firebase/auth"
import {
  collection,
  getDocs,
  doc,
  runTransaction,
  increment,
  query,
  where
} from "firebase/firestore"

const loading = ref(true)
const requests = ref([])
const error = ref("")

onMounted(async () => {
  const [tasksSnap, assignmentsSnap] = await Promise.all([
    getDocs(collection(db, "tasks")),
    getDocs(query(collection(db, "assignments"), where("status", "==", "Awaiting Approval")))
  ])

  const taskMap = new Map()
  tasksSnap.docs.forEach(d => taskMap.set(d.id, d.data()))

  requests.value = assignmentsSnap.docs.map(d => {
    const data = d.data()
    const task = taskMap.get(data.taskId) || {}
    return {
      assignmentId: d.id,
      ...data,
      title: task.title || "Untitled task",
      hub: task.hub || "Unknown hub",
      difficulty: task.difficulty || "Unknown",
      hours: task.hours ?? 0,
      points: task.points ?? 0
    }
  })

  loading.value = false
})

const approve = async (r) => {
  const assignmentRef = doc(db, "assignments", r.assignmentId)

  error.value = ""

  try {
    await runTransaction(db, async (tx) => {
      const assignmentSnap = await tx.get(assignmentRef)
      if (!assignmentSnap.exists()) throw new Error("Assignment no longer exists.")

      const data = assignmentSnap.data()
      if (data.status !== "Awaiting Approval") {
        throw new Error("Assignment is no longer awaiting approval.")
      }
      if (!data.userId) {
        throw new Error("Assignment has no user.")
      }

      const userRef = doc(db, "users", data.userId)
      tx.update(assignmentRef, { status: "Approved" })
      tx.update(userRef, {
        totalHoursApproved: increment(Number(r.hours ?? 0)),
        points: increment(Number(r.points ?? 0))
      })
    })

    
    requests.value = requests.value.filter(x => x.assignmentId !== r.assignmentId)
  } catch (e) {
    error.value = e.message || "Unable to approve task."
  }
}

const logout = async () => {
  await signOut(getAuth())
  window.location.href = "/login"
}
</script>
