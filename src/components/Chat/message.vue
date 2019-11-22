<template>
  <article class="media">
    <figure class="media-left" :alt="message.user" :title="message.user">
      <p class="image is-32x32">
        <FontAwesomeIcon :icon="[ 'far', 'user-circle' ]" size="lg"></FontAwesomeIcon>
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <p>{{ message.message }}</p>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  name: 'ChatMessage',
  props: { message: Object }
}
</script>
