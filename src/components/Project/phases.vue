<template>
  <div class="phases columns">
    <div class="column is-expanded" :class="{ 'has-text-centered': !Object.keys(phases).length }">
      <ul class="steps" v-if="Object.keys(phases).length || adding">
        <li class="steps-segment" :class="{ 'is-active': idx === (toComplete - 1) || toComplete === 0 }" v-for="([slug, phase], idx) in Object.entries(phases)" :key="slug">
          <span class="steps-marker">
            <span class="icon" v-if="toComplete === idx">
              <a class="has-text-grey" @click="$emit('finished', slug)">
                <FontAwesomeIcon :icon="[ 'far', 'check-circle' ]" :style="{ color: 'white' }" class="finisher"></FontAwesomeIcon>
              </a>
            </span>
          </span>
          <div class="steps-content">
            <div class="tag is-size-5">
              <span class="icon" v-if="!phase.finished && !adding">
                <a @click="$emit('removed', slug)">
                  <FontAwesomeIcon :icon="[ 'far', 'trash-alt' ]" size="xs" :style="{ color: 'red' }"></FontAwesomeIcon>
                </a>
              </span>
              &nbsp; {{ phase.name }}
            </div>
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
                <div class="columns is-gapless">
                  <div>
                    <a @click="adding = false"><FontAwesomeIcon :icon="[ 'far', 'times-circle' ]" size="2x" :style="{ color: 'red' }"></FontAwesomeIcon></a>
                  </div>
                  <div>
                    <a @click="$emit('added', newPhase)">
                      <FontAwesomeIcon :icon="[ 'far', 'check-circle' ]" size="2x" :style="{ color: 'green' }"></FontAwesomeIcon>
                    </a>
                  </div>
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
      <a @click="adding = true"><FontAwesomeIcon icon="plus" :style="{ color: 'green' }" size="2x"></FontAwesomeIcon></a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectPhases',
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

<style lang="scss" scoped>
@import '@/assets/_variables.sass';
$steps-completed-color: $project;
$steps-active-color: $project;
@import '~bulma/bulma.sass';
@import '~bulma-steps-component/bulma-steps.sass';

.finisher:hover {
  color: $primary;
}
</style>
