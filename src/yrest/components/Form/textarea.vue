<template>
  <div class="field">
    <label :for="name" class="label" :class="{ 'is-sr-only': sr_only }">
      {{ $t(label) }}
      <span class="has-text-danger" v-if="required">*</span>
    </label>

    <div class="field">
      <div :class="ctrlClasses">
        <slot>
          <textarea :class="txtClasses" :required="required" :placeholder="placeholder" @input="$emit('input', $event.target.value)" :value="value">
          </textarea>
        </slot>
      </div>
    </div>

    <p class="help" v-if="text">{{ $t(text) }}</p>

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
  name: 'FormTextarea',
  props: {
    name: String,
    label: String,
    sr_only: { type: Boolean, default: false },
    value: String,
    required: Boolean,
    placeholder: String,
    text: String,
    error: [String, Array],
    controlClasses: String,
    textareaClasses: String
  },
  data: () => ({ reveal: null }),
  computed: {
    ctrlClasses () {
      let classes = [ 'control' ]
      if (this.controlClasses) {
        classes.concat(this.controlClasses.split(' '))
      }

      return classes.join(' ')
    },
    txtClasses () {
      let classes = [ 'textarea' ]
      if (this.textareaClasses) {
        classes.concat(this.textareaClasses.split(' '))
      }

      return classes.join(' ')
    }
  },
  methods: {
    toggleReveal () {
      this.reveal = !this.reveal
    },
    input (e) {
      if (this.type === 'integer') {
        this.$emit('input', parseInt(e.target.value))
      } else if (this.type === 'number') {
        this.$emit('input', parseFloat(e.target.value))
      } else {
        this.$emit('input', e.target.value)
      }
    }
  },
  created () {
    if (this.type === 'password') {
      this.reveal = false
    }
  }
}
</script>
