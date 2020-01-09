<template>
  <div class="record chat section">
    <div v-if="loading">Loading...</div>
    <template v-else>
      <h1 class="title record">
        <span class="has-text-grey-dark is-size-6">Xat a</span>
        {{ obj.name }}
        <!-- {{ $t('chatTitle', { project: obj.name }) }} -->
      </h1>

      <Menu :obj="obj" active="chat" :stats="newsAggrs" />

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
const Menu = () => import('@/components/Record/menu')
const Chat = () => import('@/components/Chat/chat')
const Avatar = () => import('@/components/User/avatar')

export default {
  name: 'RecordChat',
  components: { Menu, Chat, Avatar },
  computed: {
    obj () { return this.$store.state.context.object },
    loading () { return !this.obj || this.obj.type !== 'Record' },
    users () { return this.$store.state.socket.users },
    newsAggrs () { return this.$store.state.context.newsAggrs }
  }
}
</script>

<style scoped>
.messages {
  height: 75vh;
}
</style>
