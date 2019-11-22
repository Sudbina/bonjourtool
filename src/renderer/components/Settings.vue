<template>
  <div class="ebonjour-wrapper" v-anime="{opacity: 1, duration: 1000}">
      <div class="navigator">
    <a-button type="primary" style="font-weight: bold;" @click="handleNavigation('browser')"
      >Back</a-button
    >
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  methods: {
    handleNavigation(screen) {
      this.$router.replace(screen);
    }
  }
};
</script>

<style>
.ebonjour-wrapper {
  display: flex;
  height: 100%;
  overflow: scroll;
  max-width: 100%;
  background: #efefef;
}
.navigator {
  position: absolute;
  bottom: 0px;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px;
  background: white;
  box-shadow: 0px -3px 13px 0px rgba(0, 0, 0, 0.15);
}
</style>
