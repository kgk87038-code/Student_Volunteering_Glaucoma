<!--Top of the admin.vue page-->
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
// This controls all of the laoding, and the admin errors and the pending approvals 
const loading = ref(true)
const requests = ref([])
const error = ref("")
// This line of code fetches all of the tasks and assignments and waits for the approval from the admin 
onMounted(async () => {
  const [tasksSnap, assignmentsSnap] = await Promise.all([
    getDocs(collection(db, "tasks")),
    getDocs(query(collection(db, "assignments"), where("status", "==", "Awaiting Approval")))
  ])
// This specifically maps all of the task specfic details to assignments for the display 
  const taskMap = new Map()
  tasksSnap.docs.forEach(d => taskMap.set(d.id, d.data()))
// This prepares the assignment data for a review by the admin and conlcudes the data preparation 
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
// Here this handles all of the approvals done by the admin of a task that has been submitted by the student 
const approve = async (r) => {
  const assignmentRef = doc(db, "assignments", r.assignmentId)

  error.value = ""
// This uses a transaction in order to keep the updates of the task approval and the user updates in sync and the two happen together 
  try {
    await runTransaction(db, async (tx) => {
      const assignmentSnap = await tx.get(assignmentRef)
      if (!assignmentSnap.exists()) throw new Error("Assignment no longer exists.")
// This line of code makes sure that the task is still existing and is awaiting approval 
      const data = assignmentSnap.data()
      if (data.status !== "Awaiting Approval") {
        throw new Error("Assignment is no longer awaiting approval.")
      }
      if (!data.userId) {
        throw new Error("Assignment has no user.")
      }
// This makes sure that the assignment is set with a user that is valid and set and marks the task as being approved with the update assignment ref 
      const userRef = doc(db, "users", data.userId)
      tx.update(assignmentRef, { status: "Approved" })
      tx.update(userRef, {
        totalHoursApproved: increment(Number(r.hours ?? 0)),
        points: increment(Number(r.points ?? 0))
      })
    })
// This is where the update happens of the hours that are approved and points for the student 
    
    requests.value = requests.value.filter(x => x.assignmentId !== r.assignmentId)
  } catch (e) {
    error.value = e.message || "Unable to approve task."
  }
}
// This line of code takes of the task that has been approved from the admin list and below is the logout function and this logs out the admin and stops and complete the session 
const logout = async () => {
  await signOut(getAuth())
  window.location.href = "/login"
}
</script>
