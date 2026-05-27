import { useAuthStores } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import LandingView from '@/views/LandingView.vue'
import LoginView from '@/views/Auth/LoginView.vue'
import RegisterView from '@/views/Auth/RegitsterView.vue'
import ProfileDetailsView from '../views/ProfileDetailsView.vue'
import MyProfileView from '../views/ProfileView.vue'
import MessagePanelView from '@/views/MessagePanelView.vue'
import PrivacySecurityView from '@/views/PrivacySecurityView.vue'

const publicRoutes = ['landing', 'login', 'register', 'forget-password', 'verify-otp', 'reset-password']

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing', 
      component: LandingView,
      meta: { title: 'Landing' },
    },
    {
      path: '/home',
      name: 'home', 
      component: HomeView,
      meta: { requiresAuth: true, title: 'Home' }, 
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: true, title: 'About' }, 
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { title: 'Login' },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { title: 'Register' },
    },
    {
      path: '/forget-password',
      name: 'forget-password',
      component: () => import('@/views/Auth/Forgetpw.vue'),
      meta: { title: 'Forget Password' },
    },
    {
      path: '/verify-otp',
      name: 'verify-otp',
      component: () => import('@/views/Auth/VerifyOtp.vue'),
      meta: { title: 'Verify OTP' },
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/views/Auth/ResetPassword.vue'),
      meta: { title: 'Reset Password' },
    },
    {
      path: '/landing', 
      name: 'landing-alias',
      component: LandingView,
        meta: { title: 'Landing' },
    },
    {
      path: '/profileDetail',
      name: 'profileDetail',
      component: ProfileDetailsView,
      meta: { requiresAuth: true, title: 'Profile Detail' },
    },
    {
      path: '/profile/:id',
      name: 'profileById',
      component: () => import('@/views/ProfileDetailsView.vue'),
      meta: { requiresAuth: true, title: 'Profile' },
    },
    {
      path: '/profile',
      name: 'profile',
      component: MyProfileView,
      meta: { requiresAuth: true, title: 'My Profile' },
    },
    {
      path: '/editProfile',
      name: 'editProfile',
      component: () => import('@/views/Editprofileinfoview.vue'),
      meta: { requiresAuth: true, title: 'Edit Profile' },
    },
    {
      path: '/editEducation',
      name: 'editEducation',
      component: () => import('@/views/Editeducationview.vue'),
      meta: { requiresAuth: true, title: 'Edit Education' },
    },
    {
      path: '/editProject',
      name: 'editProject',
      component: () => import('@/views/Editprojectview.vue'),
      meta: { requiresAuth: true, title: 'Edit Project' },
    },
    {
      path: '/settings',
      
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
      meta: { requiresAuth: true, title: 'Settings' },
    },
    {
      path: '/create-post',
      name: 'CreatePost',
      component: () => import('@/views/CreatePostView.vue'),
      meta: { requiresAuth: true, title: 'Create Post' },
    },
    {
      path: '/messages',
      name: 'messages',
      component: MessagePanelView,
      meta: { requiresAuth: true, title: 'Messages' },
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: PrivacySecurityView,
      meta: { requiresAuth: true, title: 'Privacy & Security' },
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('../views/HelpView.vue'),
      meta: { title: 'Help' },
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('../views/FaqView.vue'),
      meta: { title: 'FAQ' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/ForbiddenView.vue'),
      meta: { title: '404 Not Found' },
    },
  ],
})


router.beforeEach((to) => {
  const auth = useAuthStores()

  const baseTitle = 'Connexion'
  document.title = to.meta.title ? `${to.meta.title} - ${baseTitle}` : baseTitle
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'login' }
  }
  if (auth.isLoggedIn && publicRoutes.includes(to.name)) {
    return { name: 'home' }
  }

  return true
})

export default router