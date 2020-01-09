<template>
  <div class="project chat section">
    <div v-if="loading">{{ $t('Loading') }}...</div>
    <template v-else>
      <h1 class="title project">
        <span class="has-text-grey-dark is-size-6">Xat de</span>
        {{ obj.name }}
        <!-- {{ $t('chatTitle', { project: obj.name }) }} -->
      </h1>

      <Menu :obj="obj" active="chat" :stats="newsAggrs" />

      <div class="columns">
        <div class="column is-expanded messages">
          <Chat :room="$url(obj)" />
        </div>
        <div class="column is-narrow users">
          <!-- <Avatar2 :obj="$store.state.users[user]" v-for="user in users" :key="user">
            <template v-slot="{ obj }">{{ obj.name }}</template>
          </Avatar2> -->
          <div v-for="user in users" :key="user">
            <Avatar :username="$store.state.users[user].name" />
            <div>{{ $store.state.users[user].name }}</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
const Menu = () => import('@/components/Project/menu')
const Chat = () => import('@/components/Chat/chat')
const Avatar2 = () => import('@/components/User/avatar')
const Avatar = () => import('vue-avatar')

export default {
  name: 'ProjectChat',
  components: { Menu, Chat, Avatar, Avatar2 },
  computed: {
    obj () { return this.$store.state.context.object },
    loading () { return !this.obj || this.obj.type !== 'Project' },
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
