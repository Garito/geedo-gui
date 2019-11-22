<template>
  <div class="project files section">
    <div v-if="loading">{{ $t('Loading') }}...</div>
    <template v-else>
      <div class="columns">
        <div class="column">
          <h1 class="title project">
            <span class="has-text-grey-dark is-size-6">Fitxers de</span>
            {{ project.name }}
            <!-- {{ $t('filesTitle', { project: project.name }) }} -->
          </h1>
          <div class="notification has-text-centered" v-if="!filesLoaded">{{ $t('Loading files') }}...</div>
          <div class="columns is-multiline">
            <div class="column is-flex" v-for="(preview, idx) in previews" :key="'preview' + idx">
              <VueFileAgent :value="preview" :deletable="true" :helpText="$t('Choose files or drag & drop here')" />
            </div>
          </div>
          <FormFile v-model="data" name="files" label="Files" :sr_only="true" :multiple="true" :deletable="true"></FormFile>
          <div class="control"><button class="button is-fullwidth" type="button" @click="upload">{{ $t('Upload files') }}</button></div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => resolve(reader.result)
  reader.onerror = error => reject(error)
})

const getFileSize = f => {
  let head = 'data:' + f.content_type + ';base64,'
  return Math.round((f.stream.length - head.length) * 3 / 4)
}

export default {
  name: 'ProjectFiles',
  data: () => ({ opId: 'Project/call', data: null, filesLoaded: false }),
  computed: {
    project () { return this.$store.state.context.object },
    loading () { return !this.project || this.project.type !== 'Project' },
    files () { return this.$store.state.context.files },
    previews () {
      return Object.entries(this.files).map(([n, f]) => ({
        name: n.split('/').pop(),
        size: getFileSize(f),
        type: f.content_type,
        url: f.stream
      }))
    }
  },
  methods: {
    async upload () {
      let data = []
      for (var file of this.data) {
        data.push({ name: file.name(), content_type: file.type, data: await toBase64(file.file) })
      }
      let result = await this.$store.dispatch('api', { opId: 'Project/upload_files', data: { files: data } })
      let rjson = await result.json()
      if (result.ok) {
        let ctx = this.$store.state.context
        ctx.files = Object.assign({}, ctx.files, rjson.result)
        this.$store.commit('setContext', ctx)
        this.data = []
      }
    }
  },
  watch: {
    data (val) {
      if (typeof val === 'object' && !Array.isArray(val)) {
        this.data = [val]
      }
    }
  },
  async created () {
    await this.$store.dispatch('load', { opId: 'Project/get_files', name: 'files' })
    this.filesLoaded = true
  }
}
</script>
