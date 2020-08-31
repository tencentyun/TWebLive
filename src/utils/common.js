/*eslint-disable*/
export function translateGroupSystemNotice(message) {
  const groupName = message.payload.groupProfile.name || message.payload.groupProfile.groupID
  switch (message.payload.operationType) {
    case 1:
      return `${message.payload.operatorID} 申请加入群组：${groupName}`
    case 2:
      return `成功加入群组：${groupName}`
    case 3:
      return `申请加入群组：${groupName}被拒绝`
    case 4:
      return `你被管理员${message.payload.operatorID}踢出群组：${groupName}`
    case 5:
      return `群：${groupName} 已被${message.payload.operatorID}解散`
    case 6:
      return `${message.payload.operatorID}创建群：${groupName}`
    case 7:
      return `${message.payload.operatorID}邀请你加群：${groupName}`
    case 8:
      return `你退出群组：${groupName}`
    case 9:
      return `你被${message.payload.operatorID}设置为群：${groupName}的管理员`
    case 10:
      return `你被${message.payload.operatorID}撤销群：${groupName}的管理员身份`
    case 255:
      return '自定义群系统通知: ' + message.payload.userDefinedField
  }
}

export const errorMap = {
  500: '服务器错误',
  602: '用户名或密码不合法',
  610: '用户名格式错误',
  612: '用户已存在',
  620: '用户不存在',
  621: '密码错误'
}

export function getUrlKey(name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  let r = window.location.search.substr(1).match(reg)
  if (r != null) {
    return unescape(r[2])
  }
  return null
}

export function isValidFlv(url) {
  let domian = url.replace(/^https?:\/\/(.*?)(:\d+)?\/.*$/, '$1').toString()
  return domian === '3891.liveplay.myqcloud.com'
}
export const isMobileType = {
  Android: function () {
    return navigator.userAgent.match(/Android/i)
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry|BB10/i)
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i)
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i)
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i)
  },
  isSafari:function() {
    return /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
  },
  any: function () {
    return (isMobileType.Android() || isMobileType.BlackBerry() || isMobileType.iOS() || isMobileType.Opera() || isMobileType.Windows())
  },
  getOsName: function () {
    var osName = 'Unknown OS'
    if (isMobileType.Android()) {
      osName = 'Android'
    }

    if (isMobileType.BlackBerry()) {
      osName = 'BlackBerry'
    }

    if (isMobileType.iOS()) {
      osName = 'iOS'
    }

    if (isMobileType.Opera()) {
      osName = 'Opera Mini'
    }

    if (isMobileType.Windows()) {
      osName = 'Windows'
    }
    return {
      osName,
      type: 'mobile'
    }
  }
}


export function detectDesktopOS() {
  var unknown = '-'

  var nVer = navigator.appVersion
  var nAgt = navigator.userAgent

  var os = unknown
  var clientStrings = [{
    s: 'Chrome OS',
    r: /CrOS/
  }, {
    s: 'Windows 10',
    r: /(Windows 10.0|Windows NT 10.0)/
  }, {
    s: 'Windows 8.1',
    r: /(Windows 8.1|Windows NT 6.3)/
  }, {
    s: 'Windows 8',
    r: /(Windows 8|Windows NT 6.2)/
  }, {
    s: 'Windows 7',
    r: /(Windows 7|Windows NT 6.1)/
  }, {
    s: 'Windows Vista',
    r: /Windows NT 6.0/
  }, {
    s: 'Windows Server 2003',
    r: /Windows NT 5.2/
  }, {
    s: 'Windows XP',
    r: /(Windows NT 5.1|Windows XP)/
  }, {
    s: 'Windows 2000',
    r: /(Windows NT 5.0|Windows 2000)/
  }, {
    s: 'Windows ME',
    r: /(Win 9x 4.90|Windows ME)/
  }, {
    s: 'Windows 98',
    r: /(Windows 98|Win98)/
  }, {
    s: 'Windows 95',
    r: /(Windows 95|Win95|Windows_95)/
  }, {
    s: 'Windows NT 4.0',
    r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/
  }, {
    s: 'Windows CE',
    r: /Windows CE/
  }, {
    s: 'Windows 3.11',
    r: /Win16/
  }, {
    s: 'Android',
    r: /Android/
  }, {
    s: 'Open BSD',
    r: /OpenBSD/
  }, {
    s: 'Sun OS',
    r: /SunOS/
  }, {
    s: 'Linux',
    r: /(Linux|X11)/
  }, {
    s: 'iOS',
    r: /(iPhone|iPad|iPod)/
  }, {
    s: 'Mac OS X',
    r: /Mac OS X/
  }, {
    s: 'Mac OS',
    r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/
  }, {
    s: 'QNX',
    r: /QNX/
  }, {
    s: 'UNIX',
    r: /UNIX/
  }, {
    s: 'BeOS',
    r: /BeOS/
  }, {
    s: 'OS/2',
    r: /OS\/2/
  }, {
    s: 'Search Bot',
    r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/
  }]
  for (var i = 0, cs; cs = clientStrings[i]; i++) {
    if (cs.r.test(nAgt)) {
      os = cs.s
      break
    }
  }

  var osVersion = unknown

  if (/Windows/.test(os)) {
    if (/Windows (.*)/.test(os)) {
      osVersion = /Windows (.*)/.exec(os)[1]
    }
    os = 'Windows'
  }

  switch (os) {
    case 'Mac OS X':
      if (/Mac OS X (10[\.\_\d]+)/.test(nAgt)) {
        osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1]
      }
      break
    case 'Android':
      if (/Android ([\.\_\d]+)/.test(nAgt)) {
        osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1]
      }
      break
    case 'iOS':
      if (/OS (\d+)_(\d+)_?(\d+)?/.test(nAgt)) {
        osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer)
        osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0)
      }
      break
  }

  return {
    osName: os + osVersion,
    type: 'desktop'
  }
}

export function getOS() {
  if (isMobileType.any()) {
    return isMobileType.getOsName()
  } else {
    return detectDesktopOS()
  }
}
export function getBroswer() {
  var sys = {}
  var ua = navigator.userAgent.toLowerCase()
  var s;
  (s = ua.match(/edge\/([\d.]+)/))
    ? (sys.edge = s[1])
    : (s = ua.match(/rv:([\d.]+)\) like gecko/))
    ? (sys.ie = s[1])
    : (s = ua.match(/msie ([\d.]+)/))
      ? (sys.ie = s[1])
      : (s = ua.match(/firefox\/([\d.]+)/))
        ? (sys.firefox = s[1])
        : (s = ua.match(/chrome\/([\d.]+)/))
          ? (sys.chrome = s[1])
          : (s = ua.match(/opera.([\d.]+)/))
            ? (sys.opera = s[1])
            : (s = ua.match(/version\/([\d.]+).*safari/))
              ? (sys.safari = s[1])
              : 0

  if (sys.edge) return { broswer: 'Edge', version: sys.edge }
  if (sys.ie) return { broswer: 'IE', version: sys.ie }
  if (sys.firefox) return { broswer: 'Firefox', version: sys.firefox }
  if (sys.chrome) return { broswer: 'Chrome', version: sys.chrome }
  if (sys.opera) return { broswer: 'Opera', version: sys.opera }
  if (sys.safari) return { broswer: 'Safari', version: sys.safari }

  return { broswer: '', version: '0' }
}
