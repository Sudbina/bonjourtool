<template>
  <div style="display: flex; height: 91%; overflow: scroll; max-width: 100%; background: #efefef">
        <div style="position: absolute; bottom: 0px; display: flex; align-items: center; width: 100%; padding: 10px; background: white; box-shadow: 0px -3px 13px 0px rgba(0,0,0,0.15);">
            
            <a-button v-if="!scanning" type="primary" style="font-weight: bold;" @click="handleDiscovery('')">{{this.discoveredDevices.length === 0 ? 'Scan' : 'Scan Again'}}</a-button>
            <a-button v-else type="danger" icon="loading" style="font-weight: bold;" @click="stopScan">Stop</a-button>
            <a-dropdown disabled>
                <a-menu slot="overlay">
                    <a-menu-item @click="handleViewChange('name')" key="1">By Name</a-menu-item>
                    <a-menu-item @click="handleViewChange('site')" key="2">By Site</a-menu-item>
                </a-menu>
                <a-button disabled style="margin-left: 8px"> View By <a-icon type="down" /> </a-button>
            </a-dropdown>
            <!-- <a-input-search style="width: 30%; margin-left: auto;" placeholder="input search text" @search="handleDiscovery" enterButton /> -->
        </div>
        <div style="width: 100%; padding: 10px;" >
            <a-collapse accordion>
               <a-collapse-panel v-anime="{ duration: 5000, opacity: 1, left: 50, delay: $anime.stagger(8000)}" v-for="device in discoveredDevices" :header="viewBy === 'name' ? device.name : device.txt.sitename" v-bind:key="device.name +''+ device.port ">
                   <div class="result-inner" style="display: flex; align-items: left; flex-wrap: wrap;">
                       <a-tag v-for="add in device.addresses" color="purple" v-bind:key="add.id" style="margin-right: 5px; margin-bottom: 5px;"><strong>Address: </strong>{{add}}</a-tag>
                       <a-tag color="orange" style="margin-right: 5px; margin-bottom: 5px"><strong>Port: </strong>{{device.port}}</a-tag>
                       <a-tag color="cyan" style="margin-right: 5px; margin-bottom: 5px;"><strong>Host: </strong>{{device.host}}</a-tag>
                       <a-tag v-for="(val, key) in device.txt" style="margin-right: 5px; margin-bottom: 5px" color="blue" v-bind:key="val.id"><strong style="text-transform: capitalize;">{{key}}: </strong>{{val}}</a-tag>
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

let local = new Bonjour()
export default {
    data() {
        return {
            discoveredDevices: [],
            viewBy: "name",
            scanning: false,
            logs: false
        } 
    },
    methods: {
        bruh(opt1, opt2) {
            console.log(Object.keys(opt1))
            // return this.$lodash.findKey(opt1, [opt2]);
        },
        handleDiscovery(bonjourType) {
            let tempDevices = [];
            local.find({type: bonjourType}, (device) => { //discover mdns servers on the network
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
                    this.viewBy = "name"
                    break;
                case "site":
                    this.viewBy = "site"
                    break;
            }
        },
        stopScan() {
            if(this.scanning) {
                this.scanning = false;
                local.stop(); //destroy this instance of Bonjour
                local = new Bonjour() //create new instance of Bonjour
            }
        },
        handleSearch(v) {
            console.log(v);
        }
    }
}
</script>

<style lang="scss">
p {
    margin: 0px;
}
.label {
    font-size: 11px;
    margin-left: -5px !important;
}
.result-inner {
    >* {
        margin: 15px;
    }
}
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
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
</style>