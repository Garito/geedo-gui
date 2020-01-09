<template>
  <article class="media">
    <Avatar class="media-left" :username="message.user" :size="30" />
    <div class="media-content">
      <div class="content">
        <p>{{ message.message }}</p>
      </div>
    </div>
  </article>
</template>

<script>
const Avatar = () => import('vue-avatar')

export default {
  name: 'ChatMessage',
  components: { Avatar },
  props: { message: Object }
}
</script>
