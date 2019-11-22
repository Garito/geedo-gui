<template>
  <form :id="name" @submit.prevent="submit" ref="form">
    <div class="notification is-danger" v-if="errors && errors._message">{{ errors._message }}</div>
    <slot></slot>
    <template v-if="loaded">
      <template v-for="[pName, schema] in fields">
        <slot :name="pName" :form-name="name" :schema="schema" :data="data[pName]" :attrs="fieldAttrs(pName, schema)">
          <component :key="name + pName" :is="component(schema)" v-bind="fieldAttrs(pName, schema)" :ref="pName" v-model="data[pName]" @input="data => $emit('input', { name: pName, data: data})">
            <template v-slot:addOnRight="{ field }" v-if="schema.format === 'password'">
              <div class="control">
                <button class="button has-text-grey" type="button" @click="field.toggleReveal()">
                  <FontAwesomeIcon :icon="[ 'far', field.reveal ? 'eye-slash' : 'eye' ]"></FontAwesomeIcon>
                </button>
              </div>
            </template>
          </component>
        </slot>
      </template>

      <slot name="postForm"></slot>

      <slot name="controls">
        <button id="controls" type="submit" class="button is-primary is-fullwidth">{{ callToAction || 'Save' }}</button>
      </slot>
    </template>
    <div v-else>Loading...</div>
  </form>
</template>

<script>
export default {
  name: 'Form',
  props: {
    name: String,
    schema: Object,
    form: { type: String, default: 'x-form' },
    value: Object,
    callToAction: String,
    noLabels: Boolean,
    errors: Object
  },
  data: () => ({ loaded: false, data: {} }),
  computed: {
    fields () {
      let schema = this.schema
      if (Object.keys(schema).includes(this.form)) {
        return schema[this.form].map(f => [f, schema.properties[f]])
      } else {
        return Object.entries(schema.properties)
      }
    }
  },
  methods: {
    component (schema) {
      if (schema.type === 'boolean') {
        return 'FormCheck'
      } else if (schema.type === 'array') {
        return 'FormSelect'
      } else if (schema.type === 'object') {
        return 'FormObject'
      } else if (schema.type === 'string' && schema.format === 'byte') {
        return 'FormFile'
      } else if (schema.type === 'string' && schema.Enum) {
        if (schema.Enum.length > 6) {
          return 'FormSelect'
        } else {
          return 'FormRadios'
        }
      } else if (schema.type === 'string' && schema.maxLength > 50) {
        return 'FormTextarea'
      } else if (schema.type === 'string' && schema['x-format'] === 'GeoAddress' && this.$options.components.FormGeoAddress) {
        return 'FormGeoAddress'
      }

      return 'FormInput'
    },
    fieldAttrs (name, schema) {
      let attrs = { name: name }
      if (this.noLabels) {
        attrs.sr_only = true
      }
      attrs['label'] = schema['x-label'] || name

      if (schema.title) {
        attrs.text = schema.title
      }

      if (schema['x-placeholder']) {
        attrs.placeholder = schema['x-placeholder']
      }

      if (schema.type === 'string') {
        if (schema.format) {
          if (schema.format === 'date-time') {
            attrs.type = 'datetime-local'
          } else {
            attrs.type = schema.format
          }
          switch (schema.format) {
            case 'email':
              attrs.icons = { left: [ 'far', 'envelope' ] }
              break
            case 'password':
              attrs.icons = { left: 'lock' }
              break
            case 'url':
              attrs.icons = { left: 'link' }
              break
            default:
              break
          }
          if (schema.format === 'byte') {
            if (schema['x-accept']) {
              attrs.accept = schema['x-accept']
            }
            if (schema['x-multiple']) {
              attrs.multiple = schema['x-multiple']
            }
            if (schema['x-deletable']) {
              attrs.deletable = schema['x-deletable']
            }
          }
        } else {
          attrs.type = 'text'
        }
        if (schema.Enum) {
          attrs.options = schema.Enum
        }
      } else if (schema.type === 'number') {
        attrs.type = 'number'
        attrs.step = 0.1
      } else if (schema.type === 'integer') {
        attrs.type = 'number'
      } else if (schema.type === 'boolean') {
        if (schema['x-pre']) {
          attrs['pre'] = true
        }
      } else if (schema.type === 'array') {
        attrs.multiple = true
        attrs.options = schema['x-options'].result || []
        if (schema['x-options'].searchable) {
          attrs.searchable = true
        }
        if (schema['x-options'].taggable) {
          attrs.taggable = true
        }
      }

      if (this.schema.required && this.schema.required.includes(name)) {
        attrs.required = true
      }

      if (schema['x-size']) {
        attrs.size = schema['x-size']
      }

      if (schema['x-icons']) {
        attrs.icons = schema['x-icons']
      }

      if (schema['x-attrs']) {
        attrs = Object.assign(attrs, schema['x-attrs'])
      }

      return attrs
    },
    submit () {
      let data = Object.fromEntries(Object.entries(this.data).filter(([key, value]) => value !== null))
      // We must validate the data before submit it to avoid server roundtrips
      this.$emit('submit', data)
    },
    spread () {
      let layout = document.getElementById(this.name + '_layout')
      if (layout) {
        for (var name of Object.keys(this.schema.properties)) {
          let el = layout.querySelector('#' + name)
          if (el && this.$refs[name]) {
            el.appendChild(this.$refs[name][0].$el)
          }
        }
        let controls = document.getElementById('controls')
        let ctrlsLayout = layout.querySelector('#controls_here')
        if (controls && ctrlsLayout) {
          ctrlsLayout.appendChild(controls)
        }
      }
    }
  },
  async mounted () { this.spread() },
  async updated () { this.spread() },
  async created () {
    if (this.value) {
      this.data = this.value
    }

    for (var [name, prop] of Object.entries(this.schema.properties)) {
      if (Object.keys(prop).includes('x-options') && !Object.keys(prop['x-options']).includes('result')) {
        let result = await this.$store.dispatch('api', { opId: prop['x-options'].opId })
        if (result && result.ok) {
          let rjson = await result.json()
          if (Object.keys(prop['x-options']).includes('label')) {
            let label = prop['x-options'].label
            let value = prop['x-options'].value
            prop['x-options'].result = Object.values(rjson.result).map(el => ({ value: el[value], label: el[label] }))
          } else {
            prop['x-options'].result = rjson.result
          }
        }
      }
      this.data[name] = this.data[name] || null
    }
    this.loaded = true
  }
}
</script>
