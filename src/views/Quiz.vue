<template>
  <div class="mx-auto max-w-5xl px-4 py-6">
    <h1 class="mb-2 text-2xl font-semibold md:text-3xl">Glaucoma Awareness Quiz</h1>
    <p class="text-slate-400">
      Complete this quiz to unlock volunteering tasks.
    </p>

    <div class="mt-4 space-y-3">
      <div v-for="(q, i) in questions" :key="i" class="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <p class="font-semibold">Q{{ i + 1 }}. {{ q.text }}</p>

        <div v-for="(opt, j) in q.options" :key="j" class="mt-2">
          <label class="flex items-center gap-2 text-sm text-slate-200">
            <input
              type="radio"
              :name="'q' + i"
              :value="j"
              v-model.number="answers[i]"
              class="h-4 w-4 accent-indigo-500"
            />
            {{ opt }}
          </label>
        </div>

        <div
          v-if="showErrors && answers[i] === null"
          class="mt-3 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200"
        >
          Select an answer to continue.
        </div>
      </div>
    </div>

    <button
      class="mt-4 inline-flex items-center justify-center rounded-lg border border-indigo-600 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
      @click="submit"
    >
      Submit quiz
    </button>

    <div
      v-if="resultReady"
      class="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200"
    >
      <p class="font-semibold">Your score: {{ score }}%</p>
      <p class="mt-1 text-sm">{{ bandText }}</p>
      <button
        class="mt-3 inline-flex items-center justify-center rounded-lg border border-emerald-500/40 bg-emerald-500/20 px-3 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/30"
        @click="$router.push('/hubs')"
      >
        Go to hubs
      </button>
      <button
        class="mt-3 inline-flex items-center justify-center rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:border-indigo-400"
        @click="$router.push('/dashboard')"
      >
        Back to dashboard
      </button>
    </div>

    <div
      v-if="serverError"
      class="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200"
    >
      {{ serverError }}
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue"
import { getAuth } from "firebase/auth"
import { db } from "../firebase"
import { doc, updateDoc } from "firebase/firestore"

export default {
  setup() {
    const questions = ref([
      {
        text: "Glaucoma mainly affects which part of the eye?",
        options: ["Cornea", "Optic nerve", "Lens", "Retina"],
        correct: 1
      },
      {
        text: "Glaucoma can develop without early symptoms.",
        options: ["True", "False"],
        correct: 0
      },
      {
        text: "What helps early detection?",
        options: ["Regular eye tests", "Drinking water", "Avoiding screens", "Only sunglasses"],
        correct: 0
      },
      {
        text: "Which group has a higher risk of glaucoma?",
        options: ["People with family history", "Teenagers", "People with perfect vision", "People who wear hats"],
        correct: 0
      },
      {
        text: "Which symptom is most commonly linked to glaucoma?",
        options: ["Slow loss of peripheral vision", "Sudden fever", "Back pain", "Ear infection"],
        correct: 0
      },
      {
        text: "How often should adults generally get eye tests for early detection?",
        options: ["Regular eye tests as advised by an optometrist", "Only when vision feels blurry", "Once in childhood only", "Never"],
        correct: 0
      },
      {
        text: "Glaucoma-related vision loss is typically:",
        options: ["Irreversible but can be slowed", "Always temporary", "Easily cured with glasses", "Only present at night"],
        correct: 0
      },
      {
        text: "Which of the following is a common method to manage glaucoma?",
        options: ["Prescription eye drops", "Aspirin for headaches", "Antibiotics only", "No treatment exists"],
        correct: 0
      }
    ])

    const answers = ref(Array(questions.value.length).fill(null))
    const showErrors = ref(false)
    const resultReady = ref(false)
    const serverError = ref("")
    const score = ref(0)

    const bandText = computed(() => {
      if (score.value <= 50) return "Easy tasks unlocked (Hospital)"
      if (score.value <= 80) return "Easy and medium tasks unlocked (Old Age Homes)"
      return "All tasks unlocked (Community Centres)"
    })

    const submit = async () => {
      showErrors.value = true
      serverError.value = ""

      if (answers.value.includes(null)) return

      let correct = 0
      answers.value.forEach((a, i) => {
        if (a === questions.value[i].correct) correct++
      })

      score.value = Math.round((correct / questions.value.length) * 100)

      try {
        const user = getAuth().currentUser
        if (!user) throw new Error("Not logged in")

        await updateDoc(doc(db, "users", user.uid), {
          quizScore: score.value
        })

        resultReady.value = true
      } catch (err) {
        serverError.value = err.message
      }
    }

    return {
      questions,
      answers,
      showErrors,
      resultReady,
      score,
      bandText,
      submit,
      serverError
    }
  }
}
</script>
