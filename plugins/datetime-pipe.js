import Vue from 'vue';

Vue.filter('datetime', (value) => {
  return new Date(value).toLocaleDateString("hi-IN", {
    minute: 'numeric',
    hour: 'numeric',
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
});