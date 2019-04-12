<template>
  <v-container fluid>
    <v-layout justify-center>
      <v-form ref="form" v-model="valid" lazy-validation class="form">
        <v-text-field
          v-model="newDriver.name"
          :rules="[v => !!v || 'Name is required']"
          label="Name of the Driver is required"
          required
        ></v-text-field>
        <v-text-field
          v-model="newDriver.phone"
          :rules="[v => (v && v.length <= 10) || 'Enter a valid mobile number']"
          label="Driver's Mobile number will be used by them for logging in"
          required
        ></v-text-field>
        <v-text-field
          v-model="newDriver.busNumber"
          :rules="[v => !!v || 'Enter the bus number of the alloted bus to the driver']"
          label="Bus number alloted to the driver"
          required
        ></v-text-field>
        <v-text-field
          v-model="newDriver.password"
          :rules="[v => !!v || 'Driver login password is required for driver to log into the app to start tracking']"
          label="Driver Login Password"
          required
        ></v-text-field>

        <v-btn
          align-center
          block
          dark
          color="indigo"
          class="form-button"
          @click="addDriver"
        >
          Add Driver
        </v-btn>
        <v-btn
          align-center
          block
          dark
          color="info"
          class="form-button"
          @click="resetForm"
        >
          Reset Form
        </v-btn>
      </v-form>
    </v-layout>
  </v-container>
</template>

<script>
import { db } from './../services/firebaseApp';
export default {
  name: 'AddDriver',
  data: () => ({
    valid: true,
    newDriver: {
      name: '',
      phone: '',
      password: '',
      busNumber: '',
    }
  }),
  methods: {
    addDriver() {
      const validated = this.$refs.form.validate();
      if (!validated) return;
      db.collection('drivers').doc(this.newDriver.phone).set(this.newDriver).then(() => {
        this.$store.commit('snackbar/setSnack', 'Driver added successfully!');
        this.$refs.form.reset();
      });
    },
    resetForm() {
      this.newDriver = {};
      this.$refs.form.reset();
    }
  }
};
</script>

<style scoped>
.form {
  width: 60%;
}
</style>
