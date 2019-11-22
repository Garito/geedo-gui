<template>
  <div class="project card has-badge-large has-badge-project" :data-badge="obj.fileStats">
    <div class="card-content">
      <div class="container">
        <div class="columns">
          <div class="column">
            <router-link :to="$url(obj)" class="is-size-5 project">
              <div>
                <span class="has-text-grey-dark is-size-6">Projecte:</span>&nbsp;
                <span>{{ obj.name }}</span>
              </div>
              <div>
                <span class="has-text-grey-dark is-size-6">Codi:</span>&nbsp;
                <span class="is-size-6">{{ obj.code }}</span>
              </div>
            </router-link>
          </div>
        </div>

        <!-- <div class="level">
          <span class="level-item">{{ new Intl.DateTimeFormat(locale).format(new Date(obj.record)) }}</span>
          <span class="level-item">{{ new Intl.DateTimeFormat(locale).format(new Date(obj.deadline)) }}</span>
        </div> -->

        <div class="columns">
          <div class="column">
            <progress class="progress project" :value="obj.phaseStats.finished" :max="obj.phaseStats.total" />
          </div>
        </div>
        <div class="columns">
          <div class="column">{{ owner.name }}</div>
        </div>
        <!-- <div class="columns">
          <div class="column">
            <span class="tag project">
              <span class="icon"><FontAwesomeIcon :icon="[ 'far', 'file' ]"></FontAwesomeIcon></span>
              <span>{{ obj.fileStats }}</span>
            </span>
          </div>
        </div> -->
        <!-- <div class="columns">
          <div class="column"> -->
            <!-- <div class="level">
              <div class="level-item"> -->
                <!-- <UserMedia :obj="owner" :imgSize="16">
                  <template v-slot="{ obj }">
                    <router-link :to="$url(owner)" class="project">{{ obj.name }}</router-link>
                  </template>
                </UserMedia> -->
               <!-- <span>{{ owner.name }}</span>
              </div>
              <div class="level-item">
                <span class="tag project">
                  <span class="icon"><FontAwesomeIcon :icon="[ 'far', 'file' ]"></FontAwesomeIcon></span>
                  <span>{{ obj.fileStats }}</span>
                </span>
              </div>
            </div> -->
          <!-- </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
const UserMedia = () => import('@/components/User/media')

export default {
  name: 'ProjectCard',
  components: { UserMedia },
  props: { obj: Object },
  computed: {
    owner () { return Object.values(this.$store.state.users).find(u => u.roles.includes('owner@' + this.$url(this.obj))) }
  }
}
</script>
