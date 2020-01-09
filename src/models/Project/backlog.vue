<template>
  <div class="project backlog section">
    <div v-if="loading">{{ $t('Loading') }}...</div>
    <template v-else>
      <div class="columns">
        <div class="column">
          <h1 class="title project">
            <span class="has-text-grey-dark is-size-6">Activitat a</span>
            {{ project.name }}
            <!-- {{ $t('backlogTitle', { project: project.name }) }} -->
          </h1>
        </div>
      </div>

      <Menu :obj="project" active="backlog" :stats="newsAggrs" />

      <div class="columns">
        <div class="column">
          <Card :obj="log" v-for="log in logs" :key="log.slug" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
const Menu = () => import('@/components/Project/menu')
const Card = () => import('@/components/Backlog/card')

export default {
  name: 'ProjectBacklog',
  components: { Menu, Card },
  computed: {
    project () { return this.$store.state.context.object },
    loading () { return !this.project || this.project.type !== 'Project' },
    logs () { return this.$store.state.context.logs },
    newsAggrs () { return this.$store.state.context.newsAggrs }
  },
  created () { this.$store.dispatch('load', { opId: 'Project/get_logs', name: 'logs' }) }
}
</script>
