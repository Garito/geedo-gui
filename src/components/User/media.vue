<template>
  <div class="media">
    <div class="media-left">
      <slot name="left" :obj="obj" :imgSize="imgSize"><Avatar :obj="obj" :imgSize="imgSize" /></slot>
    </div>
    <div class="media-content">
      <slot :obj="obj"></slot>
    </div>
    <div class="media-right" v-if="$scopedSlots.right">
      <slot name="right" :obj="obj"></slot>
    </div>
  </div>
</template>

<script>
const Avatar = () => import('./avatar')

export default {
  name: 'UserMedia',
  components: { Avatar },
  props: { obj: Object, imgSize: { type: Number, default: 64 } }
}
</script>
