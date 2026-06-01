import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import('../views/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/trainingplans',
      name: 'trainingplans',
      component: () => import('../views/TrainingPlansView.vue'),
    },
  ],
})

// Controleer voor elke route of gebruiker is ingelogd
router.beforeEach(async (to) => {

  // Login pagina mag altijd bezocht worden
  if (to.meta.public) {
    return true
  }

  try {
    const response = await fetch("http://localhost:8080/users/me", {
      credentials: "include",
    })

    if (response.ok) {
      return true
    }

    return "/login"
  } catch {
    return "/login"
  }
})

export default router
