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
          v-for="sub in activeSubs"
          :key="sub.driver.name"
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
            :opened="sub.showInfo"
          >
            <p>{{ sub.driver.name }}: {{ sub.driver.busNumber }}</p>
            <h4>{{ sub.driver.lastLocation.physicalAddress }}</h4>
            <p>{{ sub.driver.lastActive | datetime }}</p>
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
        @delete="deleteDriver"
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

        if (this.activeSubs.length) {
          const selectedDrivers = this.drivers.filter(d => {
            return this.activeSubs.findIndex(d2 => d2.driver.phone == d.phone) != -1;
          });
          this.trackSelected(selectedDrivers);
        }
      });
  },
  beforeDestroy() {
    this.cancelSubscription();
  },
  methods: {
    trackSelected(selected) {
      this.activeSubs = [];
      selected.forEach(driver => {
        if (driver.lastLocation) {
          this.activeSubs.push({ driver });
        }
      });
      console.log(this.activeSubs.length);
      this.boundMarkers();
    },
    boundMarkers() {
      if (this.activeSubs.length == 0) return;

      const { mapRef } = this.$refs;
      const bounds = new google.maps.LatLngBounds();
      this.activeSubs.forEach(sub => {
        const pos = new google.maps.LatLng(
          sub.driver.lastLocation.latitude,
          sub.driver.lastLocation.longitude
        );
        bounds.extend(pos);
      })
      mapRef.fitBounds(bounds);
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
    deleteDriver(phone) {
      this.deleteSelected([{ phone }]);
    },
    deleteSelected(selected) {
      selected.forEach(driver => {
        firebase
          .firestore()
          .collection('drivers')
          .doc(driver.phone)
          .delete();
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