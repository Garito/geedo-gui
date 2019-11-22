<template>
  <FormSelect v-bind="{ ...$props, ...$attrs }" v-on="$listeners">
    <Multiselect v-model="val" :options="options" :track-by="trackBy" :label="labelBy" :multiple="multiple" :searchable="searchable" :taggable="taggable" :allowEmpty="allowEmpty" :placeholder="placeholder" :close-on-select="!taggable" @input="plain" @tag="addTag">
      <template v-slot:singleLabel="props">
        <slot name="singleLabel" v-bind="props"></slot>
      </template>
      <template v-slot:option="props">
        <slot name="option" v-bind="props"></slot>
      </template>
    </Multiselect>
  </FormSelect>
</template>

<script>
import { FormSelect } from '@/yrest'
const Multiselect = () => import('vue-multiselect')

export default {
  name: 'FormMultiSelect',
  components: { FormSelect, Multiselect },
  props: {
    name: String,
    label: String,
    sr_only: { type: Boolean, default: false },
    value: [String, Array],
    options: Array,
    multiple: Boolean,
    searchable: { type: Boolean, default: true },
    taggable: Boolean,
    allowEmpty: { type: Boolean, default: true },
    required: Boolean,
    text: String,
    placeholder: String,
    withControls: Boolean,
    error: [String, Array]
  },
  data: () => ({ val: null, opts: null }),
  computed: {
    setVal () {
      if (this.opts && this.opts.length && this.opts[0].value) {
        if (this.multiple) {
          let values = this.value
          let vals = []
          for (var idx in values) {
            vals.push(this.opts.find(o => o.value === values[idx]))
          }
          return vals
        } else {
          let value = this.value
          return this.opts.find(o => o.value === value)
        }
      } else {
        return this.value
      }
    },
    labelBy () { return this.opts && this.opts.length && this.opts[0].label ? 'label' : null },
    trackBy () { return this.opts && this.opts.length && this.opts[0].value ? 'value' : null }
  },
  methods: {
    plain () {
      let val = this.val
      if (Array.isArray(val)) {
        if (val[0] && val[0].value) {
          val = this.val.map(v => v.value)
        }
      } else {
        if (val && val.value) {
          val = val.value
        }
      }

      this.$emit('input', val)
    },
    addTag (value) {
      if (this.labelBy) {
        let newOpt = { value: value, label: value }
        this.opts.push(newOpt)
        if (this.multiple) {
          if (!Array.isArray(this.val)) {
            this.val = []
          }
          this.val.push(newOpt)
        } else {
          this.val = newOpt
        }
      } else {
        this.opts.push(value)
        if (this.multiple) {
          if (!Array.isArray(this.val)) {
            this.val = []
          }
          this.val.push(value)
        } else {
          this.val = value
        }
      }
    }
  },
  created () { this.opts = this.options },
  mounted () { this.val = this.setVal }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
