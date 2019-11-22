<template>
  <div class="user avatar">
    <slot name="pre-image" :obj="obj" :imgSize="imgSize"></slot>
    <figure :class="imgClass">
      <img :src="obj.avatar" :alt="obj.name + '\' avatar image'" v-if="obj.avatar" />
      <FontAwesomeIcon :icon="[ 'far', 'user-circle' ]" class="has-text-grey-light" v-else></FontAwesomeIcon>
    </figure>
    <slot :obj="obj"></slot>
  </div>
</template>

<script>
export default {
  name: 'UserAvatar',
  props: { obj: Object, imgSize: { type: Number, default: 32 }, imgExtraClass: { type: String, default: '' } },
  computed: {
    imgClass () { return 'image is-' + this.imgSize + 'x' + this.imgSize + (this.imgExtraClass ? ' ' : '') + this.imgExtraClass }
  }
}
</script>
