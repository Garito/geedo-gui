<template>
  <div class="auth section">
    <h1 class="title">{{ $t('Sign in') }}</h1>
    <Form name="SignIn" :schema="$store.getters.schema(opId)" :callToAction="$t('Sign in')" :errors="$store.state.errors" @submit="submit" @input="$store.commit('setErrors', null)" />
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
