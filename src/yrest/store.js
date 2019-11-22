import Vue from 'vue'
import Vuex from 'vuex'
import { url as getUrl } from './plugin'

Vue.use(Vuex)

function getRef (ref, components) {
  ref = ref.split('/').slice(2)
  for (var seg of ref) {
    components = components[seg]
  }
  return components
}

function getRoles (roles, ctx) {
  let result = []
  for (var role of roles) {
    if (!role.includes('@') || !ctx) {
      result.push(role)
    } else {
      let parts = role.split('@')
      let theRole = parts.shift()
      let url = parts.join('@')
      if (ctx.startsWith(url)) {
        result.push(theRole)
      }
    }
  }

  return result
}

const store = {
  state: {
    openApi: null,
    token: null,
    perms: null,
    roles: null,
    users: null,
    user: null,
    context: null,
    errors: null,
    socket: { isConnected: false, messages: [], reconnectError: false, users: [], actor: null }
  },
  mutations: {
    setOpenApi: (state, openApi) => { state.openApi = openApi },
    setToken: (state, token) => { state.token = token },
    setPermissions: (state, perms) => { state.perms = perms },
    setRoles: (state, roles) => { state.roles = roles },
    setUsers: (state, users) => { state.users = users },
    setUser: (state, user) => { state.user = user },
    setContext: (state, ctx) => { state.context = ctx },
    set2Context: (state, payload) => { Vue.set(state.context, payload.name, payload.data) },
    setErrors: (state, errors) => { state.errors = errors },
    SOCKET_ONOPEN (state, event) {
      Vue.prototype.$socket = event.currentTarget
      state.socket.isConnected = true
    },
    SOCKET_ONCLOSE (state, event) {
      state.socket.actor = null
      state.socket.isConnected = false
      state.socket.messages = []
      state.socket.users = []
      console.log('connection closed')
    },
    SOCKET_ONERROR (state, event) {
      console.error(state, event)
    },
    // default handler called for all methods
    SOCKET_ONMESSAGE (state, message) {
      if (message.connected) {
        state.socket.users.push(message.connected)
      } else if (message.disconnected) {
        state.socket.users.pop(state.socket.users.indexOf(message.disconnected))
      } else if (message.users) {
        state.socket.users = message.users
        let users = Object.values(state.users)
        state.socket.messages = message.messages.map(m => ({ message: m.message, room: m.path, user: users.find(u => u.email === m.user).slug }))
      } else {
        state.socket.messages.push(message)
      }
    },
    // mutations for reconnect methods
    SOCKET_RECONNECT (state, count) {
      console.info(state.socket, count)
    },
    SOCKET_RECONNECT_ERROR (state) {
      console.log(arguments)
      state.socket.reconnectError = true
    }
  },
  getters: {
    actor: state => {
      if (state.token) {
        let base64Url = state.token.split('.')[1]
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        let payload = JSON.parse(decodeURIComponent(atob(base64).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join('')))
        return Object.values(state.users).find(u => u._id === payload.user_id)
      }

      return null
    },
    owner: state => obj => {
      let role = 'owner@' + getUrl(obj)
      return Object.values(state.users).find(u => u.roles.includes(role))
    },
    op: state => opId => {
      for (var [pName, path] of Object.entries(state.openApi.paths)) {
        for (var [vName, verb] of Object.entries(path)) {
          if (verb.operationId === opId) {
            let result = {}
            result[pName] = {}
            result[pName][vName] = verb
            return result
          }
        }
      }
    },
    schema: (state, getters) => opId => {
      let op = getters.op(opId)
      if (op) {
        op = Object.values(Object.values(op)[0])[0]
      }
      return getRef(op.requestBody.content['application/json'].schema.$ref, state.openApi.components)
    },
    can: (state, getters) => (perm, ctx = null) => {
      if (perm.startsWith('Root/')) {
        perm = state.openApi.components['x-root'] + '/' + perm.split('/').pop()
      }

      let permObj = state.perms[perm]
      if (permObj) {
        let actor = getters.actor
        let roles = permObj.roles
        if (roles.length) {
          return actor ? getRoles(actor.roles, ctx).some(r => roles.includes(r)) : false
        } else {
          return true
        }
      } else {
        return false
      }
    }
  },
  actions: {
    fetch (context, payload) {
      let opts = {
        headers: new Headers({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
      }
      if (context.state.token) {
        opts.headers.append('Authorization', 'Bearer ' + context.state.token)
      }
      if (payload.data) {
        opts.method = payload.method || 'POST'
        opts.body = JSON.stringify(payload.data)
      } else {
        if (payload.method) {
          opts.method = payload.method
        }
      }

      return fetch(process.env.VUE_APP_BASE_URL + (payload.url || '/'), opts)
    },
    api (context, { opId, path, data }) {
      let op = context.getters.op(opId)
      let url = Object.keys(op)[0]
      let re = /^\/{\w+_Path}/
      if (re.exec(url)) {
        let objPath = path || getUrl(context.state.context.object)
        url = url.replace(re, objPath)
      }
      let verb = Object.keys(Object.values(op)[0])[0]
      let opts = { url: url }
      if (verb !== 'get') {
        opts.method = verb.toUpperCase()
        if (data) {
          opts.data = data
        }
      }

      return context.dispatch('fetch', opts)
    },
    async load (context, payload) {
      let opts = { opId: payload.opId }
      if (payload.data) {
        opts.data = payload.data
      }
      let result = await context.dispatch('api', opts)
      if (result.ok) {
        let rjson = await result.json()
        payload.data = rjson.result
        context.commit('set2Context', payload)
      }
    },
    async add (context, { opId, data, path, global, children }) {
      let opts = { opId: opId, data: data }
      if (path) {
        opts.path = path
      }
      let result = await context.dispatch('api', opts)
      let rjson = await result.json()
      if (result.ok) {
        if (global) {
          Vue.set(context.state[children], rjson.result.object.slug, rjson.result.object)
          let ctx = context.state.context
          ctx.object[children].push(rjson.result.object.slug)
          context.commit('setContext', ctx)
        } else {
          let ctx = context.state.context
          ctx[children][rjson.result.object.slug] = rjson.result.object
          ctx.object[children].push(rjson.result.object.slug)
          context.commit('setContext', ctx)
        }
        context.getters.actor.roles = rjson.result.actor_roles

        return rjson
      } else {
        context.commit('setErrors', { '_message': rjson.message })
      }
    },
    async remove (context, payload) {
      let result = await context.dispatch('api', payload)
      let rjson = await result.json()
      if (result.ok) {
        let slug = payload.path.split('/').pop()
        if (payload.global) {
          Vue.delete(context.state[payload.children], slug)
          let ctx = context.state.context
          ctx.object[payload.children].splice(ctx.object[payload.children].indexOf(slug), 1)
          context.commit('setContext', ctx)
        } else {
          let ctx = context.state.context
          Vue.delete(ctx[payload.children], slug)
          ctx.object[payload.children].splice(ctx.object[payload.children].indexOf(slug), 1)
          context.commit('setContext', ctx)
        }

        context.getters.actor.roles = rjson.result
        return rjson
      } else {
        context.commit('setErrors', { '_message': rjson.message })
      }
    },
    async transfer_role (context, { opId, role, owner, newOwner }) {
      let result = await context.dispatch('api', { opId: opId, data: { owner: owner, newOwner: newOwner, role: role } })
      let rjson = await result.json()
      if (result.ok) {
        let users = context.state.users
        let newOne = Object.values(users).find(u => u.email === newOwner)
        let exOwner = Object.values(users).find(u => u.email === owner)
        users[exOwner.slug].roles = rjson.result.exOwner
        users[newOne.slug].roles = rjson.result.newOwner
        context.commit('setUsers', users)
        return rjson
      } else {
        context.commit('setErrors', rjson)
      }
    },
    async give_role (context, { opId, role, email }) {
      let result = await context.dispatch('api', { opId: opId, data: { email: email, role: role } })
      let rjson = await result.json()
      if (result.ok) {
        let users = context.state.users
        let user = Object.values(users).find(u => u.email === email)
        users[user.slug].roles = rjson.result
        context.commit('setUsers', users)
        return rjson
      } else {
        context.commit('setErrors', rjson)
      }
    },
    async withdraw_role (context, { opId, role, email }) {
      let result = await context.dispatch('api', { opId: opId, data: { role: role, email: email } })
      let rjson = await result.json()
      if (result.ok) {
        let users = context.state.users
        let user = Object.values(users).find(u => u.email === email)
        users[user.slug].roles = rjson.result
        context.commit('setUsers', users)
      } else {
        context.commit('setErrors', rjson)
      }
    },
    async loadOpenApi (context) {
      let result = await context.dispatch('fetch', { url: '/openapi' })
      if (result.ok) {
        let rjson = await result.json()
        context.commit('setOpenApi', rjson)
      }
    },
    async loadSec (context) {
      let result = await context.dispatch('fetch', { url: '/get_permissions' })
      if (result.ok) {
        let rjson = await result.json()
        context.commit('setPermissions', rjson.result)
      }
      result = await context.dispatch('fetch', { url: '/get_roles' })
      if (result.ok) {
        let rjson = await result.json()
        context.commit('setRoles', rjson.result)
      }
      result = await context.dispatch('fetch', { url: '/get_users' })
      if (result.ok) {
        let rjson = await result.json()
        context.commit('setUsers', rjson.result)
        // context.commit('setUser', rjson.result.garito)
      }
    },
    async signIn (context, payload) {
      let result = await context.dispatch('api', { opId: 'Root/auth', data: payload })
      if (result.ok) {
        let rjson = await result.json()
        context.commit('setToken', rjson.access_token)
        return true
      } else {
        switch (result.status) {
          default:
            context.commit('setErrors', { _message: 'Invalid user name & password' })
            break
        }
      }
    },
    signOut (context) {
      context.commit('setToken', null)
    }
  }
}

export default store
