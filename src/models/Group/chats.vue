<template>
  <div class="group chats section">
    <div v-if="loading">{{ $t('Loading') }}...</div>
    <template v-else>
      <h1 class="title has-text-primary">{{ $t('chatsTitle', { group: obj.name }) }}</h1>
      <template v-if="msgs">
        <div class="columns" v-for="project in msgs" :key="project.obj._id">
          <div class="column">
            <h2 class="subtitle">
              <router-link :to="$url(project.obj) + '/chat'" :class="project.obj.type.toLowerCase()">
                {{ project.obj.name }}
              </router-link>
            </h2>
            <Message :message="msg" v-for="msg in Object.values(project.msgs)" :key="msg._id" />
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
const Message = () => import('@/components/Chat/message')

export default {
  name: 'GroupChats',
  components: { Message },
  data: () => ({ opId: 'Root/msgs_by_project' }),
  computed: {
    obj () { return this.$store.state.context.object },
    loading () { return !this.obj || this.obj.type !== 'Group' },
    msgs () { return this.$store.state.context.msgs_by_project }
  },
  async created () {
    await this.$store.dispatch('load', { opId: this.opId, name: 'msgs_by_project' })
  }
}
</script>
