import { createRouter, createWebHistory } from "vue-router"

import Home from "../views/Home.vue"
import Login from "../views/Login.vue"
import Register from "../views/Register.vue"
import Dashboard from "../views/Dashboard.vue"
import Hubs from "../views/Hubs.vue"
import Quiz from "../views/Quiz.vue"
import Admin from "../views/Admin.vue"

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/dashboard", component: Dashboard },
  { path: "/hubs", component: Hubs },
  { path: "/quiz", component: Quiz },
  { path: "/admin", component: Admin }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router