<template>
  <div class="card">
    <div class="card-content">
      <h3 class="subtitle">{{ obj.name }}</h3>
      <a :href="'mailto:' + obj.email" class="is-size-6">{{ obj.email }}</a>
    </div>
    <div class="card-footer">
      <a @click="$emit('send', obj)" class="card-footer-item">
        <span class="icon"><FontAwesomeIcon :icon="[ 'far' , 'paper-plane' ]"></FontAwesomeIcon></span>
        {{ $t('Send') }}
      </a>
      <a class="card-footer-item" v-clipboard:copy="link" v-clipboard:success="copied">
        <span class="icon"><FontAwesomeIcon icon="link"></FontAwesomeIcon></span>
        {{ $t('Get link') }}
      </a>
      <a @click="$emit('remove', obj)" class="card-footer-item">
        <span class="icon"><FontAwesomeIcon :icon="[ 'far' , 'trash-alt' ]"></FontAwesomeIcon></span>
        <span>{{ $t('Remove') }}</span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InvitationCard',
  props: { obj: Object },
  computed: {
    link () { return encodeURI(window.location.protocol + '//' + window.location.host + '/#/register?code=' + this.obj._id + '&email=' + this.obj.email) }
  },
  methods: {
    copied (e) {
      console.log(e)
    }
  }
}
</script>
