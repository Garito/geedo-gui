<template>
  <div class="field">
    <label :for="name" class="label" :class="{ 'is-sr-only': sr_only }">{{ label }}</label>
    <div class="control">
      <label class="radio" v-for="option in options" :key="option.value || option">
        <input type="radio" :name="name" :value="option.value || option" @change="$emit('input', $event.target.value)" />
        {{ option.label || option }}
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormRadio',
  props: {
    name: String,
    label: String,
    sr_only: { type: Boolean, default: false },
    options: Array,
    text: String,
    error: [String, Array]
  }
}
</script>
