<template>
  <div class="section">
    <template v-if="obj">
      <router-link to="/add" tag="div" class="command has-text-centered color-white">
        <div class="icon">
          <FontAwesomeIcon :icon="[ 'far', 'plus-square']" :style="{ color: 'white' }" size="2x"></FontAwesomeIcon>
        </div>
        <div class="is-hidden-mobile">{{ $t('Add') }}</div>
      </router-link>
      <router-link to="/files" tag="div" class="command has-text-centered color-white">
        <div class="icon" :data-badge="newsAggrs.files || null">
          <FontAwesomeIcon :icon="[ 'far', 'file']" :style="{ color: 'white' }" size="2x"></FontAwesomeIcon>
        </div>
        <div class="is-hidden-mobile">{{ $t('Files') }}</div>
      </router-link>
      <!-- <router-link to="/backlog" tag="div" class="command has-text-centered">
        <div class="icon" :data-badge="newsAggrs.activity || null">
          <FontAwesomeIcon :icon="[ 'far', 'bell']" size="2x"></FontAwesomeIcon>
        </div>
        <div class="is-hidden-mobile">{{ $t('Activity') }}</div>
      </router-link>
      <router-link to="/chats" tag="div" class="command has-text-centered">
        <div class="icon" :data-badge="newsAggrs.messages || null">
          <FontAwesomeIcon :icon="[ 'far', 'comment-alt']" size="2x"></FontAwesomeIcon>
        </div>
        <div class="is-hidden-mobile">{{ $t('Chats') }}</div>
      </router-link>
      <router-link to="/users" tag="div" class="command has-text-centered">
        <div class="icon">
          <FontAwesomeIcon icon="users" size="2x"></FontAwesomeIcon>
        </div>
        <div class="is-hidden-mobile">{{ $t('Users') }}</div>
      </router-link> -->
      <router-link to="/permissions" tag="div" class="command has-text-centered color-white">
        <div class="icon">
          <FontAwesomeIcon icon="shield-alt" :style="{ color: 'white' }" size="2x"></FontAwesomeIcon>
        </div>
        <div class="is-hidden-mobile">{{ $t('Permissions') }}</div>
      </router-link>
      <router-link to="/roles" tag="div" class="command has-text-centered color-white">
        <div class="icon">
          <FontAwesomeIcon icon="user-shield" :style="{ color: 'white' }" size="2x"></FontAwesomeIcon>
        </div>
        <div class="is-hidden-mobile">{{ $t('Roles') }}</div>
      </router-link>
    </template>
  </div>
</template>

<script>
export default {
  name: 'MainMenu',
  computed: {
    obj () { return this.$store.state.context ? this.$store.state.context.object : null },
    newsAggrs () { return this.$store.state.context.globalNewsAggrs || {} }
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
