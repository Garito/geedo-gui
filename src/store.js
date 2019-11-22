import Vue from 'vue'
import Vuex from 'vuex'

import { store } from '@/yrest'

Vue.use(Vuex)

// store.state.menus = {
//   Group: {
//     contents: { label: 'Contents', path: '/' },
//     permissions: { label: 'Permissions', path: '/permissions' },
//     roles: { label: 'Roles', path: '/roles' }
//   },
//   Project: {
//     information: { label: 'Information', path: '', icon: 'info' },
//     files: { label: 'Files', path: '/files', icon: [ 'far', 'file' ] },
//     backlog: { label: 'Backlog', path: '/backlog', icon: 'history' },
//     chat: { label: 'Chat', path: '/chat', icon: [ 'far', 'comments' ] },
//     stakeholders: { label: 'Stakeholders', path: '/stakeholders', icon: 'users' }
//   },
//   Record: {
//     information: { label: 'Information', path: '', icon: 'info' },
//     files: { label: 'Files', path: '/files', icon: [ 'far', 'file' ] },
//     backlog: { label: 'Backlog', path: '/backlog', icon: 'history' },
//     chat: { label: 'Chat', path: '/chat', icon: [ 'far', 'comments' ] },
//     stakeholders: { label: 'Stakeholders', path: '/stakeholders', icon: 'users' }
//   }
// }
// store.state.menu = null
// store.mutations.setMenu = (state, menu) => { state.menu = menu }

store.state.myStuff = false
store.mutations.setMyStuff = (state, val) => { state.myStuff = val }

export default new Vuex.Store(store)
