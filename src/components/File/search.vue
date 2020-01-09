<template>
  <router-link :to="$url(obj) + '/files'" tag="div" class="media">
    <div class="media-left"><VueFileAgent :value="preview" /></div>
    <div class="media-content">
      <div class="content">
        <div class="is-size-5">{{ obj.filename.split('/').pop() }}</div>
        <div class="is-size-6">@ {{ obj.parent.name }}</div>
      </div>
    </div>
  </router-link>
</template>

<script>
const getFileSize = f => {
  let head = 'data:' + f.content_type + ';base64,'
  return Math.round((f.stream.length - head.length) * 3 / 4)
}

export default {
  name: 'FileSearch',
  props: { obj: Object },
  computed: {
    preview () {
      return { name: this.obj.filename.split('/').pop(), size: getFileSize(this.obj), type: this.obj.content_type, url: this.obj.stream }
    },
  }
}
</script>
