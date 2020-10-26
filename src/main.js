import Vue from 'vue'
import {
  MessageBox,
  Button,
  Input,
  Dialog,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Form,
  FormItem,
  Popover,
  Tooltip,
  Divider,
  Select,
  Option,
  Slider,
  Message,
} from 'element-ui'
import App from './App.vue'
import store from './store/index'
import router from './router'
import TWebLive from 'tweblive'
import im from 'tim'
// import { showVconsole } from './utils/vconsole'
import './assets/icon/iconfont.css'
import './assets/icon/tim.css'
import './assets/css/reset.css'
import './assets/css/animate.css'
import VueClipboard from 'vue-clipboard2'


window.im = im
window.TWebLive = TWebLive
window.store = store
Vue.prototype.$bus = new Vue() // event Bus 用于无关系组件间的通信。
Vue.prototype.im = im
Vue.prototype.TWebLive = TWebLive
Vue.prototype.$store = store
Vue.prototype.$confirm = MessageBox.confirm


Vue.use(Button)
Vue.use(Input)
Vue.use(Dialog)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Popover)
Vue.use(Tooltip)
Vue.use(Divider)
Vue.use(Select)
Vue.use(Option)
Vue.use(Slider)
Vue.use(VueClipboard)

// 在移动端开发环境下是否开启 vconsole,默认关闭
//  showVconsole(false)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
