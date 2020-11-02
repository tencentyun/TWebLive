import TWebLive from 'tweblive'
const SDKAppID =  window.genTestUserSig('').SDKAppID
import store from './store/index'
let im = null
// 初始化 SDK 实例

try {
  im = TWebLive.createIM({ SDKAppID })
  window.setLogLevel = im.setLogLevel

// 无日志级别
  im.setLogLevel(0)
} catch (e) {
  console.log(e)
  store.commit('showMessage', { message: e, type: 'error' })
}



export default im
