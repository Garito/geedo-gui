<template>
  <div class="group files section">
    <div v-if="loading">{{ $t('Loading') }}...</div>
    <template v-else>
      <div class="columns">
        <div class="column">
          <h1 class="title has-text-primary">{{ $t('filesTitle', { project: obj.name }) }}</h1>
          <div class="notification has-text-centered" v-if="!filesLoaded">{{ $t('Loading files') }}...</div>
          <template v-else>
            <div class="columns" v-for="project in Object.values(this.files_by_project)" :key="project.obj._id">
              <div class="column">
                <h2 class="subtitle">
                  <router-link :to="$url(project.obj) + '/files'" :class="project.obj.type.toLowerCase()">
                    {{ project.obj.name }}
                  </router-link>
                </h2>
                <div class="columns is-multiline">
                  <div class="column is-flex" v-for="file in Object.entries(project.files)" :key="file[0]">
                    <div>
                      <div class="columns">
                        <div class="column">
                          <VueFileAgent :value="preview(file)" :deletable="true" />
                        </div>
                      </div>
                      <div class="columns has-text-centered">
                        <div class="column is-size-4">
                          <a @click="download(preview(file))">
                            <span class="icon"><FontAwesomeIcon icon="cloud-download-alt"></FontAwesomeIcon></span>
                          </a>
                        </div>
                        <div class="column is-size-4">
                          <a :href="'mailto:?subject=' + encodeURIComponent($t(project.obj.type + 'sFileSubject', { name: project.obj.name })) + '&body=' + encodeURIComponent($t('FileBody', { url: 'http://example.com' }))">
                            <span class="icon">
                              <FontAwesomeIcon :icon="[ 'far' , 'paper-plane' ]"></FontAwesomeIcon>
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
const getFileSize = f => {
  let head = 'data:' + f.content_type + ';base64,'
  return Math.round((f.stream.length - head.length) * 3 / 4)
}

export default {
  name: 'GroupFiles',
  data: () => ({ opId: 'Root/files_by_project', filesLoaded: false }),
  computed: {
    obj () { return this.$store.state.context.object },
    loading () { return !this.obj || this.obj.type !== 'Group' },
    files_by_project () { return this.$store.state.context.files_by_project }
  },
  methods: {
    preview ([name, file]) { return { name: name.split('/').pop(), size: getFileSize(file), type: file.content_type, url: file.stream } },
    download (file) {
      let link = document.createElement('a')
      link.href = file.url
      link.setAttribute('download', file.name)
      link.click()
    }
  },
  async created () {
    await this.$store.dispatch('load', { opId: this.opId, name: 'files_by_project' })
    this.filesLoaded = true
  }
}
</script>
