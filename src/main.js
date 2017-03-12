import Vue from 'vue'

import APPComponent from './App/index.vue'

const vm = new Vue({
  el: '#app',
  components: {
    app: APPComponent,
  },
  render: h => h('app'),
})
