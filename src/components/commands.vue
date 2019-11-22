<template>
  <div class="section" :class="[obj ? obj.type.toLowerCase() : null]">
    <template v-if="obj">
      <router-link to="/add" tag="div" class="command has-text-centered" v-if="obj.type === 'Group'">
        <div class="icon">
          <FontAwesomeIcon :icon="[ 'far', 'plus-square']" size="2x"></FontAwesomeIcon>
        </div>
        <div class="is-hidden-mobile">{{ $t('Add') }}</div>
      </router-link>
      <router-link :to="$url(obj)" tag="div" class="command has-text-centered" v-else>
        <div class="icon">
          <FontAwesomeIcon icon="info" size="2x"></FontAwesomeIcon>
        </div>
        <div class="is-hidden-mobile">{{ $t('Info') }}</div>
      </router-link>
      <router-link :to="url('/files')" tag="div" class="command has-text-centered">
        <div class="icon" :data-badge="files || null">
          <FontAwesomeIcon :icon="[ 'far', 'file']" size="2x"></FontAwesomeIcon>
        </div>
        <div class="is-hidden-mobile">{{ $t('Files') }}</div>
      </router-link>
      <router-link :to="url('/backlog')" tag="div" class="command has-text-centered">
        <div class="icon" :data-badge="activity || null">
          <FontAwesomeIcon :icon="[ 'far', 'bell']" size="2x"></FontAwesomeIcon>
        </div>
        <div class="is-hidden-mobile">{{ $t('Activity') }}</div>
      </router-link>
      <router-link :to="url('/chats')" tag="div" class="command has-text-centered" v-if="obj.type === 'Group'">
        <div class="icon" :data-badge="messages || null">
          <FontAwesomeIcon :icon="[ 'far', 'comment-alt']" size="2x"></FontAwesomeIcon>
        </div>
        <div class="is-hidden-mobile">{{ $t('Chats') }}</div>
      </router-link>
      <router-link :to="url('/chat')" tag="div" class="command has-text-centered" v-else>
        <div class="icon" :data-badge="messages || null">
          <FontAwesomeIcon :icon="[ 'far', 'comment-alt']" size="2x"></FontAwesomeIcon>
        </div>
        <div class="is-hidden-mobile">{{ $t('Chat') }}</div>
      </router-link>
      <template v-if="obj.type === 'Group'">
        <router-link to="/permissions" tag="div" class="command has-text-centered">
          <div class="icon">
            <FontAwesomeIcon icon="shield-alt" size="2x"></FontAwesomeIcon>
          </div>
          <div class="is-hidden-mobile">{{ $t('Permissions') }}</div>
        </router-link>
        <router-link to="/roles" tag="div" class="command has-text-centered">
          <div class="icon">
            <FontAwesomeIcon icon="user-shield" size="2x"></FontAwesomeIcon>
          </div>
          <div class="is-hidden-mobile">{{ $t('Roles') }}</div>
        </router-link>
      </template>
      <router-link :to="url('/stakeholders')" tag="div" class="command has-text-centered" v-else>
        <div class="icon">
          <FontAwesomeIcon icon="user-shield" size="2x"></FontAwesomeIcon>
        </div>
        <div class="is-hidden-mobile">{{ $t('Stakeholders') }}</div>
      </router-link>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Commands',
  computed: {
    obj () { return this.$store.state.context ? this.$store.state.context.object : null },
    files () { return ((this.$store.state.context || {}).newsAggrs || {}).files },
    messages () { return ((this.$store.state.context || {}).newsAggrs || {}).messages },
    activity () { return ((this.$store.state.context || {}).newsAggrs || {}).activity }
  },
  methods: {
    url (path) {
      let url = this.$url(this.obj)
      return url === '/' ? path : url + path
    }
  }
}
</script>

<style lang="sass" scoped>
@import '~bulma/sass/utilities/mixins'
.command
  cursor: pointer
  margin-bottom: 2em

.section
  @include mobile
    padding-left: 0.5rem
    padding-right: 0rem
</style>
