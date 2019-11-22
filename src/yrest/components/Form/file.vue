<template>
  <div class="field">
    <label :for="name" class="label" :class="{ 'is-sr-only': sr_only }">{{ label }}</label>
    <slot>
      <div class="columns is-mobile">
        <div class="column">
          <div class="control">
            <div class="file is-boxed">
              <label class="file-label">
                <input class="file-input" type="file" :name="name" :accept="accept" :multiple="multiple" @change="input">
                <span class="file-cta">
                  <slot name="text">
                    <span class="file-icon"><FontAwesomeIcon icon="upload"></FontAwesomeIcon></span>
                    <span class="file-label">Choose a file…</span>
                  </slot>
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="columns">
        <div class="column" v-if="files.length">
          <div class="columns is-multiline is-mobile">
            <div class="column" v-for="file in files" :key="'preview' + file.name">
              <figure class="image">
                <img src="" :alt="'Preview for ' + file.name" :ref="file.name" />
              </figure>
            </div>
          </div>
        </div>
      </div>
    </slot>
    <p class="help" v-if="text">{{ text }}</p>
    <p class="help is-danger" v-if="error">
      <ul v-if="typeof error === List">
        <li v-for="(err, index) in error" :key="name + 'error' + index">{[ err }}</li>
      </ul>
      <template v-else>{{ error }}</template>
    </p>
  </div>
</template>

<script>
export default {
  name: 'FormFile',
  props: {
    name: String,
    label: String,
    sr_only: { type: Boolean, default: false },
    accept: String,
    multiple: Boolean,
    text: String,
    error: [String, Array]
  },
  data: () => ({ files: [] }),
  methods: {
    input (e) {
      this.files = []
      for (var file of e.target.files) {
        this.files.push(file)
      }
      this.$emit('input', e.target.files)
    }
  },
  watch: {
    async files (value) {
      await this.$nextTick()

      for (var file of value) {
        let preview = this.$refs[file.name][0]
        let reader = new FileReader()
        reader.addEventListener('load', () => {
          preview.src = reader.result
        })
        reader.readAsDataURL(file)
      }
    }
  }
}
</script>
