import Vue from 'vue'
import App from './App'
import Http from '@/utils/http';
import Common from '@/utils/common';

Vue.config.productionTip = false;
App.mpType = 'app';

Vue.prototype.$http = Http;
Vue.prototype.common = Common;

// Vue.prototype.globalData = {
//   isBindPhone: 0, // 是否绑定手机号 0未绑过，1是绑定过
// };

const app = new Vue(App);
app.$mount();
