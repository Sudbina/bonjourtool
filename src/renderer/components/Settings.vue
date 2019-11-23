<template>
  <div class="ebonjour-wrapper" :style="`background: ${themeBackground}; color: ${themeText}`" v-anime="{ opacity: 1, duration: 1000 }">
    <div class="navigator" :style="`background: ${themeNavigatorBackground};`">
      <a-button
        :type="themeButtonType"
        style="font-weight: bold;"
        @click="handleNavigation('browser')"
        >Back</a-button
      >
    </div>
    <div class="settings-container">
      <p style="font-size: 18px; font-weight: bold;">Settings</p>
      <div class="settings-inner">
        <div class="settings-option">
          <p>Theme:</p>
          <a-select :defaultValue="this.$cookies.get('userThemePref')" @change="handleTheme">
            <a-select-option value="light">Light</a-select-option>
            <a-select-option value="dark">Dark</a-select-option>
          </a-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "../store";

export default {
  data() {
    return {};
  },
  mounted() {
    console.log(this.$cookies.get("userThemePref"));
  },
  computed: {
    themeBackground() {
      switch(store.state.userThemeSelection){
        default:
        case "light":
          return '#FFFFFF';
        case "dark":
          return '#1b1b1b';
      }
    },
    themeText() {
      switch(store.state.userThemeSelection){
        default:
        case "light":
          return '#1b1b1b';
        case "dark":
          return '#FFFFFF';
      }
    },
    themeNavigatorBackground() {
      switch(store.state.userThemeSelection){
        default:
        case "light":
          return '#FFFFFF';
        case "dark":
          return '#232323';
      }
    },
    themeButtonType() {
      switch(store.state.userThemeSelection){
        default:
        case "light":
          return "primary";
        case "dark":
          return "ghost";
      }
    }
  },
  methods: {
    handleNavigation(screen) {
      this.$router.replace(screen);
    },
    handleTheme(theme) {
      console.log("[VX] CHANGE THEME: ", theme);
      store.dispatch("handleUserThemeChange", theme).then((success, error) => {
          this.$cookies.set("userThemePref", theme);
          console.log(this.$cookies.get("userThemePref"));
      });
    }
  }
};
</script>

<style lang="scss">
p {
  margin: 0px !important;
}
.ebonjour-wrapper {
  display: flex;
  height: 100%;
  overflow: scroll;
  max-width: 100%;
  background: #efefef;
  transition: 0.1s ease;
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
.settings-container {
  width: 100%;
  padding: 10px;
  .settings-inner {
    display: flex;
    flex-direction: column;
    padding: 10px;
    .settings-option {
      width: 200px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 5px 0px; //tb lr
    }
  }
}
</style>
