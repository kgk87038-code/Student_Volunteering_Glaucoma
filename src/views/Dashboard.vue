<template>
  <div class="mx-auto max-w-5xl px-4 py-6">
    <h1 class="mb-4 text-2xl font-semibold md:text-3xl">Dashboard</h1>

    <div
      v-if="loading"
      class="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
    >
      Loading…
    </div>

    <div v-else class="space-y-4">
      <section class="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold"
              :class="avatarClass"
            >
              {{ initials }}
            </div>
            <div>
              <p class="text-lg font-semibold">{{ firstName }} {{ lastName }}</p>
              <p class="text-sm text-slate-400">Track tasks and hours.</p>
              <p class="mt-2 text-sm text-slate-300">
                After completing the quiz, return here and click “Go to hubs” to enroll in tasks and be assigned to a hub.
              </p>
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <button
              v-if="isAdmin"
              class="inline-flex items-center justify-center rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:border-indigo-400"
              @click="$router.push('/admin')"
            >
              Admin approvals
            </button>
            <button
              v-if="!isAdmin"
              class="inline-flex items-center justify-center rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:border-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="!canDownloadCertificate"
              @click="downloadCertificate"
            >
              Download certificate
            </button>
            <p v-if="!isAdmin && !canDownloadCertificate" class="text-sm text-slate-400">
              Certificate unlocks after all tasks are approved by an admin.
            </p>
            <button
              v-if="!isAdmin"
              class="inline-flex items-center justify-center rounded-lg border border-indigo-600 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
              @click="$router.push('/hubs')"
            >
              Go to hubs
            </button>
            <button
              v-if="!isAdmin"
              class="inline-flex items-center justify-center rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:border-indigo-400"
              @click="$router.push('/quiz')"
            >
              Quiz
            </button>
            <button
              class="inline-flex items-center justify-center rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:border-indigo-400"
              @click="logout"
            >
              Logout
            </button>
          </div>
        </div>

        <div class="my-4 h-px w-full bg-slate-800"></div>

        <div v-if="isAdmin" class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <p class="text-sm text-slate-400">Pending approvals</p>
            <p class="mt-1 text-xl font-semibold">{{ pendingApprovals }}</p>
            <p class="mt-2 text-sm text-slate-400">
              Review submissions in Admin approvals.
            </p>
          </div>
          <div class="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <p class="text-sm text-slate-400">Admin actions</p>
            <p class="mt-2 text-sm text-slate-300">
              Use the Admin approvals button above to approve tasks.
            </p>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <p class="text-sm text-slate-400">Points</p>
            <p class="mt-1 text-xl font-semibold">{{ points }}</p>
          </div>

          <div class="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <p class="text-sm text-slate-400">Approved hours</p>
            <p class="mt-1 text-xl font-semibold">{{ totalHoursApproved }}</p>
          </div>
        </div>
      </section>

      <section v-if="!isAdmin" class="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 class="text-lg font-semibold">Your tasks</h2>

        <div
          v-if="assignments.length === 0"
          class="mt-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-300"
        >
          No tasks assigned yet.
        </div>

        <div v-else class="mt-3 space-y-3">
          <div v-for="item in assignmentItems" :key="item.assignmentId" class="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <p class="font-semibold">{{ item.title }}</p>
            <p class="mt-1 text-sm text-slate-400">{{ item.hub }} · {{ item.difficulty }}</p>
            <div class="mt-2 inline-flex items-center gap-2 text-xs">
              <span class="text-slate-400">Status:</span>
              <span
                class="rounded-full border px-2 py-0.5 font-semibold"
                :class="statusClass(item.status)"
                :title="statusHelp(item.status)"
              >
                {{ item.status }}
              </span>
            </div>

            <div v-if="item.status === 'In Progress'" class="mt-3 space-y-2">
              <label class="block text-sm font-semibold text-slate-200">Evidence description (include time and date)</label>
              <textarea
                v-model="evidenceText[item.assignmentId]"
                rows="3"
                class="w-full rounded-lg border border-slate-800 bg-transparent px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
              ></textarea>

              <button
                class="inline-flex items-center justify-center rounded-lg border border-indigo-600 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="submittingEvidence[item.assignmentId]"
                @click="submitEvidence(item)"
              >
                {{ submittingEvidence[item.assignmentId] ? "Submitting..." : "Submit evidence" }}
              </button>
            </div>
          </div>

          <div class="mt-4">
            <div class="h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                class="h-full rounded-full bg-indigo-500 transition-all"
                :style="{ width: progressPercent + '%' }"
              ></div>
            </div>

            <div class="mt-2 text-sm text-slate-400">
              {{ approvedCount }} of {{ assignments.length }} tasks approved ({{ progressPercent }}%)
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import jsPDF from "jspdf"
import { ref, onMounted, onUnmounted, computed } from "vue"
import { useRouter } from "vue-router"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { db } from "../firebase"
import {
  doc,
  collection,
  query,
  where,
  onSnapshot,
  runTransaction,
  serverTimestamp
} from "firebase/firestore"

const downloadCertificate = () => {
  const pdf = new jsPDF()

  pdf.setFontSize(18)
  pdf.text("Volunteering Certificate", 20, 20)

  pdf.setFontSize(12)
  pdf.text(`Student: ${firstName.value} ${lastName.value}`, 20, 40)
  pdf.text(`Approved hours: ${totalHoursApproved.value}`, 20, 50)
  pdf.text(`Points: ${points.value}`, 20, 60)

  pdf.text("This certifies successful participation in", 20, 80)
  pdf.text("Glaucoma awareness volunteering activities.", 20, 90)

  pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 120)

  pdf.save("volunteering-certificate.pdf")
}
// This line of code stores all of the students profiles and all of the progress data for the dashboard
const loading = ref(true)
const firstName = ref("")
const lastName = ref("")
const points = ref(0)
const totalHoursApproved = ref(0)
const role = ref("")
const assignments = ref([])
const taskMap = ref(new Map())
const pendingApprovals = ref(0)
const router = useRouter()
const evidenceText = ref({})
const submittingEvidence = ref({})

const approvedCount = computed(() =>
  assignments.value.filter(a => a.status === "Approved").length
)

const initials = computed(() => {
  const first = (firstName.value || "").trim()
  const last = (lastName.value || "").trim()
  const a = first ? first[0].toUpperCase() : ""
  const b = last ? last[0].toUpperCase() : ""
  return (a + b) || "?"
})

const avatarClass = computed(() => {
  const key = `${firstName.value || ""}${lastName.value || ""}`.trim()
  let hash = 0
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) % 997
  }
  const palettes = [
    "border-indigo-500/40 bg-indigo-500/15 text-indigo-100",
    "border-emerald-500/40 bg-emerald-500/15 text-emerald-100",
    "border-amber-500/40 bg-amber-500/15 text-amber-100",
    "border-sky-500/40 bg-sky-500/15 text-sky-100",
    "border-rose-500/40 bg-rose-500/15 text-rose-100"
  ]
  const index = key ? hash % palettes.length : 0
  return palettes[index]
})
// This specifically determines the view of the dashbaord based on the user role 
const isAdmin = computed(() => role.value === "admin")
// This is where the calculation happens of the task completion progress based on the tasks that have been approved
const progressPercent = computed(() => {
  if (!assignments.value.length) return 0
  return Math.round((approvedCount.value / assignments.value.length) * 100)
})
// This makes the download accessible only when the tasks are approved
const canDownloadCertificate = computed(() =>
  assignments.value.length > 0 && assignments.value.every(a => a.status === "Approved")
)

const assignmentItems = computed(() =>
  assignments.value.map(a => {
    const task = taskMap.value.get(a.taskId) || {}
    return {
      assignmentId: a.id,
      taskId: a.taskId,
      status: a.status,
      title: task.title || "Untitled task",
      hub: task.hub || "Unknown hub",
      difficulty: task.difficulty || "Unknown",
      hours: task.hours ?? 0,
      points: task.points ?? 0
    }
  })
)

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

let unsubscribeUser = null
let unsubscribeAssignments = null
let unsubscribeTasks = null
let unsubscribePending = null
// This subscribes to updates that are real time for the user data tasks and assignments 
const subscribe = (uid) => {
  unsubscribeUser?.()
  unsubscribeAssignments?.()
  unsubscribeTasks?.()

  unsubscribeUser = onSnapshot(doc(db, "users", uid), (snap) => {
    const u = snap.data() || {}
    firstName.value = u.firstName || ""
    lastName.value = u.lastName || ""
    role.value = u.role || ""
    points.value = u.points || 0
    totalHoursApproved.value =
      u.totalHoursApproved ??
      u.approvedHours ??
      u.approved_hours ??
      u["Approved Hours"] ??
      0
    if (role.value === "admin") {
      unsubscribePending?.()
      unsubscribePending = onSnapshot(
        query(collection(db, "assignments"), where("status", "==", "Awaiting Approval")),
        (snap) => {
          pendingApprovals.value = snap.docs.length
        }
      )
    } else {
      unsubscribePending?.()
      pendingApprovals.value = 0
    }
  })
// The admin gets the real time updates for the approvals that are pending 
  unsubscribeAssignments = onSnapshot(
    query(collection(db, "assignments"), where("userId", "==", uid)),
    (snap) => {
      assignments.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    }
  )

  unsubscribeTasks = onSnapshot(collection(db, "tasks"), (snap) => {
    const map = new Map()
    snap.docs.forEach(d => map.set(d.id, d.data()))
    taskMap.value = map
  })
}

const logout = async () => {
  await signOut(getAuth())
  window.location.href = "/"
}
// Manages the evidence submission and gives an update on the task status 
const submitEvidence = async (task) => {
  const user = getAuth().currentUser
  if (!user) return

  const text = (evidenceText.value[task.assignmentId] || "").trim()

  if (!text) {
    alert("Please add a short description of the evidence (include time and date).")
    return
  }

  submittingEvidence.value[task.assignmentId] = true

  try {
    const assignmentRef = doc(db, "assignments", task.assignmentId)
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(assignmentRef)
      if (!snap.exists()) throw new Error("Task no longer exists.")
      const data = snap.data()
      if (data.userId !== user.uid) {
        throw new Error("You can only submit evidence for your own tasks.")
      }
      if (data.status !== "In Progress") {
        throw new Error("Task is not in progress.")
      }
// This part of the code uses a transaction to update the status and task evidence 
      tx.update(assignmentRef, {
        evidenceText: text,
        evidenceSubmittedAt: serverTimestamp(),
        status: "Awaiting Approval"
      })
    })
  } catch (e) {
    alert(e.message || "Unable to submit evidence.")
  } finally {
    submittingEvidence.value[task.assignmentId] = false
  }
}

onMounted(() => {
  onAuthStateChanged(getAuth(), async (user) => {
    if (!user) {
      loading.value = false
      router.push("/login")
      return
    }
    subscribe(user.uid)
    loading.value = false
  })
})
// This redirects the users that arent authenticated and configues the dashboard data 
onUnmounted(() => {
  unsubscribeUser?.()
  unsubscribeAssignments?.()
  unsubscribeTasks?.()
  unsubscribePending?.()
})
</script>
