<template>
  <nav class="navbar is-white" role="navigation" aria-label="main navigation">
    <div class="navbar-brand is-white">
      <router-link to="/" class="navbar-item">
        <img src="@/assets/GD.png" alt="GD logo" />
      </router-link>
      <template v-if="actor">
        <span class="navbar-item welcome" v-if="$route.path === '/'">
          {{ $t('welcome') }} {{ $t('you have') }}&nbsp;<span class="project has-text-weight-bold">{{ $tc('pendingProjects', projects, { projects: projects }) }}</span>&nbsp;{{ $t('and') }}&nbsp;<span class="record has-text-weight-bold">{{ $tc('pendingRecords', records, { records: records }) }}</span>&nbsp;{{ $t('opened') }}
        </span>
        <Search class="navbar-item searchBox corner-2-right is-hidden-desktop" />
        <Avatar :obj="actor" class="navbar-item is-hidden-desktop" />
      </template>
    </div>
    <div class="navbar-menu" v-if="actor">
      <div class="navbar-end">
        <Search class="navbar-item" />
        <Avatar :obj="actor" class="navbar-item" />
      </div>
    </div>
  </nav>
</template>

<script>
const Search = () => import('@/components/search')
const Avatar = () => import('@/components/User/avatar')

export default {
  name: 'Navbar',
  components: { Search, Avatar },
  computed: {
    actor () { return this.$store.getters.actor },
    myStuff () { return this.$store.state.myStuff },
    projects () {
      if (this.myStuff) {
        let result = 0
        for (var value of Object.values(this.$store.state.context.projects || {})) {
          let url = this.$url(value)
          if (this.actor.roles.includes('owner@' + url)) {
            result += 1
          }
        }
        return result
      } else {
        return Object.keys(this.$store.state.context.projects || {}).length
      }
    },
    records () {
      if (this.myStuff) {
        let result = 0
        for (var value of Object.values(this.$store.state.context.records || {})) {
          let url = this.$url(value)
          if (this.actor.roles.includes('owner@' + url)) {
            result += 1
          }
        }
        return result
      } else {
        return Object.keys(this.$store.state.context.records || {}).length
      }
    }
  }
}
</script>
