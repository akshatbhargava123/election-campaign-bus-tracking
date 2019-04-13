<template>
  <div>
    <div id="map-container" :style="getStyle('map')">
      <GmapMap
        :center="{ lat: 28.7041, lng: 77.1025 }"
        :zoom="12"
        ref="mapRef"
        style="width: 100%; height: 100%"
      >
        <GmapMarker
          v-for="(sub, index) in activeSubs"
          :key="index"
          :position="{
            lat: sub.driver.lastLocation.latitude,
            lng: sub.driver.lastLocation.longitude
          }"
          :icon="{
            url: '/images/bus-icon.png'
          }"
          @click="sub.showInfo = !sub.showInfo"
        >
          <GmapInfoWindow
            v-for="sub in activeSubs"
            :key="sub.driver.name"
            :opened="sub.showInfo"
          >
            <h6>
              {{ sub.driver.lastLocation.physicalAddress }}
            </h6>
          </GmapInfoWindow>
        </GmapMarker>
      </GmapMap>
    </div>
    <div id="table-container" :style="getStyle('table')">
      <drivers-table
        :drivers="drivers"
        :loading="loading"
        @changeMode="changeMode"
        @trackSelected="trackSelected"
        @deleteSelected="deleteSelected"
      />
    </div>
  </div>
</template>

<script>
import firebase from 'firebase';
import { gmapApi } from 'vue2-google-maps';
import DriversTable from '@/components/DriversTable';
export default {
  name: 'TrackDrivers',
  components: { DriversTable },
  data: () => ({
    drivers: [],
    selected: [],
    loading: true,
    activeSubs: [], // active subscriptions
    mode: 'auto',
    cancelSubscription: null
  }),
  computed: {
    google: gmapApi
  },
  mounted() {
    this.cancelSubscription = firebase
      .firestore()
      .collection('drivers')
      .onSnapshot(res => {
        this.loading = false;
        this.drivers = res.docs.map(r => r.data());
        console.log(this.drivers);
      });
  },
  beforeDestroy() {
    this.cancelSubscription();
  },
  methods: {
    toggleAll () {
      if (this.selected.length) this.selected = []
      else this.selected = this.drivers.slice();
    },
    trackSelected(selected) {
      this.activeSubs = [];
      selected.forEach(driver => {
        if (driver.lastLocation) {
          this.activeSubs.push({ driver });
        }
      });
      this.boundMarkers();
    },
    boundMarkers() {
      const bounds = new google.maps.LatLngBounds();
      this.activeSubs.forEach(sub => {
        const pos = new google.maps.LatLng(
          sub.driver.lastLocation.latitude,
          sub.driver.lastLocation.longitude
        );
        bounds.extend(pos);
      })
      this.$refs.mapRef.fitBounds(bounds);
    },
    changeMode() {
      switch (this.mode) {
        case 'auto':
          return this.mode = 'map';
        case 'map':
          return this.mode = 'table';
        case 'table':
          return this.mode = 'auto';
      }
    },
    getStyle(which) {
      switch (which) {
        case 'map':
          if (this.mode == 'table') {
            return { height: '0vh' };
          } else if (this.mode == 'map') {
            return { height: '100vh' };
          } else return { height: '46vh' };
        case 'table':
          if (this.mode == 'table') {
            return { height: '100vh' };
          } else if (this.mode == 'map') {
            return { height: '0vh' };
          } else return { height: '46vh' };
      }
    },
    deleteSelected(selected) {
      console.log(selected);
    },
    reroute() {
      this.$router.push({
        path: 'add-driver'
      });
    }
  }
};
</script>
<style scoped>
#map-container {
  transition: all 0.5s;
  height: 46vh;
}
#table-container {
  transition: all 0.5s;
  height: 46vh;
  overflow: scroll;
  background: #E1F5FE;
  border-top: 1px solid #01579B;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
}
</style>

<style>
a[href^="http://maps.google.com/maps"]{display:none !important}
a[href^="https://maps.google.com/maps"]{display:none !important}

.gmnoprint a, .gmnoprint span, .gm-style-cc {
    display:none;
}
.gmnoprint div {
    background:none !important;
}
</style>