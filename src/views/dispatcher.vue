<template>
  <component :is="$route.params.component" />
</template>

<script>
export default {
  name: 'Dispatcher',
  computed: {
    object () { return this.$store.state.context ? this.$store.state.context.object : null }
  },
  watch: {
    object: {
      immediate: true,
      handler (value) {
        if (value) {
          let model = value.type
          if (this.$store.state.menu !== model) {
            this.$store.state.menu = model
          }
          this.$store.dispatch('load', { opId: (model === 'Group' ? 'Root' : model) + '/get_news', name: 'newsAggrs' })
        }
      }
    }
  }
}
</script>
