<template>
  <div class="chat columns is-gapless">
    <div class="messages column is-expanded columns">
      <div class="msg column is-narrow is-marginless is-fullwidth" v-for="(msg, idx) in messages" :key="idx + JSON.stringify(msg)">
        <Message :message="msg" />
      </div>
    </div>
    <div class="column is-narrow" v-if="isConnected">
      <FormInput name="Message" v-model="message" @keypress.enter="send">
        <template v-slot:addOnRight>
          <div class="control">
            <button class="button has-text-grey-light" type="button" @click="send">
              <FontAwesomeIcon :icon="[ 'far', 'paper-plane' ]"></FontAwesomeIcon>
            </button>
          </div>
        </template>
      </FormInput>
    </div>
  </div>
</template>

<script>
const Message = () => import('./message')

export default {
  name: 'Chat',
  components: { Message },
  props: { room: { type: String, default: 'main' } },
  data: () => ({ message: '' }),
  computed: {
    isConnected () { return this.$store.state.socket.isConnected },
    messages () { return this.$store.state.socket.messages },
    actor () { return this.$store.getters.actor }
  },
  methods: {
    send () {
      if (this.message) {
        this.$socket.send(JSON.stringify({ user: this.actor.slug, message: this.message, room: this.room }))
        this.message = ''
      }
    }
  },
  watch: {
    isConnected (val) {
      if (val) {
        this.$socket.send(JSON.stringify({ connected: this.actor.slug, room: this.room }))
      }
    }
  },
  created () {
    const wsUrl = process.env.VUE_APP_WEBSOCKET_URL.startsWith('ws://') ? process.env.VUE_APP_WEBSOCKET_URL : 'ws://' + location.host + process.env.VUE_APP_WEBSOCKET_URL
    this.$connect(wsUrl, { store: this.$store, format: 'json', reconnection: true })
  },
  beforeDestroy () {
    this.$socket.send(JSON.stringify({ disconnected: this.actor.slug, room: this.room }))
    this.$disconnect()
  }
}
</script>

<style scoped>
.chat {
  height: 100%;
  flex-direction: column;
}

.messages {
  flex-direction: column;
  justify-content: flex-end;
  overflow-y: auto;
}

.msg {
  padding-top: 3px;
  padding-bottom: 3px;
}
</style>
