<!--This is the main login page allowing the students and the admi to sign in too-->
<template>
  <div class="mx-auto max-w-5xl px-4 py-6">
    <h1 class="mb-2 text-2xl font-semibold md:text-3xl">Login</h1>
    <p class="text-slate-400">Sign in to your account.</p>
<!--This is the main login form for the email and the password authentication-->
    <div class="mt-4 max-w-xl rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <label class="block text-sm font-semibold text-slate-200">Email</label>
      <input
        type="email"
        v-model="email"
        placeholder="name@student.ac.uk"
        class="mt-2 w-full rounded-lg border border-slate-800 bg-transparent px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
      />

      <label class="mt-4 block text-sm font-semibold text-slate-200">Password</label>
      <input
        type="password"
        v-model="password"
        placeholder="Password"
        ref="passwordInput"
        class="mt-2 w-full rounded-lg border border-slate-800 bg-transparent px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
      />
<!--This is the authentication and navigaion actions -->
      <div class="mt-4 flex flex-wrap gap-3">
        <button
          class="inline-flex items-center justify-center rounded-lg border border-indigo-600 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
          @click="login"
        >
          Login
        </button>
        <button
          class="inline-flex items-center justify-center rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:border-indigo-400"
          @click="useAdminLogin"
        >
          Admin login
        </button>
        <router-link
          to="/register"
          class="inline-flex items-center justify-center rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:border-indigo-400"
        >
          Register
        </router-link>
      </div>
<!--This enables the users to ask to reset their password-->
      <button
        class="mt-3 text-sm text-indigo-400 hover:text-indigo-300"
        @click="resetPassword"
      >
        Forgot password?
      </button>

      <div
        v-if="error"
        class="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200"
      >
        {{ error }}
      </div>

      <div
        v-if="success"
        class="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200"
      >
        {{ success }}
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth"
// This line of code is the firebase autentication functions for the login and the password recovery 
export default {
  data() {
    return { email: "", password: "", error: "", success: "" }
  },
  mounted() {
    const msg = sessionStorage.getItem("registerSuccess")
    if (msg) {
      this.success = msg
      sessionStorage.removeItem("registerSuccess")
      setTimeout(() => {
        this.success = ""
      }, 4000)
    }
  },
  methods: {
   async login() {
  this.error = ""
  this.success = ""
  try {
    const auth = getAuth()
    const cred = await signInWithEmailAndPassword(
      auth,
      this.email,
      this.password
    )
    this.$router.push("/dashboard")
  } catch (err) {
    if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
      this.error = "Incorrect password. Please try again."
    } else {
      this.error = err.message
    }
  }
}
,
  useAdminLogin() {
    this.email = "Veerpal123@gmail.ac.uk"
    this.$nextTick(() => {
      this.$refs.passwordInput?.focus()
    })
  },
  async resetPassword() {
    this.error = ""
    if (!this.email) {
      this.error = "Enter your email to reset your password."
      return
    }
    try {
      await sendPasswordResetEmail(getAuth(), this.email)
      this.error = "Password reset email sent. Check your inbox."
    } catch (err) {
      this.error = err.message
    }
  }
  }
}
</script>
<!-- With the async login part of code this authenticats the user and gives them a redirectory to the dashboard-->
 <!--For the async password this gives a password reset while using the firebase authentication-->