<template>
  <dl class="columns">
    <dt class="column is-narrow">
      <div class="columns">
        <div class="column space"></div>
        <div class="column node-name" :class="{ 'is-selected': path === tree.selected }">
          <span class="name" @click="tree.selected = path">{{ node.name || node.slug }}</span>
          <FontAwesomeIcon :icon="[ 'far', opened ? 'minus-square' : 'plus-square' ]" class="toggler" v-if="node.lists" @click="toggleChildren"></FontAwesomeIcon>
        </div>
        <div class="column space"></div>
      </div>
    </dt>
    <dd class="column" v-if="opened">
      <dl class="columns" v-for="lst in node.lists" :key="node._id + lst">
        <dt class="column is-narrow">
          <div class="columns">
            <div class="column space"></div>
            <div class="column node-name" :class="{ 'is-selected': makeUrl([path, lst]) === tree.selected }">
              <span class="name" @click="tree.selected = makeUrl([path, lst])">{{ lst }}</span>
              <FontAwesomeIcon :icon="[ 'far', childOpened(lst) ? 'minus-square' : 'plus-square' ]" class="toggler" v-if="node[lst].length" @click="toggleChildrenList(lst)"></FontAwesomeIcon>
            </div>
            <div class="column space"></div>
          </div>
        </dt>
        <dd class="column is-narrow">
          <template v-if="childOpened(lst)">
            <TreeNode :node="child" :path="makeUrl([path, lst, child.slug])" v-for="child in node[lst]" :key="node._id + child._id" :ref="child.slug" />
          </template>
        </dd>
      </dl>
    </dd>
  </dl>
</template>

<script>
export default {
  name: 'TreeNode',
  props: { node: Object, path: { type: String, default: '/' } },
  computed: {
    tree () {
      let node = this
      while (node.$parent !== node.$root && node.$vnode.componentOptions.tag !== 'Tree') {
        node = node.$parent
      }
      return node
    },
    url () { return this.$url(this.node) },
    opened () { return Object.keys(this.tree.nodes).includes(this.url) && this.tree.nodes[this.url].opened }
  },
  methods: {
    makeUrl (parts) {
      if (parts[0] === '/') {
        parts[0] = ''
      }
      return parts.join('/')
    },
    toggleChildren () {
      if (!Object.keys(this.tree.nodes).includes(this.url)) {
        this.$set(this.tree.nodes, this.url, { opened: true })
      } else {
        this.$set(this.tree.nodes[this.url], 'opened', !this.tree.nodes[this.url].opened)
      }
    },
    childOpened (lst) {
      return Object.keys(this.tree.nodes).includes(this.url) && Object.keys(this.tree.nodes[this.url]).includes('openChildren') && Object.keys(this.tree.nodes[this.url].openChildren).includes(lst) && this.tree.nodes[this.url].openChildren[lst]
    },
    toggleChildrenList (lst) {
      if (!Object.keys(this.tree.nodes).includes(this.url)) {
        this.$set(this.tree.nodes, this.url, {})
      }
      if (!Object.keys(this.tree.nodes[this.url]).includes('openChildren')) {
        this.$set(this.tree.nodes[this.url], 'openChildren', {})
      }
      if (!Object.keys(this.tree.nodes[this.url].openChildren).includes(lst)) {
        this.$set(this.tree.nodes[this.url].openChildren, lst, true)
      } else {
        this.$set(this.tree.nodes[this.url].openChildren, lst, !this.tree.nodes[this.url].openChildren[lst])
      }
    },
    async getNode (path, traversing = false) {
      if (path === '/') {
        return [this, null]
      } else {
        let parts = path.split('/')
        if (parts.length === 2 && this.node.lists.includes(parts[1])) {
          if (traversing && !this.opened) {
            this.toggleChildren()
            await this.$nextTick()
          }
          return [this, parts.pop()]
        } else {
          parts.shift()
          let segment = parts.shift()
          if (segment && traversing) {
            if (!this.opened) {
              this.toggleChildren()
            }
            if (!this.childOpened(segment)) {
              this.toggleChildrenList(segment)
            }
            await this.$nextTick()
          }
          let child = parts.shift()
          if (Object.keys(this.$refs).includes(child)) {
            return this.$refs[child][0].getNode('/' + parts.join('/'), traversing)
          }
        }
      }
      return null
    }
  }
}
</script>

<style lang="scss" scoped>
//@import '~bulmaswatch/flatly/_variables';
@import '~bulma/sass/utilities/functions';
@import '~bulma/sass/utilities/initial-variables';
@import '~bulma/sass/utilities/derived-variables';

.name {
  padding-right: 0.5rem;
}

.toggler {
  font-size: .75rem;
}

.node-name, .space, dt {
  padding-top: 0px;
  padding-bottom: 0px;
}

.is-selected {
  color: $info-invert;
  background-color: $info;
}

.space {
  flex: 1;
}

.node-name {
  flex: 0;
}

dt > .columns {
  height: 100%;
  flex-direction: column;
  margin-top: 0px;
  margin-bottom: 0px;
}

dt > .columns > .column {
  border-left: 1px solid black;
}

dd > dl:first-child > dt > .columns > .column:first-child,
dd > dl:last-child > dt > .columns > .column:last-child,
dd > dl:only-child > dt > .columns > .column,
.tree > dl > dt > .columns > .column,
.tree > dt > .columns > .column {
  border-left: none;
}

dd > dl:nth-child(1):not(:only-child) > dt > .columns > .column:nth-child(2) {
  border-top-left-radius: 10px;
}

dd > dl:nth-last-child(1):not(:only-child) > dt > .columns > .column:nth-child(2) {
  border-bottom-left-radius: 10px;
}
</style>
