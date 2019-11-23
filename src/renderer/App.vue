<template>
  <div id="app" :style="` background: ${themeBackground};`">
    <router-view></router-view>
  </div>
</template>

<script>
import store from "./store";
export default {
  name: "ebonjour-tool",
  computed: {
    themeBackground() {
      switch (store.state.userThemeSelection) {
        default:
        case "light":
          return "#ffffff";
        case "dark":
          return "#1b1b1b";
      }
    }
  }
};
</script>

<style>
/* CSS */
#app {
  height: 100%;
  width: 100%;
}
</style>
