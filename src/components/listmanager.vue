<template>
  <div class="list-manager">
    <slot name="nav">
      <div class="columns is-mobile" :class="[ (opId || schema) ? 'has-text-white has-background-grey': 'has-background-grey-light' ]">
        <div class="column is-expanded">
          <slot name="title"><h1 class="is-size-5">{{ title }}</h1></slot>
        </div>
        <slot name="nav-extra"></slot>
        <div class="column is-narrow" v-if="(opId && $store.getters.can(opId)) || schema">
          <slot name="addButton">
            <button class="button is-primary" type="button" :disabled="adding" @click="adding = true">{{ addBtnTitle }}</button>
          </slot>
        </div>
      </div>
    </slot>

    <slot name="under-nav"></slot>

    <div class="columns" v-if="(opId || schema) && adding">
      <div class="column">
        <div class="box">
          <slot name="addTitle" v-if="addTitle"><h2 class="subtitle">{{ addTitle }}</h2></slot>
          <slot name="form">
            <Form :name="formName" :schema="theSchema" :errors="$store.state.errors" @submit="data => $emit('input', data)" @input="$store.commit('setErrors', null)">
              <template v-slot>
                <slot name="form-layout"></slot>
              </template>

              <template v-slot:controls>
                <div id="controls" class="columns is-mobile">
                  <div class="column">
                    <button type="submit" class="button is-primary is-fullwidth">{{ submitBtnTitle }}</button>
                  </div>
                  <div class="column">
                    <button type="button" class="button is-fullwidth" @click="adding = false">{{ cancelBtn }}</button>
                  </div>
                </div>
              </template>
            </Form>
          </slot>
        </div>
      </div>
    </div>

    <slot name="under-form"></slot>

      <div class="items columns is-multiline" :class="{ 'adding': adding }">
        <slot name="list">
          <template v-for="item in items()">
            <slot :item="item">
              <div class="column is-flex" :key="item._id">{{ item }}</div>
            </slot>
          </template>
        </slot>
        <slot name="extra-items"></slot>
      </div>
    <slot name="extra-list"></slot>

    <slot name="noItems">
      <div class="hero is-halfheight is-light" v-if="(!items() || !items().length) && !adding">
        <div class="hero-body">
          <div class="container has-text-centered">
            <slot name="noItemsContent">
              <span class="subtitle">No items yet</span>
            </slot>
          </div>
        </div>
      </div>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'ListManager',
  props: {
    title: String,
    addTitle: String,
    addBtnTitle: { type: String, default: 'Add' },
    submitBtnTitle: { type: String, default: 'Add it' },
    cancelBtn: { type: String, default: 'Cancel' },
    schema: Object,
    opId: String,
    value: [Array, Object]
  },
  data: () => ({ adding: false }),
  computed: {
    theSchema () { return this.schema ? this.schema : this.$store.getters.schema(this.opId) },
    formName () { return (this.opId || 'Form').replace('/', '_').toLowerCase() }
  },
  methods: {
    items () { return Array.isArray(this.value) ? this.value : Object.values(this.value) },
    close (value = true) { this.adding = !value }
  },
  watch: {
    adding () { this.$store.commit('setErrors', null) }
  }
}
</script>

<style scoped>
.list.adding {
  opacity: .5;
}
</style>
