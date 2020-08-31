import TWebLive from 'tweblive'
import { SDKAPPID } from '../public/debug/GenerateTestUserSig'
const SDKAppID =  window.genTestUserSig('').SDKAppID

// 初始化 SDK 实例
const im = TWebLive.createIM({ SDKAppID })

window.setLogLevel = im.setLogLevel

// 无日志级别
im.setLogLevel(0)

export default im
