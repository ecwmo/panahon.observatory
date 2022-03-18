import { createWebHistory, createRouter } from 'vue-router'
import Home from '@/views/Home.vue'
// import Acknowledgements from "@/views/Acknowledgements.vue";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  // {
  //   path: "/acknowledgements",
  //   name: "Acknowledgements",
  //   component: Acknowledgements,
  // },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
