<template>
  <div id="app">
    <header><Navbar /></header>
    <div class="columns is-mobile is-gapless">
      <aside class="column is-narrow" v-if="$store.getters.actor "><MainMenu /></aside>
      <aside class="column is-3" v-if="obj && ['Project', 'Record'].includes(obj.type)"><Near :obj="obj" :near="getNear" /></aside>
      <main class="column is-expanded"><router-view /></main>
    </div>
  </div>
</template>

<script>
const Navbar = () => import('@/components/navbar')
const Near = () => import('@/components/near')
const MainMenu = () => import('@/components/mainmenu')

export default {
  name: 'App',
  components: { Navbar, Near, MainMenu },
  computed: {
    obj () { return (this.$store.state.context || {}).object }
  },
  methods: {
    async getNear() {
      
    }
  },
  created () {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'setContext') {
        this.$store.dispatch('load', { opId: 'Root/get_news', name: 'globalNewsAggrs' })
      }
    })
  }
}
</script>
