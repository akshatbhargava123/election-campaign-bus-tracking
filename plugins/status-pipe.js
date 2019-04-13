import Vue from 'vue';

Vue.filter('status', (value) => {
  const minutesDiff = (new Date().getTime() - Number(value)) / 600;
  return minutesDiff <= 300 ? 'active' : 'inactive';
});