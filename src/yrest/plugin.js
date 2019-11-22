function url (obj, subpath = null) {
  if (obj.path === '') {
    var result = '/'
  } else if (obj.path === '/') {
    result = '/' + obj.slug
  } else {
    result = obj.path + '/' + obj.slug
  }

  if (subpath) {
    return result.endsWith('/') ? result.slice(0, -1) + subpath : result + subpath
  } else {
    return result
  }
}

export default {
  install (Vue, options) {
    Vue.prototype.$url = url
  }
}

export { url }
