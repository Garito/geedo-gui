<template>
  <div class="field">
    <label :for="name" :class="labelClasses">
      {{ $t(label) }}
      <span class="has-text-danger" v-if="required">*</span>
    </label>

    <div :class="fieldClasses">
      <slot name="addOnLeft" v-bind:field="this"></slot>

      <div :class="controlClasses">
        <slot>
          <input :type="reveal === true ? 'text' : type" :value="value" :required="required" :class="widgetClasses" :placeholder="placeholder" :step="step" @keypress="$emit('keypress', $event)" @input="input" @focus="$emit('focus', $event)" @blur="$emit('blur', $event)" />
        </slot>
        <span class="icon is-small is-left" v-if="icons && icons.left">
          <FontAwesomeIcon :icon="icons.left"></FontAwesomeIcon>
        </span>
        <span class="icon is-small is-right" v-if="icons && icons.right">
          <FontAwesomeIcon :icon="icons.right"></FontAwesomeIcon>
        </span>
      </div>

      <slot name="addOnRight" v-bind:field="this"></slot>
    </div>

    <slot name="under-control"></slot>

    <p class="help" v-if="text">{{ $t(text) }}</p>

    <p class="help is-danger" v-if="error">
      <ul v-if="Array.isArray(error)">
        <li v-for="(err, index) in error" :key="name + 'error' + index">{{ err }}</li>
      </ul>
      <template v-else>{{ error }}</template>
    </p>
  </div>
</template>

<script>
export default {
  name: 'FormInput',
  props: {
    name: String,
    label: String,
    value: [String, Number],
    sr_only: { type: Boolean, default: false },
    type: { type: String, default: 'text' },
    required: Boolean,
    placeholder: String,
    step: Number,
    icons: Object,
    text: String,
    size: String,
    extraLabelClasses: String,
    extraFieldClasses: String,
    extraControlClasses: String,
    extraWidgetClasses: String,
    error: [String, Array]
  },
  data: () => ({ reveal: null }),
  computed: {
    labelClasses () {
      let classes = ['label']

      if (this.extraLabelClasses) {
        classes.push(this.extraLabelClasses)
      }

      if (this.sr_only) {
        classes.push('is-sr-only')
      }

      if (this.size) {
        classes.push('is-' + this.size)
      }

      return classes.join(' ')
    },
    fieldClasses () {
      let classes = ['field']
      if (this.extraFieldClasses) {
        classes.push(this.extraFieldClasses)
      }

      if (this.$scopedSlots.addOnLeft || this.$scopedSlots.addOnRight) {
        classes.push('has-addons')
      }

      return classes.join(' ')
    },
    controlClasses () {
      let classes = ['control']

      if (this.extraControlClasses) {
        classes.push(this.extraControlClasses)
      }

      if (this.icons) {
        if (this.icons.left) {
          classes.push('has-icons-left')
        }
        if (this.icons.right) {
          classes.push('has-icons-right')
        }
      }

      let slots = Object.keys(this.$scopedSlots)
      if (slots.includes('addOnLeft') || slots.includes('addOnRight')) {
        classes.push('is-expanded')
      }

      return classes.join(' ')
    },
    widgetClasses () {
      let classes = ['input']

      if (this.extraWidgetClasses) {
        classes.push(this.extraWidgetClasses)
      }

      if (this.error) {
        classes.push('is-danger')
      }

      if (this.size) {
        classes.push('is-' + this.size)
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
