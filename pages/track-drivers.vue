<template>
  <div>
    <div id="map-container" :style="getStyle('map')"></div>
    <div id="table-container" :style="getStyle('table')">
      <v-btn absolute dark fab top right color="secondary" @click="changeMode()">
        <v-icon>swap_vert</v-icon>
      </v-btn>
      <v-container justify-center>
        <v-layout justify-center>
          <v-btn color="info" @click="trackSelected">Track Selected Drivers on map</v-btn>
          <v-btn color="deep-orange" dark @click="deleteSelected">Delete Selected Drivers</v-btn>
        </v-layout>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="drivers"
          :loading="loading"
          select-all
          hide-actions
          item-key="name"
          class="elevation-4 mt-3"
        >
          <template v-slot:headers="props">
            <tr>
              <th>
                <v-checkbox
                  :input-value="props.all"
                  :indeterminate="props.indeterminate"
                  hide-details
                  @click.stop="toggleAll"
                ></v-checkbox>
              </th>
              <th
                v-for="header in props.headers"
                :key="header.text"
                :class="['column sortable']"
                @click="changeSort(header.value)"
              >
                <v-icon small>arrow_upward</v-icon>
                {{ header.text }}
              </th>
            </tr>
          </template>
          <template v-slot:items="props">
            <tr :active="props.selected" @click="props.selected = !props.selected">
              <td>
                <v-checkbox
                  :input-value="props.selected"
                  primary
                  hide-details
                ></v-checkbox>
              </td>
              <td class="text-xs-center">{{ props.item.name }}</td>
              <td class="text-xs-center">{{ props.item.phone }}</td>
              <td class="text-xs-center">{{ props.item.lastActive }}</td>
              <td class="text-xs-center">
                <v-btn depressed round dark :color="props.item.status == 'active' ? 'success' : 'deep-orange'">
                  {{ props.item.status == 'active' ? 'ACTIVE' : 'INACTIVE' }}
                </v-btn>
              </td>
              <td class="text-xs-center">
                <v-btn flat icon color="deep-orange">
                  <v-icon>delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
          <template v-slot:no-data>
            <v-alert :value="true" color="error" icon="warning" v-if="!loading">
              No drivers exists!
            </v-alert>
            <h4 v-else>
              Loading...
            </h4>
          </template>
        </v-data-table>
      </v-container>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase';
export default {
  name: 'TrackDrivers',
  data: () => ({
    headers: [
      { text: 'Name', align: 'center', value: 'name', sortable: false },
      { text: 'Phone', align: 'center', value: 'phone', sortable: false },
      { text: 'Last Active', align: 'center', value: 'lastActive', sortable: false },
      { text: 'Status', align: 'center', value: 'status', sortable: false },
      { text: 'Actions', align: 'center', value: 'name', sortable: false },
    ],
    drivers: [],
    selected: [],
    loading: true,
    mode: 'auto',
    cancelSubscription: null
  }),
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
    trackSelected() {
      console.log(this.selected);
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
    deleteSelected() {
      console.log(this.selected);
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
  background: lightgreen;
  overflow: scroll;
}
</style>
