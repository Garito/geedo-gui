<template>
  <div class="field">
    <label :for="name" class="label" :class="{ 'is-sr-only': sr_only }">
      {{ $t(label) }}
      <span class="has-text-danger" v-if="required">*</span>
    </label>
    <div class="control">
      <slot>
        <div :class="selectClasses">
          <select :name="name" :required="required" :multiple="multiple" @change="input">
            <option v-for="option in options" :key="option.value || option" :value="option.value || option" :selected="isSelected(option)">
              {{ option.label || option }}
            </option>
          </select>
        </div>
      </slot>
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
  name: 'FormSelect',
  props: {
    name: String,
    label: String,
    sr_only: { type: Boolean, default: false },
    value: [String, Array],
    options: { type: Array, default: () => [] },
    multiple: Boolean,
    required: Boolean,
    text: String,
    error: [String, Array]
  },
  computed: {
    selectClasses () {
      let classes = ['select']
      if (this.multiple) {
        classes.push('is-multiple')
      }
      return classes.join(' ')
    }
  },
  methods: {
    input (e) {
      this.$emit('input', e.target.options[e.target.selectedIndex].value)
    },
    isSelected (option) {
      let optionValue = option.value || option
      return ((Array.isArray(this.value) && this.value.includes(optionValue)) || optionValue === this.value)
    }
  }
}
</script>
