<template>
  <div class="group backlog section">
    <div v-if="loading">{{ $t('Loading') }}...</div>
    <template v-else>
      <div class="columns">
        <div class="column">
          <h1 class="title has-text-primary">{{ $t('backlogTitle', { project: group.name }) }}</h1>
        </div>
      </div>
      <div class="columns">
        <div class="column">
          <Card :obj="log" v-for="log in logs" :key="log.slug" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
const Card = () => import('@/components/Backlog/card')

export default {
  name: 'GroupBacklog',
  components: { Card },
  computed: {
    group () { return this.$store.state.context.object },
    loading () { return !this.group || this.group.type !== 'Group' },
    logs () { return this.$store.state.context.logs }
  },
  created () { this.$store.dispatch('load', { opId: 'Root/get_logs', name: 'logs' }) }
}
</script>
