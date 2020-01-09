<template>
  <div class="tabs" :class="obj.type.toLowerCase()">
    <ul>
      <li :class="{ 'is-active' : active === 'info' }">
        <router-link :to="$url(obj)">
          <div class="icon" :data-badge="stats.info || null">
            <FontAwesomeIcon icon="info" size="2x"></FontAwesomeIcon>
          </div>
          <div>{{ $t('Info') }}</div>
        </router-link>
      </li>
      <li :class="{ 'is-active' : active === 'files' }">
        <router-link :to="$url(obj) + '/files'">
          <div class="icon" :data-badge="stats.files || null">
            <FontAwesomeIcon :icon="[ 'far', 'file']" size="2x"></FontAwesomeIcon>
          </div>
          <div>{{ $t('Files') }}</div>
        </router-link>
      </li>
      <li :class="{ 'is-active' : active === 'backlog' }">
        <router-link :to="$url(obj) + '/backlog'">
          <div class="icon" :data-badge="stats.activity || null">
            <FontAwesomeIcon :icon="[ 'far', 'bell']" size="2x"></FontAwesomeIcon>
          </div>
          <div>{{ $t('Activity') }}</div>
        </router-link>
      </li>
      <li :class="{ 'is-active' : active === 'chat' }">
        <router-link :to="$url(obj) + '/chat'">
          <div class="icon" :data-badge="stats.messages || null">
            <FontAwesomeIcon :icon="[ 'far', 'comment-alt']" size="2x"></FontAwesomeIcon>
          </div>
          <div>{{ $t('Chat') }}</div>
        </router-link>
      </li>
      <li :class="{ 'is-active' : active === 'stakeholders' }">
        <router-link :to="$url(obj) + '/stakeholders'">
          <div class="icon" :data-badge="stats.stakeholders || null">
            <FontAwesomeIcon icon="user-shield" size="2x"></FontAwesomeIcon>
          </div>
          <div>{{ $t('Stakeholders') }}</div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ProjectMenu',
  props: { active: { type: String, default: 'info' }, obj: Object, stats: { type: Object, default: () => ({}) } }
}
</script>

<style scoped>
.icon {
  padding-right: 1rem;
}
</style>
