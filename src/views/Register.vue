<template>
  <div class="mx-auto max-w-5xl px-4 py-6">
    <h1 class="mb-2 text-2xl font-semibold md:text-3xl">Student Registration</h1>

    <p class="text-slate-400">
      Please note, we can only accept applications from those over 18 years old.
    </p>

    <div class="mt-4 max-w-xl space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <label class="block text-sm font-semibold text-slate-200">First name</label>
      <input
        v-model="firstName"
        type="text"
        class="w-full rounded-lg border border-slate-800 bg-transparent px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
      />

      <label class="block text-sm font-semibold text-slate-200">Last name</label>
      <input
        v-model="lastName"
        type="text"
        class="w-full rounded-lg border border-slate-800 bg-transparent px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
      />

      <label class="block text-sm font-semibold text-slate-200">Email</label>
      <input
        v-model="email"
        type="email"
        class="w-full rounded-lg border border-slate-800 bg-transparent px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
      />

      <label class="block text-sm font-semibold text-slate-200">Confirm email</label>
      <input
        v-model="confirmEmail"
        type="email"
        class="w-full rounded-lg border border-slate-800 bg-transparent px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
      />

      <label class="block text-sm font-semibold text-slate-200">Date of birth</label>
      <input
        v-model="dob"
        type="date"
        class="w-full rounded-lg border border-slate-800 bg-transparent px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
      />

      <label class="block text-sm font-semibold text-slate-200">Password (min 6 characters, 1 special)</label>
      <input
        v-model="password"
        type="password"
        class="w-full rounded-lg border border-slate-800 bg-transparent px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
      />

      <div
        v-if="error"
        class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200"
      >
        {{ error }}
      </div>

      <div
        v-if="success"
        class="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200"
      >
        {{ success }}
      </div>

      <button
        class="inline-flex items-center justify-center rounded-lg border border-indigo-600 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
        @click="register"
      >
        Create account
      </button>

      <p class="text-sm text-slate-400">
        Already have an account?
        <router-link to="/login">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from "vue"
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth"
import { db } from "../firebase"
import { doc, setDoc } from "firebase/firestore"

export default {
  setup() {
    const firstName = ref("")
    const lastName = ref("")
    const email = ref("")
    const confirmEmail = ref("")
    const dob = ref("")
    const password = ref("")
    const error = ref("")
    const success = ref("")

    const register = async () => {
      error.value = ""
      success.value = ""

      if (!firstName.value || !lastName.value) {
        error.value = "Please enter your first and last name."
        return
      }

      if (email.value !== confirmEmail.value) {
        error.value = "Email addresses do not match."
        return
      }

      if (!dob.value) {
        error.value = "Please enter your date of birth."
        return
      }

      const today = new Date()
      const birthDate = new Date(dob.value)
      const age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      const dayDiff = today.getDate() - birthDate.getDate()
      const isUnder18 =
        age < 18 || (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))

      if (isUnder18) {
        error.value = "You must be at least 18 years old to register."
        return
      }

      if (password.value.length < 6) {
        error.value = "Password must be at least 6 characters."
        return
      }

      if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password.value)) {
        error.value = "Password must include at least one special character."
        return
      }

      try {
        const auth = getAuth()
        const cred = await createUserWithEmailAndPassword(
          auth,
          email.value,
          password.value
        )

        await setDoc(doc(db, "users", cred.user.uid), {
          firstName: firstName.value,
          lastName: lastName.value,
          dob: dob.value,
          role: "student",
          points: 0,
          quizScore: 0,
          totalHoursApproved: 0
        })

        await sendEmailVerification(cred.user)
        await signOut(getAuth())
        sessionStorage.setItem(
          "registerSuccess",
          "Registered successfully. Redirecting to the login page..."
        )
        setTimeout(() => {
          window.location.href = "/login"
        }, 1500)
      } catch (err) {
        error.value = err.message
      }
    }

    return {
      firstName,
      lastName,
      email,
      confirmEmail,
      dob,
      password,
      success,
      error,
      register
    }
  }
}
</script>
