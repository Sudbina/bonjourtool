<template>
  <div
    class="ebonjour-wrapper"
    :style="`background: ${themeBackground}; color: ${themeText}`"
    v-anime="{ opacity: 1, duration: 1000 }"
  >
    <div class="navigator" :style="`background: ${themeNavigatorBackground}`">
      <a-select
        showSearch
        addonBefore="Service"
        optionFilterProp="children"
        style="width: 200px; "
        @change="handleChange"
        :filterOption="filterOption"
        :defaultValue="this.$cookies.get('serviceTypePref')"
      >
        <a-select-option
          v-for="item in serviceTypes"
          :key="item.name"
          :value="item.name"
          >{{ item.name }}</a-select-option
        >
      </a-select>
      <a-button
        :disabled="selectedServiceType === null"
        :type="themeButtonType"
        style="font-weight: bold; margin-left: 5px;"
        @click="handleDiscovery(selectedServiceType)"
        >Scan</a-button
      >
      <a-button
        :type="themeButtonType"
        style="margin-left: auto;"
        @click="handleNavigation('settings')"
        icon="setting"
      ></a-button>
    </div>
    <div class="result-container">
      <a-collapse accordion>
        <a-collapse-panel
          v-anime="listAnimation"
          v-for="(device, key) in discoveredDevices"
          data-test="test"
          :header="device.name + '(' + device.port + ')'"
          v-bind:key="'ebonjour-resultitem-' + key"
        >
          <p slot="header">Test</p>
          <div class="result-inner">
            <a-tag
              class="result-attribute"
              color="purple"
              v-clipboard:copy="add"
              v-clipboard:success="handleCopySuccess"
              v-for="add in device.addresses"
              v-bind:key="add.id"
            >
              <strong>Address: </strong>{{ add }}
            </a-tag>
            <a-tag
              class="result-attribute"
              color="orange"
              v-clipboard:copy="device.port"
              v-clipboard:success="handleCopySuccess"
            >
              <strong>Port: </strong>{{ device.port }}
            </a-tag>
            <a-tag
              class="result-attribute"
              color="cyan"
              v-clipboard:copy="device.host"
              v-clipboard:success="handleCopySuccess"
            >
              <strong>Host: </strong>{{ device.host }}
            </a-tag>
            <a-tag
              class="result-attribute"
              color="blue"
              v-clipboard:copy="val"
              v-clipboard:success="handleCopySuccess"
              v-for="(val, key) in device.txt"
              v-bind:key="val.id"
            >
              <strong style="text-transform: capitalize;">{{ key }}: </strong
              >{{ val }}
            </a-tag>
            <a-button
              type="primary"
              size="small"
              style="font-weight: bold;"
              @click="handleRememberDevice(device)"
              >Remember</a-button
            >
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div>
</template>

<script>
import store from "../store";
import Bonjour from "bonjour";
import _ from "lodash";
import serviceTypes from "./Browser/mdnsServiceTypes";

let local = new Bonjour();

export default {
  data() {
    return {
      discoveredDevices: [],
      viewBy: "name",
      scanning: false,
      logs: true,
      statusText: "Scanning",
      serviceTypes: serviceTypes,
      savedDevices: this.$cookies.get("savedDevices")
        ? this.$cookies.get("savedDevices")
        : [],
      listAnimation: { duration: 2000, opacity: 1 },
      selectedServiceType: this.$cookies.get("serviceTypePref")
        ? this.$cookies.get("serviceTypePref")
        : ""
    };
  },
  mounted() {
    if (this.logs) console.log(this.$cookies.get("serviceTypePref"));
    //   analytics.logEvent("app_start", {date: new Date()}); BRUH why can't I use firebase analytics with electron
  },
  computed: {
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
    handleRememberDevice(device) {
      if (!this.$lodash.includes(this.savedDevices.devices, device)) {
        this.savedDevices.devices.push(device);
        this.$cookies.set("savedDevices", this.savedDevices);
        console.log("DEVICES", this.$cookies.get("savedDevices"));
        store.dispatch("updateSavedDevices", this.$cookies.get("savedDevices"));
        this.$notification.open({
          message: "Device remembered!",
          placement: "bottomRight",
          duration: 2.5
        })
      } else {
        this.$notification.open({
          message: "Already saved this device",
          placement: "bottomRight",
          duration: 2.5
        });
      }
    },
    handleNavigation(screen) {
      this.$router.push(screen);
    },
    handleChange(value) {
      console.log(`selected ${value}`);
      this.selectedServiceType = value;
      this.$cookies.set("serviceTypePref", value);
      this.stopScan();
    },
    handleCopySuccess() {
      console.log(serviceTypes);
      this.$notification.open({
        //user copy to clipboard feedback
        message: "Copied to clipboard",
        placement: "bottomRight",
        duration: 1.5
      });
    },
    handleDiscovery() {
      let tempDevices = [];
      local.find({ type: this.selectedServiceType }, device => {
        //discover mdns servers on the network
        this.scanning = true; //let user know things are happening
        if (this.logs) console.log("[M][Found a device]:", device);
        tempDevices.push(device); // add device to temp array
        if (this.logs) console.log("[M][Added device to array]:", tempDevices);
      });
      this.discoveredDevices = tempDevices; // merge device into state array
      this.$cookies.set("devices", this.discoveredDevices);
      console.log(this.$cookies.get("devices"));
    },
    stopScan() {
      if (this.scanning) {
        this.scanning = false; //keep user informed
        local.destroy(); //destroy this instance of Bonjour
        local = new Bonjour(); //create new instance of Bonjour
      } else {
        local.destroy();
        local = new Bonjour();
      }
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    }
    // handleSearch(v) {
    //   console.log(v);
    // }
  }
};
</script>

<style lang="scss">
//resets
p {
  margin: 0px;
}

//styles
.label {
  font-size: 11px;
  margin-left: -5px !important;
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
.result-container {
  width: 100%;
  padding: 10px;
  .result-inner {
    display: flex;
    flex-wrap: wrap;
    align-items: left;
    .result-attribute {
      margin-right: 5px;
      margin-bottom: 5px;
    }
  }
}

//ant-design overrides
.ant-card-head-title {
  margin-right: 10px !important;
}
.ant-collapse-header[aria-expanded="true"] {
  background: #1890ff;
  color: white !important;
}
.ant-collapse-content > .ant-collapse-content-box {
  padding: 5px !important; //antd override
}
.ant-notification {
  width: 220px !important;
}
.ant-notification-notice {
  padding: 8px 15px !important;
  background: #1890ff !important;
  .ant-notification-notice-message {
    color: white !important;
    margin-bottom: 0px !important;
  }
  .ant-notification-notice-close {
    color: white !important;
  }
  .ant-notification-notice-close {
    top: 9px !important;
  }
}
#menu-solutions-menu {
  display: flex;
  flex-direction: column;
}
#menu-solutions-menu > *::after {
  padding: 10px 0px;
  font-size: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.5);
}
</style>
