<template>
  <div>
    <ul>
      <li v-for="(line, i) of lines" :key="i">{{ line }}</li>
    </ul>

    <ul>
      <li v-for="(opt, i) of opts" :key="i">
        <button @click.prevent="opt.cb()">{{ opt.name }}</button>
      </li>
    </ul>

    <span v-if="done">Game Over!</span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      lines: [],
      opts: [],
      done: false,
    };
  },
});
</script>

<style>
ul {
  list-style: none;
}
</style>
