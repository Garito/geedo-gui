<template>
  <div class="field">
    <div class="control">
      <label class="checkbox">
        <template v-if="pre">{{ label }}&nbsp;</template>
        <input type="checkbox" @change="$emit('input', $event.target.checked)" />
        <template v-if="!pre">&nbsp;{{ label }}</template>
      </label>
    </div>
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
  name: 'FormCheckbox',
  props: { name: String, label: String, pre: { type: Boolean, default: false }, text: String, error: [String, Array] }
}
</script>
