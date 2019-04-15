<template>
  <div>
    <div id="map-container" :style="getStyle('map')">
      <v-btn fab small dark absolute direction="bottom" color="indigo" class="mt-3 ml-3" @click="changeMapTheme">
        <v-icon>color_lens</v-icon>
      </v-btn>
      <GmapMap
        :center="{ lat: 28.7041, lng: 77.1025 }"
        :zoom="12"
        :options="{
          zoomControl: false,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false,
          disableDefaultUi: true,
          styles: gmapStyles[selectedMapStyle]
        }"
        ref="mapRef"
        style="width: 100%; height: 100%"
      >
        <GmapMarker
          v-for="(sub, i) in activeSubs"
          :ref="'marker_' + i"
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
import gmap_retro_style from '@/constants/gmap-retro-style';
import gmap_night_style from '@/constants/gmap-night-style';
import gmap_standard_style from '@/constants/gmap-standard-style';
import gmap_aubergine_style from '@/constants/gmap-aubergine-style';
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
    cancelSubscription: null,
    selectedMapStyle: 0,
    gmapStyles: [
      gmap_standard_style,
      gmap_night_style,
      gmap_retro_style,
      gmap_aubergine_style,
    ]
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
          // this.trackSelected(selectedDrivers);
          this.updateMarkers(selectedDrivers);
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
      this.boundMarkers();
    },
    updateMarkers(updatedDrivers) {
      const frames = [];
      this.activeSubs.forEach((sub, i) => {
        sub.driver.lastLocation = updatedDrivers[i].lastLocation;
        sub.driver.lastActive = updatedDrivers[i].lastActive;

        const marker = this.$refs[`marker_${i}`][0].$markerObject;
        const driver = updatedDrivers.find(d => d.name == sub.driver.name);
        const fromLat = marker.position.lat(),
              fromLng = marker.position.lng();
        const toLat = driver.lastLocation.latitude,
              toLng = driver.lastLocation.longitude;
        let curLat, curLng;

        for (let i = 0; i < 1; i += 0.01) {
          curLat = fromLat + i * (toLat - fromLat);
          curLng = fromLng + i * (toLng - fromLng);
          frames.push(new google.maps.LatLng(curLat, curLng));
        }
        this.moveMarker(marker, frames, 0, 30);
        this.boundMarkers([
          { latitude: fromLat, longitude: fromLng }
        ]);
      });
    },
    moveMarker(marker, latlngs, index, wait, newDestination) {
      marker.setPosition(latlngs[index]);
      // console.log(marker.getPosition().lat(), marker.getPosition().lng());
      // console.log(latlngs[index].lat(), latlngs[index].lng());
      if (index != latlngs.length - 1) {
        // call the next "frame" of the animation
        setTimeout(() => { 
          this.moveMarker(marker, latlngs, index + 1, wait);
        }, wait);
      }
    },
    boundMarkers(extraBoundedPos = []) {
      if (this.activeSubs.length == 0) return;

      const { mapRef } = this.$refs;
      const bounds = new google.maps.LatLngBounds();
      this.activeSubs.forEach(sub => {
        const pos = new google.maps.LatLng(
          sub.driver.lastLocation.latitude,
          sub.driver.lastLocation.longitude
        );
        bounds.extend(pos);
      });
      extraBoundedPos.forEach(position => {
        const pos = new google.maps.LatLng(
          position.latitude,
          position.longitude
        );
        bounds.extend(pos);
      });
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
    changeMapTheme() {
      if (this.selectedMapStyle > 3) this.selectedMapStyle = 0;
      this.selectedMapStyle++;
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