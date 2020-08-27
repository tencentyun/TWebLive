/* global $ setBtnClickFuc */

// preset before starting RTC
import $ from 'jquery'

class Presetting {
  constructor() {
    this.options = {
      fetchUrl: 'https://www.qcloudtrtc.com/sxb_dev/?svc=account&cmd=authPrivMap',
      defaultSdkAppId: 1400188366, // unified sdkAppId for Demos on all platforms.
      accountType: 14418

    }

  }


  init() {
    // populate userId/roomId
    $('#userId').val('user_' + parseInt(Math.random() * 100000000))
    $('#roomId').val(parseInt(Math.random() * 100000))
    const roomId = this.query('roomId')
    const userId = this.query('userId')
    const privMap = this.query('privMap')
    if (roomId) {
      $('#roomId').val(roomId)
    }
    if (userId) {
      $('#userId').val(userId)
    }
    if (privMap) {
      $('#privMap').val(privMap)
    }
    $('#main-video-btns').hide()
    $('.mask').hide()
    setBtnClickFuc()
  }

  query(name) {
    const match = window.location.search.match(new RegExp('(\\?|&)' + name + '=([^&]*)(&|$)'))
    return !match ? '' : decodeURIComponent(match[2])
  }

  login(share, callback) {
    let userId = 'linda'//$('#userId').val();
    if (share) {
      userId = 'share_' + userId
    }
    const sdkAppId = this.query('sdkAppId') || this.options.defaultSdkAppId
    const roomId = '3456'//$('#roomId').val()
    const privMap = $('#privMap').val()
    $.ajax({
      type: 'POST',
      url: this.options.fetchUrl,
      dataType: 'json',
      data: JSON.stringify({
        pwd: '12345678',
        appid: parseInt(sdkAppId),
        roomnum: parseInt(roomId),
        privMap: parseInt(privMap),
        identifier: userId,
        accounttype: this.options.accountType
      }),
      success: function (json) {
        if (json && json.errorCode === 0) {
          const userSig = json.data.userSig
          const privateMapKey = json.data.privMapEncrypt
          callback({
            sdkAppId,
            userId,
            userSig,
            roomId,
            privateMapKey
          })
        } else {
          console.error('got invalid json:' + json)
        }
      },
      error: function (err) {
        console.error('failed to retreive userSig')
      }
    })
  }
}

export default Presetting
