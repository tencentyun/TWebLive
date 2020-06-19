import Vue from 'vue'
import { MessageBox, Row, Col, Button, Input, Loading, Dialog, Dropdown, DropdownMenu, DropdownItem, Tabs, TabPane,Form,FormItem } from 'element-ui'
import App from './App.vue'
import store from './store/index'
import TWebLive from 'tweblive'
import {showVconsole} from './utils/vconsole'
import './assets/icon/iconfont.css'
import './assets/icon/tim.css'
import './assets/css/reset.css'
import './assets/css/animate.css'
import visibility from 'vue-visibility-change'
import axios from 'axios'

window.TWebLive = TWebLive
window.store = store
Vue.prototype.$bus = new Vue() // event Bus 用于无关系组件间的通信。
Vue.prototype.TWebLive = TWebLive
Vue.prototype.$store = store
Vue.prototype.$axios = axios
Vue.prototype.$confirm = MessageBox.confirm


Vue.use(visibility)
Vue.use(Button)
Vue.use(Row)
Vue.use(Col)
Vue.use(Input)
Vue.use(Loading)
Vue.use(Dialog)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tabs)
Vue.use(TabPane)

// 在移动端开发环境下是否开启 vconsole,默认关闭
showVconsole(false)

new Vue({
  render: h => h(App)
}).$mount('#app')
