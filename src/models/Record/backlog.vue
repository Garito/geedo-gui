<template>
  <div class="record backlog section">
    <div v-if="loading">{{ $t('Loading') }}...</div>
    <template v-else>
      <div class="columns">
        <div class="column">
          <h1 class="title record">
            <span class="has-text-grey-dark is-size-6">Activitat a</span>
            {{ obj.name }}
            <!-- {{ $t('backlogTitle', { project: obj.name }) }} -->
            </h1>
        </div>
      </div>

      <Menu :obj="obj" active="backlog" :stats="newsAggrs" />

      <div class="columns">
        <div class="column">
          <Card :obj="log" v-for="log in logs" :key="log.slug" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
const Menu = () => import('@/components/Record/menu')
const Card = () => import('@/components/Backlog/card')

export default {
  name: 'RecordBacklog',
  components: { Menu, Card },
  computed: {
    obj () { return this.$store.state.context.object },
    loading () { return !this.obj || this.obj.type !== 'Record' },
    logs () { return this.$store.state.context.logs },
    newsAggrs () { return this.$store.state.context.newsAggrs }
  },
  created () { this.$store.dispatch('load', { opId: 'Record/get_logs', name: 'logs' }) }
}
</script>
