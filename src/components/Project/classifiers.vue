<template>
  <div class="level">
    <div class="level-item" v-if="obj.areas.length">
      <div>
        <p class="heading">{{ $t('Areas') }}</p>
        <span class="tags">
          <span class="tag" v-for="area in obj.areas" :key="obj._id + 'area' + area">{{ area }}</span>
        </span>
      </div>
    </div>
    <div class="level-item" v-if="obj.themes.length">
      <div>
        <p class="heading">{{ $t('Themes') }}</p>
        <span class="tags">
          <span class="tag" v-for="theme in obj.themes" :key="obj._id + 'theme' + theme">{{ theme }}</span>
        </span>
      </div>
    </div>
    <div class="level-item" v-if="obj.tags.length">
      <div>
        <p class="heading">{{ $t('Tags') }}</p>
        <span class="tags">
          <span class="tag" v-for="tag in obj.tags" :key="obj._id + 'tag' + tag">{{ tag }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ProjectClassifiers',
    props: { obj: Object }
  }
</script>
