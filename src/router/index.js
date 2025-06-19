import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Counter from '../views/Counter.vue'
import TodoList from '../views/TodoList.vue'
import UserProfile from '../views/UserProfile.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/counter',
    name: 'Counter',
    component: Counter
  },
  {
    path: '/todos',
    name: 'TodoList',
    component: TodoList
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: UserProfile
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router