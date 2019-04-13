import Vue from 'vue';

Vue.filter('datetime', (value) => {
  const d = new Date(value);
  if (d instanceof Date && isNaN(d)) return '-';
  return d.toLocaleDateString("hi-IN", {
    minute: 'numeric',
    hour: 'numeric',
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
});