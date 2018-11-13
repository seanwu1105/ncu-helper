<template>
  <v-list-tile @click=";">
    <v-list-tile-content @click.prevent="setting = !setting">
        <v-list-tile-title>{{ title }}</v-list-tile-title>
        <v-list-tile-sub-title>
          <slot></slot>
        </v-list-tile-sub-title>
    </v-list-tile-content>
    <v-list-tile-action>
        <v-switch v-model="setting"></v-switch>
    </v-list-tile-action>
  </v-list-tile>
</template>

<script>
export default {
  name: 'switch-option',
  props: {
    title: String,
    storageKey: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      setting: true
    }
  },
  watch: {
    setting (newVal) {
      const key = this.storageKey
      chrome.storage.sync.set({ [key]: newVal })
    }
  },
  created () {
    chrome.storage.sync.get(this.storageKey, results => {
      this.setting = results[this.storageKey]
    })
  }
}
</script>

<style scoped>
</style>
