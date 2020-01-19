<template>
  <div class="columns">
    <div class="column is-12-mobile is-4-tablet is-offset-4-tablet">
      <div class="auth section">
        <h1 class="title">{{ $t('Sign in') }}</h1>
        <Form name="SignIn" :schema="$store.getters.schema(opId)" :callToAction="$t('Sign in')" :errors="$store.state.errors" @submit="submit" @input="$store.commit('setErrors', null)" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Auth',
  data: () => ({ opId: 'Root/auth' }),
  methods: {
    async submit (data) {
      if (await this.$store.dispatch('signIn', data)) {
        this.$router.push(this.$route.query.next || this.$url(this.$store.getters.actor))
      }
    }
  }
}
</script>
