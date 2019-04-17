import Vue from 'vue';
import * as VueGoogleMaps from 'vue2-google-maps';

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyCuryEkeyzTmGh6DTKlIVvhkI3ccDB_Xu8',
    libraries: 'places',
  },
});
