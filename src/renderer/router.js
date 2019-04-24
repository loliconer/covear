import Router from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import Preference from './views/preference/Index'
import Basic from './views/preference/Basic'
import Advanced from './views/preference/Advanced'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/',
      name: 'home',
      component: Home,
      children: []
    },
    {
      path: '/preference',
      name: 'preference',
      component: Preference,
      children: [
        {
          path: 'basic',
          component: Basic
        },
        {
          path: 'advanced',
          component: Advanced
        }
      ]
    },
    { path: '/about', name: 'about', component: About }
  ]
})
