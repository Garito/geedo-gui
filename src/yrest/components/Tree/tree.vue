<template>
  <div class="columns" v-shortkey="keys.maps[keys.map]" @shortkey="shortkey" ref="tree">
    <div class="column">
      <div class="columns">
        <div class="column">{{ message }}</div>
      </div>
      <div class="columns">
        <div class="column">
          <FormInput name="path" label="Path" v-model="goPath" :error="goError" placeholder="Go to a particular branch" :icons="{ left: 'link' }" text="Enter the relative url of the branch to select it" @focus="keys.map = 'traversing'" @blur="keys.map = 'default'">
            <template v-slot:addOnRight>
              <div class="control">
                <button class="button" :class="{ 'is-danger is-outlined': goError }" @click="traverse(goPath)" ref="goBtn">Go</button>
              </div>
            </template>
          </FormInput>
        </div>
      </div>
      <div class="columns">
        <div class="column">
          <a v-clipboard:copy="stateLink()" v-clipboard:success="() => copied()" v-clipboard:error="() => copied(false)">
            <FontAwesomeIcon icon="check" v-if="copy === true"></FontAwesomeIcon>
            <FontAwesomeIcon icon="times" v-else-if="copy === false"></FontAwesomeIcon>
            <FontAwesomeIcon :icon="[ 'far', 'share-square' ]" v-else></FontAwesomeIcon>
          </a>
          {{ this.selected }}
        </div>
      </div>
      <div class="columns">
        <div class="column">
          <Node :node="tree" class="tree" ref="tree" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const Node = () => import('./node')

export default {
  name: 'Tree',
  components: { Node },
  props: { tree: Object },
  data: () => ({
    copy: null,
    nodes: {},
    selected: '/',
    goPath: '',
    goError: null,
    keys: {
      map: 'default',
      maps: {
        default: {
          up: ['arrowup'],
          down: ['arrowdown'],
          left: ['arrowleft'],
          right: ['arrowright'],
          toggle: ['space']
          // edit: ['enter'],
          // remove: ['backspace'],
          // addChild: ['meta', 'enter'],
          // addSibling: ['shift', 'enter']
        },
        traversing: {
          go: ['enter']
        }
      }
    }
  }),
  computed: {
    isConnected () { return this.$store.state.socket.isConnected },
    actor () { return this.$store.getters.actor },
    message () { return this.$store.state.socket.message }
  },
  methods: {
    shortkey (e) { this[e.srcKey]() },
    async traverse (path) {
      let node = await this.$refs.tree.getNode(path, true)
      if (node) {
        this.selected = path
        return true
      } else {
        this.goError = path + ' not found'
        return false
      }
    },
    async go () {
      if (await this.traverse(this.goPath)) {
        this.goError = null
        this.$refs.goBtn.focus()
      }
    },
    async selectSibling (prev = false) {
      let newSegment = null
      let parentUrl = this.selected.split('/').slice(0, -1).join('/') || '/'
      let [node, segment] = await this.$refs.tree.getNode(this.selected)
      if (segment) {
        let idx = node.node.lists.indexOf(segment)
        if (prev) {
          idx -= 1
          if (idx > -1) {
            newSegment = node.node.lists[idx]
          }
        } else {
          idx += 1
          if (idx < node.node.lists.length) {
            newSegment = node.node.lists[idx]
          }
        }
      } else if (this.selected !== '/') {
        let [parent, lst] = await this.$refs.tree.getNode(parentUrl)
        if (lst) {
          let idx = parent.node[lst].findIndex(c => c.slug === node.node.slug)
          if (prev) {
            idx -= 1
            if (idx > -1) {
              newSegment = parent.node[lst][idx].slug
            }
          } else {
            idx += 1
            if (idx < parent.node[lst].length) {
              newSegment = parent.node[lst][idx].slug
            }
          }
        }
      }
      if (newSegment) {
        this.selected = this.$refs.tree.makeUrl([parentUrl, newSegment])
      }
    },
    up () { this.selectSibling(true) },
    down () { this.selectSibling() },
    left () { this.selected = this.selected.split('/').slice(0, -1).join('/') || '/' },
    async right () {
      let [node, segment] = await this.$refs.tree.getNode(this.selected)
      if (segment) {
        var next = node.node[segment][0] ? node.node[segment][0].slug : null
      } else {
        if (node.node.lists) {
          next = node.node.lists[0]
        }
      }
      if (next) {
        if (segment) {
          if (!node.childOpened(segment)) {
            node.toggleChildrenList(segment)
          }
        } else {
          if (!node.opened) {
            node.toggleChildren()
          }
        }
        this.selected = this.$refs.tree.makeUrl([this.selected, next])
      }
    },
    async toggle () {
      let [ node, segment ] = await this.$refs.tree.getNode(this.selected)
      if (segment) {
        node.toggleChildrenList(segment)
      } else {
        node.toggleChildren()
      }
    },
    stateLink () {
      let query = this.$route.query
      query.selected = encodeURIComponent(this.selected)
      if (Object.keys(this.nodes).length) {
        query.nodes = encodeURIComponent(JSON.stringify(this.nodes))
      }
      let path = this.$route.path + '?' + Object.entries(query).map(([name, value]) => name + '=' + value).join('&')
      let url = window.location.origin + '/#' + path
      return url
    },
    copied (val = true) {
      this.copy = val
      setTimeout(() => { this.copy = null }, 1000)
    }
  },
  watch: {
    selected (val) {
      this.$socket.send(JSON.stringify({ user: this.$store.getters.actor.slug, selected: val }))
    },
    nodes (val) {
      this.$socket.send(JSON.stringify({ user: this.$store.getters.actor.slug, nodes: val }))
    },
    isConnected (val, old) {
      if (!old && val) {
        this.$socket.send(JSON.stringify({ connected: this.actor.slug }))
      }
    }
  },
  created () {
    let queryKeys = Object.keys(this.$route.query)
    if (queryKeys.includes('nodes')) {
      this.nodes = JSON.parse(this.$route.query.nodes)
    }
    if (queryKeys.includes('selected')) {
      this.selected = this.$route.query.selected
    }
    this.$connect(process.env.VUE_APP_WEBSOCKET_URL + '?token=' + this.$store.state.token, { store: this.$store, format: 'json', reconnection: true })
  },
  beforeDestroy () {
    this.$socket.send(JSON.stringify({ disconnected: this.actor.slug }))
    this.$disconnect()
  }
}
</script>

<style scoped>
.tree {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
}
</style>
