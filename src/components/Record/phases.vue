<template>
  <div class="phases columns">
    <div class="column is-expanded" :class="{ 'has-text-centered': !Object.keys(phases).length }">
      <ul class="steps" v-if="Object.keys(phases).length || adding">
        <li class="steps-segment" :class="{ 'is-active': idx === (toComplete - 1) || toComplete === 0 }" v-for="([slug, phase], idx) in Object.entries(phases)" :key="slug">
          <span class="steps-marker">
            <span class="icon" v-if="toComplete === idx">
              <a class="has-text-grey" @click="$emit('finished', slug)">
                <FontAwesomeIcon :icon="[ 'far', 'check-circle' ]" class="finisher"></FontAwesomeIcon>
              </a>
            </span>
          </span>
          <div class="steps-content">
            <p class="is-size-5">
              <span class="icon" v-if="!phase.finished && !adding">
                <a @click="$emit('removed', slug)">
                  <FontAwesomeIcon :icon="[ 'far', 'trash-alt' ]" size="xs"></FontAwesomeIcon>
                </a>
              </span>
              {{ phase.name }}
            </p>
          </div>
        </li>
        <li class="steps-segment" v-if="adding">
          <span class="steps-marker"></span>
          <div class="steps-content">
            <div class="columns is-fullwidth is-gapless">
              <div class="column is-expanded">
                <FormInput v-model="newPhase" name="phase" label="New phase" :sr_only="true" type="text" :required="true" />
              </div>
              <div class="column is-narrow">
                <div>
                  <a @click="adding = false"><FontAwesomeIcon :icon="[ 'far', 'times-circle' ]"></FontAwesomeIcon></a>
                </div>
                <div>
                  <a @click="$emit('added', newPhase)">
                    <FontAwesomeIcon :icon="[ 'far', 'check-circle' ]"></FontAwesomeIcon>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <span class="has-text-grey" v-if="!Object.keys(phases).length && !adding">
        {{ $t('No phases defined. Click the plus icon to add the 1st one') }}
      </span>
    </div>
    <div class="column is-narrow" v-if="!adding">
      <a @click="adding = true"><FontAwesomeIcon icon="plus"></FontAwesomeIcon></a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecordPhases',
  props: { phases: Object },
  data: () => ({ adding: false, newPhase: '' }),
  computed: {
    toComplete () { return Object.values(this.phases).findIndex(p => !Object.keys(p).includes('finished')) }
  },
  methods: {
    close () {
      this.newPhase = ''
      this.adding = false
    }
  }
}
</script>

<style lang="sass" scoped>
@import '@/assets/_variables.sass';
$steps-completed-color: $record;
$steps-active-color: $record;
@import '~bulma/bulma'
@import '~bulma-steps-component/bulma-steps'

.finisher:hover
  color: $primary
</style>
