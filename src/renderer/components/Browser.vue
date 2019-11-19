<template>
  <div class="ebonjour-wrapper">
        <div class="navigator">
            <a-select
            showSearch
            addonBefore="Service"
            placeholder="Select a Service Type"
            optionFilterProp="children"
            style="width: 200px; "
            @change="handleChange"
            :filterOption="filterOption"
            >   
                <a-select-option v-for="item in serviceTypes" :key="item.name" :value="item.name">{{item.name}}</a-select-option>
            </a-select>
            <a-button v-if="!scanning" :disabled="selectedServiceType === null" type="primary" style="font-weight: bold; margin-left: 5px;" @click="handleDiscovery('http')">{{this.discoveredDevices.length === 0 ? 'Scan' : 'Scan Again'}}</a-button>
            <a-button v-else type="danger" icon="loading" style="font-weight: bold; margin-left: 5px;" @click="stopScan">Stop</a-button>
            <!-- <a-dropdown disabled>
                <a-menu slot="overlay">
                    <a-menu-item @click="handleViewChange('name')" key="1">By Name</a-menu-item>
                    <a-menu-item @click="handleViewChange('site')" key="2">By Site</a-menu-item>
                </a-menu>
                <a-button disabled style="margin-left: 8px"> View By <a-icon type="down" /> </a-button>
            </a-dropdown> -->
        </div>
        <div class="result-container">
            <a-collapse accordion>
               <a-collapse-panel v-anime="listAnimation" v-for="device in discoveredDevices" :header="viewBy === 'name' ? device.name : device.txt.sitename" v-bind:key="device.name +''+ device.port ">
                   <div class="result-inner">
                       <a-tag class="result-attribute" v-clipboard:copy="add" v-clipboard:success="handleCopySuccess" color="purple" v-for="add in device.addresses" v-bind:key="add.id">
                           <strong>Address: </strong>{{add}}
                        </a-tag>
                       <a-tag class="result-attribute" color="orange">
                           <strong>Port: </strong>{{device.port}}
                        </a-tag>
                       <a-tag class="result-attribute" color="cyan">
                           <strong>Host: </strong>{{device.host}}
                        </a-tag>
                       <a-tag class="result-attribute" color="blue" v-for="(val, key) in device.txt" v-bind:key="val.id">
                           <strong style="text-transform: capitalize;">{{key}}: </strong>{{val}}
                        </a-tag>
                   </div>
               </a-collapse-panel>
            </a-collapse>
            </div>
        </div>
  </div>
</template>

<script>
import Bonjour from 'bonjour';
import Browser from 'bonjour/lib/browser';
import VueAnime from 'vue-animejs';
import _ from 'lodash';
import serviceTypes from './Browser/mdnsServiceTypes';

let local = new Bonjour();

export default {
    data() {
        return {
            discoveredDevices: [],
            viewBy: "name",
            scanning: false,
            logs: true,
            statusText: 'Scanning',
            serviceTypes: serviceTypes,
            selectedServiceType: null,
            listAnimation: { duration: 2000, opacity: 1 }
        } 
    },
    methods: {
        handleChange(value) {
            console.log(`selected ${value}`);
            this.selectedServiceType = value;
        },
        handleCopySuccess() {
            console.log(serviceTypes)
            this.$notification.open({message: 'Copied to clipboard', placement: "bottomRight", duration: 1.5}) //user copy to clipboard feedback
        },
        handleDiscovery() {
            let tempDevices = [];
            local.find({type: this.selectedServiceType}, (device) => { //discover mdns servers on the network
                if(this.logs) console.log("[M][Found a device]:", device);
                tempDevices.push(device); // add device to temp array
                if(this.logs) console.log("[M][Added device to array]:", tempDevices);
            })
            this.scanning = true; //let user know things are happening
            this.discoveredDevices = tempDevices; // merge device into state array
        },
        handleViewChange(viewby) {
            switch(viewby){
                case "name": 
                    this.viewBy = "name";
                    break;
                case "site":
                    this.viewBy = "site";
                    break;
            }
        },
        stopScan() {
            if(this.scanning) {
                this.scanning = false; //keep user informed
                local.destroy(); //destroy this instance of Bonjour
                local = new Bonjour(); //create new instance of Bonjour
            }
        },
        filterOption(input, option) {
            return (
                option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
        },
        handleSearch(v) {
            console.log(v);
        }
    }
}
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
}
.navigator {
    position: absolute; 
    bottom: 0px; 
    display: flex; 
    align-items: center; 
    width: 100%; 
    padding: 10px; 
    background: white; 
    box-shadow: 0px -3px 13px 0px rgba(0,0,0,0.15);
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
    font-weight: bold;
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
</style>