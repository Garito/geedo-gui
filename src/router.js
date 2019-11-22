import Vue from 'vue'
import Router from 'vue-router'

import { getViews, beforeEach } from './yrest'
import store from './store'

Vue.use(Router)

const router = new Router({
  routes: [ { path: '*', name: 'dispatcher', component: () => import('./views/dispatcher') } ],
  linkExactActiveClass: 'is-active'
})
const req = require.context('./models/', true, /\.(vue)$/i)
router.beforeEach(beforeEach(store, getViews(req)))

export default router
