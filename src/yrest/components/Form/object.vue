<template>
  <div class="field">
    <label :for="name" class="label" :class="{ 'is-sr-only': sr_only }">{{ label }}</label>
    <div class="control">
      <slot></slot>
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
  name: 'FormObject',
  props: { name: String, label: String, sr_only: { type: Boolean, default: false }, text: String, error: [String, Array] }
}
</script>
