<template>
  <div class="menu">
    <div class="section" v-if="menu">
      <ul class="menu-list">
        <li v-for="[name, opt] in Object.entries(menu)" :key="name">
          <router-link :to="$url($store.state.context.object, opt.path)">
            <span class="icon" :alt="opt.label || name" :title="opt.label || name" v-if="opt.icon">
              <FontAwesomeIcon :icon="opt.icon"></FontAwesomeIcon>
            </span>
            <span class="is-hidden-mobile">{{ opt.label || name }}</span>
          </router-link>
        </li>
      </ul>
      <!-- <Selector :users="Object.values(users).map(u => ({ value: u.email, label: u.name }))" :value="user.email" @selected="setUser" v-if="Object.keys(users).length" /> -->
    </div>
  </div>
</template>

<script>
// const Selector = () => import('@/components/User/selector')

export default {
  name: 'Menu',
  // components: { Selector },
  computed: {
    menu () { return this.$store.state.menus[this.$store.state.menu] },
    user () { return this.$store.state.user },
    users () { return this.$store.state.users }
  },
  methods: {
    setUser (email) { this.$store.commit('setUser', Object.values(this.$store.state.users).find(u => u.email === email)) }
  }
}
</script>

<style lang="sass" scoped>
@import '~bulma/sass/utilities/mixins'

.section
  @include mobile
    padding-left: 1rem
    padding-right: 0px
</style>
