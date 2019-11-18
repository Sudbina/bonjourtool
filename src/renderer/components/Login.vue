<template>
  <div style="display: flex; height: 100%; overflow: scroll; max-width: 100%; background: #efefef">
      <div v-if="scanning" style="position: absolute; bottom: 0px; display: flex; align-items: center; width: 100%; padding: 10px; background: white;">
          <a-tag>{{this.discoveredDevices.length}} Devices Found</a-tag>
      </div>
        <div style="position: absolute; bottom: 0px; display: flex; align-items: center; width: 100%; padding: 10px; background: white; box-shadow: 0px -3px 13px 0px rgba(0,0,0,0.15);">
            <a-button v-if="!scanning" type="primary" style="font-weight: bold;" @click="handleDiscovery('myactionreplay-http')">{{this.discoveredDevices.length === 0 ? 'Scan' : 'Scan Again'}}</a-button>
            <a-button v-else type="danger" icon="loading" style="font-weight: bold;" @click="stopScan">Stop</a-button>
            <a-dropdown>
                <a-menu slot="overlay">
                    <a-menu-item @click="handleViewChange('name')" key="1">By Name</a-menu-item>
                    <a-menu-item @click="handleViewChange('site')" key="2">By Site</a-menu-item>
                    <a-menu-item @click="handleViewChange('serial')" key="3">By Serial</a-menu-item>
                </a-menu>
                <a-button style="margin-left: 8px"> View By <a-icon type="down" /> </a-button>
            </a-dropdown>
            <!-- <a-input-search style="width: 30%; margin-left: auto;" placeholder="input search text" @search="handleDiscovery" enterButton /> -->
        </div>
        <div style="width: 100%; padding: 10px;" >
            <a-collapse accordion>
               <a-collapse-panel v-for="device in discoveredDevices" :header="renderName(device)" v-bind:key="device.name +''+ device.port ">
                   <div class="result-inner" style="display: flex; align-items: left; flex-wrap: wrap;">
                       <a-tag id="tt" v-clipboard:copy="add" v-clipboard:success="handleCopyAttrib" v-for="add in device.addresses" color="purple" v-bind:key="add.id" style="margin-right: 5px; margin-bottom: 5px;">
                            <strong>Address: </strong>{{add}}
                        </a-tag>
                       <a-tag color="orange" style="margin-right: 5px; margin-bottom: 5px">
                           <strong>Port: </strong>{{device.port}}
                        </a-tag>
                       <a-tag color="cyan" style="margin-right: 5px; margin-bottom: 5px;">
                           <strong>Host: </strong>{{device.host}}
                        </a-tag>
                       <a-tag v-for="(val, key) in device.txt" style="margin-right: 5px; margin-bottom: 5px" color="blue" v-bind:key="val.id">
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
import anime from 'animejs';
import _ from 'lodash';
import tippy from 'tippy.js';
let local = new Bonjour()
export default {
    data() {
        return {
            discoveredDevices: [],
            viewBy: "name",
            scanning: false,
            logs: true,
            keyframes: [
                {opacity: 0},
                {opacity: 1}
            ]
        } 
    },
    methods: {
        handleCopyAttrib(val) {
            const el = document.getElementById('tt');
            tippy('#tt', {
                content: 'Copied',
                placement: 'bottom',
                animation: 'scale',
                trigger: 'click'
            });
            const instance = el._tippy;
            setTimeout(function() {
                instance.hide();
            }, 1500)
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
        renderName(device) {
            switch(this.viewBy){
                case "name":
                    return device.name;
                    break;
                case "site": 
                    return device.txt.sitename;
                    break;
                case "serial":
                    return device.txt.piserial;
                    break;
            }
        },
        handleViewChange(viewby) {
            switch(viewby){
                case "name": 
                    this.viewBy = "name"; 
                    break;
                case "site":
                    this.viewBy = "site";
                    break;
                case "serial":
                    this.viewBy = "serial";
                    break;
            }
        },
        stopScan() {
            if(this.scanning) {
                this.scanning = false;
                local.destroy(); //destroy this instance of Bonjour
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
#menu-solutions-menu {
    flex-direction: column !important;
}
#menu-solutions-menu li[id^="menu-item"] {
    padding: 15px;
    border-bottom: 1px solid rgba(0,0,0,0.5);
}
</style>