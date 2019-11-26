<template>
  <div
    class="ebonjour-wrapper"
    :style="`background: ${themeBackground}; color: ${themeText}`"
    v-anime="{ opacity: 1, duration: 1000 }"
  >
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
          <a-select
            :defaultValue="this.$cookies.get('userThemePref')"
            @change="handleTheme"
          >
            <a-select-option value="light">Light</a-select-option>
            <a-select-option value="dark">Dark</a-select-option>
          </a-select>
        </div>
        <div class="settings-option">
          <p>Remembered Devices:</p>
          <a-select
            :disabled="$lodash.isEmpty(computedSavedDevices.devices)"
            defaultValue="Select Device"
            :value="
              viewingSavedDevice ? viewingSavedDevice[0].name : 'Select Device'
            "
            @change="handleOpenSD"
          >
            <a-select-option
              v-for="(device, index) in computedSavedDevices.devices"
              :key="index"
              :value="
                $lodash.isEmpty(computedSavedDevices.devices)
                  ? null
                  : device.name
              "
              >{{ device.name }}</a-select-option
            >
          </a-select>
          <a-card
            v-if="viewingSavedDevice"
            :title="viewingSavedDevice[0].name"
            size="small"
            style="width: 450px; margin-left: auto; margin-right: auto; margin-top: 15px;"
          >
            <a-button
              slot="extra"
              type="danger"
              size="small"
              @click="handleForgetSavedDevice(viewingSavedDevice[0])"
              >Forget</a-button
            >
            <div
              style="display: flex; flex-direction: column; align-items: left;"
            >
              <p
                v-for="(address, index) in viewingSavedDevice[0].addresses"
                :key="index"
              >
                {{ address }}
              </p>
              <p>{{ viewingSavedDevice[0].port }}</p>
              <p v-for="(value, key) in viewingSavedDevice[0].txt" :key="key">
                {{ key }} : {{ value }}
              </p>
            </div>
          </a-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "../store";
import * as Sentry from '@sentry/browser';

export default {
  data() {
    return {
      savedDevices: store.state.userSavedDevices,
      viewingSavedDevice: null
    };
  },
  mounted() {
    console.log(this.$cookies.get("userThemePref"));
  },
  computed: {
    computedSavedDevices() {
      return store.state.userSavedDevices;
    },
    themeBackground() {
      switch (store.state.userThemeSelection) {
        default:
        case "light":
          return "#FFFFFF";
        case "dark":
          return "#1b1b1b";
      }
    },
    themeText() {
      switch (store.state.userThemeSelection) {
        default:
        case "light":
          return "#1b1b1b";
        case "dark":
          return "#FFFFFF";
      }
    },
    themeNavigatorBackground() {
      switch (store.state.userThemeSelection) {
        default:
        case "light":
          return "#FFFFFF";
        case "dark":
          return "#232323";
      }
    },
    themeButtonType() {
      switch (store.state.userThemeSelection) {
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
      store.dispatch("handleUserThemeChange", theme).then(() => {
        this.$cookies.set("userThemePref", theme);
        Sentry.captureMessage('Cookies set for userThemePref', 'debug');
        console.log(this.$cookies.get("userThemePref"));
      });
    },
    handleOpenSD(device) {
      console.log(device);
      this.viewingSavedDeviceName = device;
      let test = this.$lodash.filter(this.savedDevices.devices, o => {
        if (o.name === this.viewingSavedDeviceName) {
          return o;
        }
      });
      let test2 = this.$lodash.flatten(test);
      console.log(test2);
      this.viewingSavedDevice = test2;
    },
    handleForgetSavedDevice(device) {
      console.log(device);
      this.$lodash.remove(this.savedDevices.devices, o => {
        if (o.name === device.name) {
          return o;
        }
      });
      console.log("removed device from array:", this.savedDevices.devices);
      this.viewingSavedDevice = null;
      this.$cookies.set("savedDevices", this.savedDevices);
      store.dispatch("updateSavedDevices", this.$cookies.get("savedDevices"));
      this.$notification.open({
        message: "Device forgotten!",
        placement: "bottomRight",
        duration: 2.5
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
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin: 5px 0px; //tb lr
    }
  }
}
</style>
