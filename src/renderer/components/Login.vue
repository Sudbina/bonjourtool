<template>
  <div style="display: flex; height: 91%; overflow: scroll; max-width: 100%;">
        <div style="position: absolute; bottom: 0px; display: flex; align-items: center; width: 100%; padding: 10px; background: white; box-shadow: 0px -3px 13px 0px rgba(0,0,0,0.15);">
            
            <a-button type="primary" style="font-weight: bold;" @click="handleDiscovery('myactionreplay-http')">Scan</a-button>
            <a-dropdown>
                <a-menu slot="overlay">
                    <a-menu-item @click="handleViewChange('name')" key="1">By Name</a-menu-item>
                    <a-menu-item @click="handleViewChange('site')" key="2">By Site</a-menu-item>
                </a-menu>
                <a-button style="margin-left: 8px"> View By <a-icon type="down" /> </a-button>
            </a-dropdown>
            <!-- <a-input-search style="width: 30%; margin-left: auto;" placeholder="input search text" @search="handleDiscovery" enterButton /> -->
        </div>
        <div style="width: 100%;" >
            <a-collapse accordion>
               <a-collapse-panel v-for="device in discoveredDevices" :header="viewBy === 'name' ? device.name : device.txt.sitename" v-bind:key="device.name">
                   <div class="result-inner" style="display: flex; align-items: left; flex-wrap: wrap;">
                    <div style="display: flex; flex-direction: column;">
                        <p class="label">marGroup: </p>
                        <a-tag style=" ">{{device.txt.margroup}}</a-tag>
                    </div>
                    <div style="display: flex; flex-direction: column;">
                        <p class="label">marName: </p>
                        <a-tag style=" ">{{device.txt.marname}}</a-tag>
                    </div>
                    <div style="display: flex; flex-direction: column;">
                        <p class="label">osVersion: </p>
                        <a-tag :color="device.txt.marsoftware < 5 ? 'red' : 'green'">{{device.txt.marsoftware}}</a-tag>
                    </div>
                    <div style="display: flex; flex-direction: column;">
                        <p class="label">piSerial: </p>
                        <a-tag style=" ">{{device.txt.piserial}}</a-tag>
                    </div>
                   </div>
               </a-collapse-panel>
            </a-collapse>
            </div>
        </div>
  </div>
</template>

<script>
import Bonjour from 'bonjour';
const local = new Bonjour()
export default {
    data() {
        return {
            name: "Test",
            discoveredDevices: [],
            viewBy: "name"
        } 
    },
    methods: {
        handleDiscovery(bonjourType) {
            console.log(bonjourType)
            let tempDevices = []
            local.find({type: bonjourType}, (devices) => {
                tempDevices.push(devices)
                this.discoveredDevices = tempDevices
                // console.log(tempDevices);
                // this.discoveredDevices = tempDevices;
            })
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
        handleSearch(v) {
            console.log(v)
        }
    }
}
</script>

<style lang="scss">
p {
    margin: 0px !important;
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
</style>