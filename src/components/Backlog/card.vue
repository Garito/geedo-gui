<template>
  <div class="card">
    <div class="card-content">
      <Media :obj="user" :imgSize="16" class="has-text-dark">
        <template v-slot>
          {{ user.name }}
          {{ { auth: $t('signed in'), updated: $t('updated'), dispatcher: $t('visited'), factory: $t('created'), remover: $t('removed') }[obj.aspect] }}
          <template v-if="obj.aspect !== 'auth'">{{ obj.runned_path }}</template> {{ $t('on') }}
          {{ new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'medium' }).format(new Date(obj.date * 1000)) }}
        </template>
      </Media>
    </div>
  </div>
</template>

<script>
const Media = () => import('@/components/User/media')

export default {
  name: 'BacklogCard',
  components: { Media },
  props: { obj: Object },
  computed: {
    locale () { return navigator.language || navigator.userLanguage },
    user () { return Object.values(this.$store.state.users).find(u => u.user === this.obj.email) }
  }
}
</script>
