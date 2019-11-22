<template>
  <router-link :to="$url(obj)" tag="div" class="media record">
    <div class="media-left">
      <Avatar :obj="leader" :imgSize="24">
        <template v-slot="{ obj }">{{ obj.name }}</template>
      </Avatar>
    </div>
    <div class="media-content">
      <h3 class="is-size-5">{{ obj.name }} <small>#{{ obj.code }}</small></h3>
    </div>
  </router-link>
</template>

<script>
const Avatar = () => import('@/components/User/avatar')

export default {
  name: 'RecordSearch',
  components: { Avatar },
  props: { obj: Object, leader: Object }
}
</script>
