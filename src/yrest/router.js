import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

function getViews (req) {
  let components = {}
  for (var key of req.keys()) {
    let parts = key.split('/')
    let model = parts[1]
    let view = parts[2].replace(/.vue$/, '')
    if (!Object.keys(components).includes(view)) { components[view] = {} }

    const component = req(key)
    const name = component.default.name
    const opId = component.default.data ? component.default.data().opId : null
    components[view][model] = { name: name, opId: opId }
    Vue.component(name, component.default)
  }
  return components
}

function checkPerms (component, auth, ctx) {
  return (component.opId && !store.getters.can(component.opId, ctx)) ? auth : component.name
}

function beforeEach (store, components) {
  let auth = Object.values(components.auth)[0].name

  return async (to, from, next) => {
    if (!store.state.openApi) {
      await store.dispatch('loadOpenApi')
    }
    if (!store.state.perms || !store.state.roles || !store.state.users) {
      await store.dispatch('loadSec')
    }

    let view = (to.path === '/') ? 'index' : to.path.split('/').pop()
    if (Object.keys(components).includes(view)) {
      let models = Object.keys(components[view])
      if (models.length === 1) {
        to.params.component = checkPerms(components[view][models[0]], auth, to.path)
        to.params.opId = components[view][models[0]].opId
      }

      var url = to.path.split('/').slice(0, -1).join('/')
    } else {
      url = to.path
      view = 'index'
    }

    let result = await store.dispatch('fetch', { url: url })
    if (result.ok) {
      let rjson = await result.json()
      if (!to.params.component) {
        let obj = Object.keys(rjson.result).includes('object') ? rjson.result.object : rjson.result
        let comp = components[view][obj.type]
        if (comp) {
          to.params.component = checkPerms(comp, auth, to.path)
          to.params.opId = comp.opId
        } else {
          to.params.component = Object.values(components.not_found)[0].name
        }
      }

      store.commit('setContext', rjson.result)
    } else {
      switch (result.status) {
        case 401:
          to.params.component = auth
          break
        case 404:
        case 405:
          to.params.component = Object.values(components.not_found)[0].name
          to.params.result = result
          break
      }
    }

    if (to.path !== '/auth' && to.params.component === auth) {
      next({ path: '/auth', query: { next: to.fullPath } })
    } else {
      next()
    }
  }
}

export { getViews, beforeEach }
