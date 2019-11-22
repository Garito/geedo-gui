<template>
  <div class="card">
    <div class="card-image">
      <img :src="obj.content_type.startsWith('image') ? obj.stream : 'https://via.placeholder.com/150x150.png?text=' + obj.content_type.split('/').pop()" />
    </div>
    <div class="card-content">
      {{ name }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'FileCard',
  props: { name: String, obj: Object }
}
</script>
