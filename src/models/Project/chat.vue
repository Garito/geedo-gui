<template>
  <div class="project chat section">
    <div v-if="loading">{{ $t('Loading') }}...</div>
    <template v-else>
      <h1 class="title project">
        <span class="has-text-grey-dark is-size-6">Xat de</span>
        {{ obj.name }}
        <!-- {{ $t('chatTitle', { project: obj.name }) }} -->
      </h1>
      <div class="columns">
        <div class="column is-expanded messages">
          <Chat :room="$url(obj)" />
        </div>
        <div class="column is-narrow users">
          <Avatar :obj="$store.state.users[user]" v-for="user in users" :key="user">
            <template v-slot="{ obj }">{{ obj.name }}</template>
          </Avatar>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
const Chat = () => import('@/components/Chat/chat')
const Avatar = () => import('@/components/User/avatar')

export default {
  name: 'ProjectChat',
  components: { Chat, Avatar },
  computed: {
    obj () { return this.$store.state.context.object },
    loading () { return !this.obj || this.obj.type !== 'Project' },
    users () { return this.$store.state.socket.users }
  }
}
</script>

<style scoped>
.messages {
  height: 80vh;
}
</style>
