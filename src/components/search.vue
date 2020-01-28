<template>
  <div class="search" ref="searchBox">
    <FormInput name="search" class="is-marginless" label="Search box" v-model="search" sr_only type="search" :icons="{ left: 'search' }" @focus="searching" @blur="unsearching" ref="search">
      <template v-slot:addOnRight>
        <button class="button" type="button">
          <span class="icon is-small" :class="{ 'has-text-grey': !start_date && !end_date }" @click="ranging = !ranging">
            <FontAwesomeIcon :icon="[ 'far', 'calendar-alt' ]"></FontAwesomeIcon>
          </span>
          <FontAwesomeIcon :icon="[ 'far', 'times-circle' ]" size="xs" v-if="start_date" @click="resetDates"></FontAwesomeIcon>
        </button>
      </template>
    </FormInput>
    <div class="dropdown is-active" :class="{ 'is-right searchResults': !mini }" v-if="ranging">
      <div class="dropdown-menu">
        <div class="dropdown-content">
          <div class="dropdown-item">
            <FormInput name="start_date" type="date" :label="$t('Start date')" v-model="start_date" />
            <FormInput name="end_date" type="date" :label="$t('End date')" v-model="end_date" />
            <button class="button is-fullwidth" type="button" @click="searchQuery">{{ $t('Search') }}</button>
          </div>
        </div>
      </div>
    </div>
    <template v-if="!mini">
      <div class="dropdown is-active searchResults is-right" v-if="(search || start_date || end_date) && !founded.length && on_searching">
        <div class="dropdown-menu">
          <div class="dropdown-content">
            <div class="dropdown-item">{{ $t('No results') }}</div>
          </div>
        </div>
      </div>
      <div class="dropdown is-active searchResults is-right" v-if="founded.length">
        <div class="dropdown-menu">
          <div class="dropdown-content">
            <a class="dropdown-item" :class="hit.type" v-for="hit in founded" :key="hit._id">
              <ProjectSearch :obj="hit" :leader="getLeader(hit)" v-if="hit.type === 'Project'" />
              <RecordSearch :obj="hit" :leader="getLeader(hit)" v-else-if="hit.type === 'Record'" />
              <template v-else-if="Object.keys(hit).includes('filename') && Object.keys(filesFounded).includes(hit.filename)">
                <FileSearch :obj="filesFounded[hit.filename]" />
              </template>
            </a>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
const ProjectSearch = () => import('@/components/Project/search')
const RecordSearch = () => import('@/components/Record/search')
const FileSearch = () => import('@/components/File/search')

export default {
  name: 'Search',
  components: { ProjectSearch, RecordSearch, FileSearch },
  props: { mini: { type: Boolean, default: false } },
  data: () => ({
    search: '',
    founded: [],
    filesFounded: {},
    on_searching: false,
    ranging: false,
    start_date: null,
    end_date: null
  }),
  mounted () {
    document.addEventListener(`click`, this.onClickOutside);
  },
  methods: {
    onClickOutside (evt) {
      const { searchBox } = this.$refs
      if (!searchBox || searchBox.contains(evt.target)) return
      this.ranging = false
      this.search = ''
      this.founded = {}
    },
    getLeader (hit) {
      let url = this.$url(hit)
      return Object.values(this.$store.state.users).find(u => u.roles.includes('owner@' + url))
    },
    searching () {
      this.ranging = false
      this.on_searching = true
    },
    unsearching () {
      this.on_searching = false
    },
    resetDates () {
      this.start_date = null
      this.end_date = null
      this.searchQuery()
    },
    async searchQuery () {
      if ((this.search === null || this.search === '') && this.start_date === null && this.end_date === null) {
        this.founded = []
      } else {
        let data = {}
        if (this.search.length > 1) {
          data.search = this.search
        }
        if (this.start_date) {
          data.start_date = this.start_date
        }
        if (this.end_date) {
          data.end_date = this.end_date
        }

        if (Object.keys(data).length) {
          let result = await this.$store.dispatch('api', { opId: 'Root/search', data: data })
          let rjson = await result.json()
          if (result.ok) {
            this.founded = rjson.result.hits.map(h => {
              if (h._source.filename) {
                this.askFile(h._source.filename)
              }
              return h._source
            })
            this.ranging = false
            this.$refs.search.$el.querySelector('input').focus()
          }
        }
      }
      if (this.mini) {
        this.$emit('searched', this.founded)
      }
    },
    async askFile (filename) {
      let opts = {
        opId: 'Root/search_file',
        data: { filename: filename }
      }
      let result = await this.$store.dispatch('api', opts)
      if (result.ok) {
        let rjson = await result.json()
        this.filesFounded[filename] = rjson.result
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    async search () { this.searchQuery() },
    ranging (val) {
      if (val) {
        this.founded = []
      }
    }
  }
}
</script>
