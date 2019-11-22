<template>
  <div id="app">
    <header><Navbar /></header>
    <div class="columns is-mobile is-gapless">
      <aside class="column is-narrow" v-if="$store.getters.actor "><Commands /></aside>
      <main class="column is-expanded"><router-view /></main>
    </div>
  </div>
</template>

<script>
const Navbar = () => import('@/components/navbar')
const Commands = () => import('@/components/commands')

export default {
  name: 'App',
  components: { Navbar, Commands }
}
</script>
