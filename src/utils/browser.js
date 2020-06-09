/**
 * @file browser.js
 * @module browser
 */

const USER_AGENT = window.navigator && window.navigator.userAgent || ''
const webkitVersionMap = (/AppleWebKit\/([\d.]+)/i).exec(USER_AGENT)
const appleWebkitVersion = webkitVersionMap ? parseFloat(webkitVersionMap.pop()) : null

/*
 * Device is an iPhone
 *
 * @type {Boolean}
 * @constant
 * @private
 */
export const IS_IPAD = (/iPad/i).test(USER_AGENT)

// The Facebook app's UIWebView identifies as both an iPhone and iPad, so
// to identify iPhones, we need to exclude iPads.
// http://artsy.github.io/blog/2012/10/18/the-perils-of-ios-user-agent-sniffing/
export const IS_IPHONE = (/iPhone/i).test(USER_AGENT) && !IS_IPAD
export const IS_IPOD = (/iPod/i).test(USER_AGENT)
export const IS_IOS = IS_IPHONE || IS_IPAD || IS_IPOD

export const IOS_VERSION = (function() {
  const match = USER_AGENT.match(/OS (\d+)_/i)

  if (match && match[1]) {
    return match[1]
  }
  return null
}())

export const IS_ANDROID = (/Android/i).test(USER_AGENT)
export const ANDROID_VERSION = (function() {
  // This matches Android Major.Minor.Patch versions
  // ANDROID_VERSION is Major.Minor as a Number, if Minor isn't available, then only Major is returned
  const match = USER_AGENT.match(/Android (\d+)(?:\.(\d+))?(?:\.(\d+))*/i)

  if (!match) {
    return null
  }

  const major = match[1] && parseFloat(match[1])
  const minor = match[2] && parseFloat(match[2])

  if (major && minor) {
    return parseFloat(match[1] + '.' + match[2])
  } else if (major) {
    return major
  }
  return null
}())

export const IS_TBS = (/TBS\/\d+/i).test(USER_AGENT) // 仅X5内核，QQ浏览器默认x5内核，但是agent没有TBS
export const TBS_VERSION = (function() {
  var match = USER_AGENT.match(/TBS\/(\d+)/i)
  if (match && match[1]) { return match[1] }
})()// X5内核版本

export const IS_MQQB = !IS_TBS && (/MQQBrowser\/\d+/i).test(USER_AGENT) // 移动端QQ浏览器 android QQ也为true
export const IS_QQB = !IS_TBS && (/ QQBrowser\/\d+/i).test(USER_AGENT) // pc端QQ浏览器
export const IS_WECHAT = (/(micromessenger|webbrowser)/i).test(USER_AGENT) // 微信浏览器
// export const IS_MQQ = !IS_TBS &&(/(QBWebViewType)/i).test(USER_AGENT); // 手机QQ内置浏览器 不是很可靠 需要搭配 IS_IOS 来用
export const IS_MQQ = (/ QQ\/\d+/i).test(USER_AGENT) // 手机QQ内置浏览器

// Old Android is defined as Version older than 2.3, and requiring a webkit version of the android browser
export const IS_OLD_ANDROID = IS_ANDROID && (/webkit/i).test(USER_AGENT) && ANDROID_VERSION < 2.3
export const IS_NATIVE_ANDROID = IS_ANDROID && ANDROID_VERSION < 5 && appleWebkitVersion < 537

export const IS_FIREFOX = (/Firefox/i).test(USER_AGENT)
export const IS_EDGE = (/Edge/i).test(USER_AGENT)
// export const IS_CHROME = !IS_EDGE && (/Chrome/i).test(USER_AGENT);
export const IS_CHROME = (function () {
  if (!IS_EDGE && (/Chrome/i).test(USER_AGENT)) {
    return true
  } else if((/Safari/i).test(USER_AGENT) && (/CriOS/i).test(USER_AGENT)) {
    // ios chrome
    return true
  }
  return false
}()) && !IS_WECHAT && !IS_MQQB && !IS_QQB
export const CHROME_VERSION = (function() {
  const match = USER_AGENT.match(/Chrome\/(\d+)/)
  const matchIOS = USER_AGENT.match(/CriOS\/(\d+)/)
  if (match && match[1]) {
    return parseFloat(match[1])
  } else if (matchIOS && matchIOS[1]) {
    return parseFloat(matchIOS[1])
  }
  return null
}())
export const IS_IE9 = (/MSIE\s9\.0/).test(USER_AGENT)
//export const IS_IE = (/MSIE\s([\d.]+)/).test(USER_AGENT);
export const IS_IE = (/(msie\s|trident.*rv:)([\w.]+)/i).test(USER_AGENT) // <ie11
// export const IE_VERSION = function(){
//     var reg = /(msie\s|trident.*rv:)([\w.]+)/i,
//         match = USER_AGENT.match(reg);
//     if(match)
//         return match[2];
//     else
//         return null;
// }();
export const IS_IE8 = (/MSIE\s8\.0/).test(USER_AGENT)
export const IE_VERSION = (function() {
  const result = (/MSIE\s(\d+)\.\d/).exec(USER_AGENT)
  let version = result && parseFloat(result[1])

  if (!version && (/Trident\/7.0/i).test(USER_AGENT) && (/rv:11.0/).test(USER_AGENT)) {
    // IE 11 has a different user agent string than other IE versions
    version = 11.0
  }

  return version
}())

export const IS_SAFARI = (/Safari/i).test(USER_AGENT) && !IS_CHROME && !IS_ANDROID && !IS_EDGE && !IS_MQQB && !IS_QQB
export const IS_ANY_SAFARI = IS_SAFARI || IS_IOS


export const IS_WIN = /Windows/i.test(USER_AGENT) // window系统
export const IS_MAC = /MAC OS X/i.test(USER_AGENT) // MAC系统，先检查IOS

export const WIN_VER = (() => { // window版本
  /Windows NT ([.\w]+)/.test(USER_AGENT)
  return 'win' + RegExp.$1
})()

export const MAC_VER = (() => { // mac版本(暂时忽略iMac)
  /Mac OS X (\w+)/.test(USER_AGENT)
  return 'mac' + RegExp.$1
})()

export const QQ_VER = (() => { // qq浏览器版本
  /QQBrowser\/([.\d]+)/.test(USER_AGENT)
  return 'qq' + RegExp.$1
})()

export const EDGE_VER = (() => { // Edge版本
  /Edge\/([.\d]+)/.test(USER_AGENT)
  return 'edge' + RegExp.$1
})()

export const SAFARI_VER = (() => { // Edge版本
  /Version\/([.\d]+)/.test(USER_AGENT)
  return 'safari' + RegExp.$1
})()

export const FIREFOX_VER = (() => { // firefox版本
  /Firefox\/([.\d]+)/.test(USER_AGENT)
  return 'firefox' + RegExp.$1
})()
