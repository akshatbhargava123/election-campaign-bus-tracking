<template>
  <div>
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
            >
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
            <td class="text-xs-center">
              <span v-if="props.item.source">
                <b>{{ props.item.source }}</b> to <b>{{ props.item.destination }}</b>
              </span>
              <span v-else>-</span>
            </td>
            <td class="text-xs-center">
              {{ (props.item.lastLocation && props.item.lastLocation.physicalAddress) || '-' }}
            </td>
            <td class="text-xs-center">{{ props.item.lastActive | datetime }}</td>
            <td class="text-xs-center">
              <v-btn depressed round dark :color="getStatus(props.item.lastActive) == 'active' ? 'success' : 'deep-orange'">
                {{ props.item.lastActive | status }}
              </v-btn>
            </td>
            <td class="text-xs-center">
              <v-btn flat icon color="deep-orange" @click="deleteDriver(props.item)">
                <v-icon>delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
        <template v-slot:no-data>
          <v-layout justify-center>
            <div v-if="!loading">
              <v-icon>warning</v-icon>
              No drivers exists!
              <v-btn color="indigo" small dark @click="reroute">Add Now</v-btn>
            </div>
            <h4 v-else>
              Loading...
            </h4>
          </v-layout>
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import Vue from 'vue';
export default {
  name: 'DriversTable',
  props: {
    loading: Boolean,
    drivers: Array
  },
  data: () => ({
    selected: [],
    headers: [
      { text: 'Name', align: 'center', value: 'name', sortable: false },
      { text: 'Phone', align: 'center', value: 'phone', sortable: false },
      { text: 'Route', align: 'center', value: 'name', sortable: false },
      { text: 'Last Location', align: 'center', value: 'position.physicalAddress', sortable: false },
      { text: 'Last Active', align: 'center', value: 'lastActive', sortable: false },
      { text: 'Status', align: 'center', value: 'status', sortable: false },
      { text: 'Actions', align: 'center', value: 'name', sortable: false },
    ]
  }),
  methods: {
    toggleAll () {
      if (this.selected.length) this.selected = []
      else this.selected = this.drivers.slice();
    },
    getStatus(lastActive) {
      const status = Vue.filter('status')(lastActive);
      return status;
    },
    changeMode() {
      this.$emit('changeMode');
    },
    trackSelected() {
      this.$emit('trackSelected', this.selected);
    },
    deleteDriver(driver) {
      this.$emit('delete', driver.phone);
    },
    deleteSelected() {
      this.$emit('deleteSelected', this.selected);
    },
    reroute() {
      this.$router.push({
        path: 'add-driver'
      });
    }
  }
}
</script>

<style>

</style>
