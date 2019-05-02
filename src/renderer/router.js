import Router from 'vue-router'
import Home from './views/Home.vue'
import Preference from './views/preference/Index'
import Basic from './views/preference/Basic'
import Advanced from './views/preference/Advanced'
import Task from './views/task/Index'
import Active from './views/task/Active'
import Stopped from './views/task/Stopped'
import Trash from './views/task/Trash'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/', name: 'home', component: Home,
      children: []
    },
    {
      path: '/preference', name: 'preference', component: Preference,
      children: [
        { path: 'basic', component: Basic },
        { path: 'advanced', component: Advanced }
      ]
    },
    {
      path: '/task', name: 'task', component: Task,
      children: [
        { path: 'active', component: Active },
        { path: 'stopped', component: Stopped },
        { path: 'trash', component: Trash }
      ]
    }
  ]
})
