<template>
  <div class="group chats section">
    <div v-if="loading">{{ $t('Loading') }}...</div>
    <template v-else>
      <h1 class="title has-text-primary">{{ $t('chatsTitle', { group: obj.name }) }}</h1>
      <template v-if="msgs">
        <div class="columns">
          <div class="column is-narrow">
            <div class="menu">
              <ul class="menu-list">
                <li v-for="obj in papers" :key="obj._id">
                  <a>{{ obj.name }}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- <div class="columns" v-for="project in msgs" :key="project.obj._id">
          <div class="column">
            <h2 class="subtitle">
              <a @click="room = $url(project.obj) + '/chat'" :class="project.obj.type.toLowerCase()">
                {{ project.obj.name }}
              </a>
            </h2>
            <Message :message="msg" v-for="msg in Object.values(project.msgs)" :key="msg._id" />
          </div>
        </div> -->
      </template>
    </template>
  </div>
</template>

<script>
// const Message = () => import('@/components/Chat/message')
const Chat = () => import('@/components/Chat/chat')

export default {
  name: 'GroupChats',
  components: { Chat },
  // components: { Message },
  data: () => ({ opId: 'Root/msgs_by_project', room: null }),
  computed: {
    obj () { return this.$store.state.context.object },
    loading () { return !this.obj || this.obj.type !== 'Group' },
    msgs () { return this.$store.state.context.msgs_by_project },
    papers () {
      let papers = Object.values(this.msgs).map(val => val.obj)
      return papers
    }
  },
  async created () {
    await this.$store.dispatch('load', { opId: this.opId, name: 'msgs_by_project' })
  }
}
</script>

<style scoped>
.messages {
  height: 75vh;
}
</style>
