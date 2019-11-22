<template>
  <FormFile v-bind="{ ...$props, ...$attrs }" v-on="$listeners">
    <VueFileAgent v-model="theValue" @input="$emit('input', theValue)" :accept="accept" :multiple="multiple" :deletable="deletable"></VueFileAgent>
  </FormFile>
</template>

<script>
import { FormFile } from '@/yrest'

export default {
  name: 'FormFileAgent',
  components: { FormFile },
  props: {
    name: String,
    value: Array,
    label: String,
    sr_only: Boolean,
    required: Boolean,
    text: String,
    accept: String,
    multiple: Boolean,
    deletable: Boolean,
    placeholder: String,
    error: [String, Array]
  },
  data: () => ({ theValue: [] }),
  watch: {
    value (val) {
      this.theValue = val
    }
  }
}
</script>
