import Vue from 'vue';
import * as VueGoogleMaps from 'vue2-google-maps';

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyC2N2HBpC7u0cP13zBUVpgzvnKpChvA-Ck',
    libraries: 'places',
  },
});
