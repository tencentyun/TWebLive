<template>
  <div>
    <!-- 设备检测按钮 -->
    <div id="device-testing-btn" class="device-testing-btn">
      <div class="device-icon">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-shebei"></use>
        </svg>
      </div>
<!--      设备检测-->
    </div>
    <!-- 设备检测界面弹窗 -->

    <div id="device-testing-root" style="display: none;">
      <!-- 设备检测卡片 -->
      <div class="device-testing-card">
        <!-- 设备检测准备界面 -->
        <div id="device-testing-prepare" class="device-testing-prepare">
          <div class="testing-title">设备连接</div>
          <div class="testing-prepare-info">设备检测前请务必给当前页面开放摄像头，麦克风权限哦~</div>
          <div class="device-display">
            <div id="device-camera" class="device icon-normal">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-shiping-xue"></use>
              </svg>
            </div>
            <div id="device-voice" class="device icon-normal">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-shengyin"></use>
              </svg>
            </div>
            <div id="device-mic" class="device icon-normal">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-maikefeng-xue"></use>
              </svg>
            </div>
            <div id="device-network" class="device icon-normal">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-wangluo"></use>
              </svg>
            </div>
          </div>
          <div id="device-loading" class="loading-background">
            <div class="device-loading"></div>
          </div>
          <!-- 连接结果提示 -->
          <div class="connect-info">
            <!-- 连接结果 -->
            <div id="connect-info"></div>
            <!-- 错误icon及错误解决指引 -->
            <div id="connect-attention-container" class="connect-attention-container" style="display: none;">
              <div id="connect-attention-icon" class="connect-attention-icon">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-warn"></use>
                </svg>
              </div>
              <div id="connect-attention-info" class="connect-attention-info" style="display: none;">
              </div>
            </div>
          </div>
          <!-- 设备连接页面button -->
          <div class="testing-btn-display">
            <div id="start-test-btn" class="test-btn start-test start-gray">开始检测</div>
            <div id="connect-again-btn" class="test-btn connect-again" style="display: none;">重新连接</div>
          </div>
        </div>
        <!-- 设备检测tab页 -->
        <div id="device-testing" class="device-testing" style="display: none;">
          <div class="device-testing-title">
            <div id="camera-testing" class="testing icon-gray">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-shiping-xue"></use>
              </svg>
            </div>
            <div id="voice-testing" class="testing icon-gray">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-shengyin"></use>
              </svg>
            </div>
            <div id="mic-testing" class="testing icon-gray">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-maikefeng-xue"></use>
              </svg>
            </div>
            <div id="network-testing" class="testing icon-gray">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-wangluo"></use>
              </svg>
            </div>
          </div>
          <!-- 设备检测-摄像头检测 -->
          <div id="camera-testing-body" class="testing-body" style="display: none;">
            <div class="device-list camera-device-list">
              <div class="select-title" style="display: block;">摄像头选择</div>
              <div class="select-list" style="display: block;">
                <select name="select" id="camera-select" class="device-select"></select>
              </div>
            </div>
            <div id="camera-video" class="camera-video"></div>
            <div class="testing-info-container">
              <div class="testing-info">是否可以清楚的看到自己？</div>
              <div class="button-list">
                <div id="camera-fail" class="fail-button">看不到</div>
                <div id="camera-success" class="success-button">可以看到</div>
              </div>
            </div>
          </div>
          <!-- 设备检测-播放器检测 -->
          <div id="voice-testing-body" class="testing-body" style="display: none;">
            <div class="device-list camera-device-list">
              <div class="select-title" style="display: block;">扬声器选择</div>
              <div class="select-list" style="display: block;">
                <select name="select" id="voice-select" class="device-select"></select>
              </div>
            </div>
            <div class="audio-control">
              <div class="audio-control-info">请调高设备音量, 点击播放下面的音频试试～</div>
              <audio id="audio-player"
                     src="https://trtc-1252463788.cos.ap-guangzhou.myqcloud.com/web/assets/bgm-test.mp3"
                     controls></audio>
            </div>
            <div class="testing-info-container">
              <div class="testing-info">是否可以听到声音？</div>
              <div class="button-list">
                <div id="voice-fail" class="fail-button">听不到</div>
                <div id="voice-success" class="success-button">可以听到</div>
              </div>
            </div>
          </div>
          <!-- 设备检测-麦克风检测 -->
          <div id="mic-testing-body" class="testing-body" style="display: none;">
            <div class="device-list camera-device-list">
              <div class="select-title" style="display: block;">麦克风选择</div>
              <div class="select-list" style="display: block;">
                <select name="select" id="mic-select" class="device-select"></select>
              </div>
            </div>
            <div class="mic-testing-container">
              <div class="mic-testing-info">对着麦克风说'哈喽'试试～</div>
              <div id="mic-bar-container" class="mic-bar-container"></div>
              <div id="audio-container"></div>
            </div>
            <div class="testing-info-container">
              <div class="testing-info">是否可以看到音量图标跳动？</div>
              <div class="button-list">
                <div id="mic-fail" class="fail-button">看不到</div>
                <div id="mic-success" class="success-button">可以看到</div>
              </div>
            </div>
          </div>
          <!-- 设备检测-硬件及网速检测 -->
          <div id="network-testing-body" class="testing-body" style="display: none;">
            <div class="testing-index-list">
              <div class="testing-index-group">
                <div class="testing-index">操作系统</div>
                <div id="system"></div>
              </div>
              <div class="testing-index-group">
                <div class="testing-index">浏览器版本</div>
                <div id="browser"></div>
              </div>
              <!-- <div class="testing-index-group">
                  <div class="testing-index">IP地址</div>
                  <div id="ip"></div>
              </div> -->
              <div class="testing-index-group">
                <div class="testing-index">屏幕共享能力</div>
                <div id="screen-share"></div>
              </div>
              <div class="testing-index-group">
                <div class="testing-index">网络质量</div>
                <div id="uplink-network" class="network-loading"></div>
              </div>
            </div>
            <div class="testing-footer">
              <div id="testing-report-btn" class="test-btn">查看检测报告</div>
            </div>
          </div>
        </div>
        <!-- 设备检测报告 -->
        <div id="device-testing-report" class="device-testing-report" style="display: none;">
          <div class="testing-title">检测报告</div>
          <!-- 检测报告内容 -->
          <div class="device-report-list">
            <!-- 摄像头报告信息 -->
            <div class="device-report camera-report">
              <div class="device-info">
                <div class="report-icon">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-shiping-xue"></use>
                  </svg>
                </div>
                <div id="camera-name" class="device-name"></div>
              </div>
              <div id="camera-testing-result" class="camera-testing-result"></div>
            </div>
            <!-- 扬声器报告信息 -->
            <div id="voice-report" class="device-report voice-report">
              <div class="device-info">
                <div class="report-icon">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-shengyin"></use>
                  </svg>
                </div>
                <div id="voice-name" class="device-name"></div>
              </div>
              <div id="voice-testing-result" class="voice-testing-result"></div>
            </div>
            <!-- 麦克风报告信息 -->
            <div class="device-report mic-report">
              <div class="device-info">
                <div class="report-icon">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-maikefeng-xue"></use>
                  </svg>
                </div>
                <div id="mic-name" class="device-name"></div>
              </div>
              <div id="mic-testing-result" class="mic-testing-result"></div>
            </div>
            <!-- 网络报告信息 -->
            <div class="device-report network-report">
              <div class="device-info">
                <div class="report-icon">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-wangluo"></use>
                  </svg>
                </div>
                <div id="network-name" class="device-name"></div>
              </div>
              <div id="network-testing-result" class="network-testing-result"></div>
            </div>
          </div>
          <div class="device-report-footer">
            <div id="testing-again" class="device-report-btn testing-agin">重新检测</div>
            <div id="testing-finish" class="device-report-btn testing-finish">完成检测</div>
          </div>
        </div>
        <!-- 设备检测关闭按钮 -->
        <div id="device-testing-close-btn" class="device-testing-close-btn">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-baseline-close-px"></use>
          </svg>
        </div>
      </div>
    </div>
    <!-- 展示不支持webRTC的提示 -->

    <div id="remind-info-container" style="justify-content: center; display: none;">
      <!-- 在ios端webview引导用户打开safari浏览器 -->
      <div id="webview-remind" class="webview-remind">
        <img class="webview-remind-img" src="./img/right-top-arrow.png" alt="right-top-arrow">
        <div class="webview-remind-info">
          <span>点击右上角 ··· 图标</span>
          <span style="display: inline-block; margin-top: 10px;">选择在safari浏览器中打开</span>
        </div>
      </div>
      <!-- 提醒用户用可以使用的浏览器打开 -->
      <div id="browser-remind" class="browser-remind">
        <div id="remind-icon" style="width: 100%; font-size: 28px;">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-warn"></use>
          </svg>
          <span style="display: inline-block; margin-left: 5px">提示</span>
        </div>
        <div id="remind-info" class="remind-info"></div>
      </div>
    </div>


  </div>

</template>

<script>
  import './icon/iconfont.js'
  import $ from 'jquery'
  import TRTC from 'trtc-js-sdk'
  import Presetting from './presetting'
  import { getOS, getBroswer } from '../../utils/common.js'

  export default {
    name: 'test',
    props: ['isTest'],
    data() {
      return {
        isSafari: null,
        hasCameraDevice: false,
        hasMicAndVoiceDevice: false,
        hasCameraConnect: null,
        hasVoiceConnect: null,
        hasMicConnect: null,
        hasNetworkConnect: null,
        cameraTestingResult: {},
        voiceTestingResult: {},
        micTestingResult: {},
        networkTestingResult: {},
// 记录检测步骤，用于关闭时清空弹窗
        completedTestingPageIdList: [],
        curTestingPageId: '',
        localStream: null,
        client: null,
        timeout: null,
// 监听到network-quality事件的次数
        networkQualityNum: 0,

        deviceFailAttention: '1. 若浏览器弹出提示，请选择“允许”<br>'
          + '2. 若杀毒软件弹出提示，请选择“允许”<br>'
          + '3. 检查浏览器设置，允许网页访问摄像头及麦克风<br>'
          + '4. 检查摄像头/麦克风是否正确连接并开启<br>'
          + '5. 尝试重新连接摄像头/麦克风<br>'
          + '6. 尝试重启设备后重新检测',
        networkFailAttention: '1. 请检查设备是否联网<br>'
          + '2. 请刷新网页后再次检测<br>'
          + '3. 请尝试更换网络后再次检测',

// 网络参数对照表
        NETWORK_QUALITY: {
          '0': '未知',
          '1': '极佳',
          '2': '较好',
          '3': '一般',
          '4': '差',
          '5': '极差',
          '6': '断开',
        },

// 设备检测tab页签对应的执行方法
        pageCallbackConfig: {
          'camera-testing-body': 'startCameraTesting',
          'voice-testing-body': 'startVoiceTesting',
          'mic-testing-body': 'startMicTesting',
          'network-testing-body': 'startNetworkTesting',
        },

        //  变量  获取设备信息
        cameraList: [],
        micList: [],
        voiceList: [],

        cameraId: '',
        micId: '',
        // getUserMedia: navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia

      }
    },
    created() {
      // 监听设备变化


    },
    mounted() {
      this.deviceTestingInit()
      this.init()
      if (navigator.mediaDevices) {
        navigator.mediaDevices.ondevicechange = async function (event) {
          // 当前在摄像头检测页
          if (this.curTestingPageId === 'camera-testing-body') {
            await this.updateCameraDeviceList()
            return
          }
          // 当前在扬声器检测页
          if (this.curTestingPageId === 'voice-testing-body') {
            await this.updateVoiceDeviceList()
            return
          }
          // 当前在麦克风检测页
          if (this.curTestingPageId === 'mic-testing-body') {
            await this.updateMicDeviceList()
            return
          }
        }

      }
      // 初始化监听器
    },

    methods: {
      init() {
        this.isSafari =
          /Safari/.test(navigator.userAgent) &&
          !/Chrome/.test(navigator.userAgent) &&
          !/CriOS/.test(navigator.userAgent)
        this.hideVoiceForSafari()

      },
      /**
       * webRTC不支持的浏览器需要提示用户跳转或者切换
       */
      showNotSupportRemindInfo() {
        let osType = getOS().type
        $('#remind-info-container').show()
        switch (osType) {
          case 'desktop':
            this.showDesktopRemindInfo()
            break
          case 'mobile':
            this.showMobileRemindInfo()
            break
          default:
            break
        }
      },

      /**
       * 获取桌面浏览器提醒信息
       */
      showDesktopRemindInfo() {
        let osName = getOS().osName
        $('#browser-remind').show()
        if (osName.indexOf('Mac OS') > -1) {
          $('#remind-info').text('请使用chrome或者safari浏览器打开链接')
        } else {
          $('#remind-info').text('请使用chrome浏览器打开链接')
        }
      },

      /**
       * 获取移动端浏览器提醒信息
       */
      showMobileRemindInfo() {
        let osName = getOS().osName
        if (osName === 'iOS') {
          let isWeChat = /MicroMessenger/.test(navigator.userAgent)
          let isQQ = /QQ/.test(navigator.userAgent)
          if (isWeChat || isQQ) {
            $('#webview-remind').show()
            return
          }
          if (!this.isSafari) {
            $('#browser-remind').show()
            $('#remind-info').text('当前浏览器不支持webRTC, 请使用safari浏览器打开链接')
            return
          }
        }
      },

      /**
       * safari浏览器中隐藏扬声器相关检测
       */
      hideVoiceForSafari() {
        if (!this.isSafari) return
        $('#connect-voice').hide()
        $('#device-voice').hide()
        $('#voice-testing').hide()
        // $('#voice-testing-body').hide()
        $('#voice-report').hide()
        $('#device-mic').addClass('safari')
        $('#device-network').addClass('safari')
        $('#mic-testing').addClass('safari')
        $('#network-testing').addClass('safari')
      },
      async deviceTestingInit() {
        // 当前浏览器不支持webRTC
        if (navigator.mediaDevices === undefined) {
          this.showNotSupportRemindInfo()
          return
        }
        let self = this
        // 点击【设备检测】文字, 点击 【重新连接】按钮
        $('#device-testing-btn, #connect-again-btn').on('click', () => {
          this.startDeviceConnect()
        })
        // 连接设备错误icon
        $('#connect-attention-icon').on('mouseover', () => {
          $('#connect-attention-info').show()
        })
        // 连接设备错误icon
        $('#connect-attention-icon').on('mouseout', () => {
          $('#connect-attention-info').hide()
        })
        // 【开始检测】开始设备检测按钮
        $('#start-test-btn').on('click', () => {
          if ($(this).hasClass('start-gray')) return
          $('#device-testing-prepare').hide()
          $('#device-testing').show()
          this.startCameraTesting()
        })
        // 摄像头检测失败/成功
        $('#camera-fail, #camera-success').on('click', (e) => {
          this.cameraTestingResult.statusResult = e.target.id === 'camera-success'
          $('#camera-testing-body').hide()
          this.localStream.close()
          // safari浏览器跳过扬声器检测
          this.isSafari ? this.startMicTesting() : this.startVoiceTesting()
        })
        // 播放器检测失败/成功
        $('#voice-fail, #voice-success').on('click', (e) => {
          // $(this).attr('id')
          this.voiceTestingResult.statusResult = e.target.id === 'voice-success'
          $('#voice-testing-body').hide()
          let audioPlayer = document.querySelector('#audio-player')
          if (!audioPlayer.paused) {
            audioPlayer.pause()
          }
          this.startMicTesting()
        })
        // 麦克风测试失败/成功
        $('#mic-fail, #mic-success').on('click', (e) => {
          this.micTestingResult.statusResult = e.target.id === 'mic-success'
          $('#mic-testing-body').hide()
          this.localStream.close()
          this.startNetworkTesting()
        })
        // 点击【查看检测报告】按钮
        $('#testing-report-btn').on('click', () => {
          this.showTestingReport()
          this.localStream.close()
          this.client && this.client.leave()
          this.client && this.client.off('network-quality')
        })
        // 点击【重新测试】按钮
        $('#testing-again').on('click', () => {
          $('#device-testing-report').hide()
          this.startDeviceConnect()
          this.completedTestingPageIdList = []
        })
        // 点击【测试完成】按钮 / 点击关闭图标
        $('#testing-finish, #device-testing-close-btn').on('click', () => {
          this.finishDeviceTesting()
        })
        // 测试tab页切换
        $('#camera-testing, #voice-testing, #mic-testing, #network-testing').on('click', function () {
          let targetPageId = $(this).attr('id') + '-body'
          if (targetPageId !== self.curTestingPageId && self.completedTestingPageIdList.indexOf(targetPageId) > -1) {
            $(`#${self.curTestingPageId}`).hide()
            self.localStream && self.localStream.close()
            self.client && self.client.leave()
            self.client && self.client.off('network-quality')
            // 停止播放器的音乐
            let audioPlayer = document.querySelector('#audio-player')
            if (!audioPlayer.paused) {
              audioPlayer.pause()
            }
            // 展示要切换的设备检测tab页面
            $(`#${targetPageId}`).show()
            let pageCallbackConfig = self.pageCallbackConfig
            self[pageCallbackConfig[targetPageId]] && self[pageCallbackConfig[targetPageId]]()
          }
        })
        // 摄像头设备切换
        $('#camera-select').change(async function () {
          let newCameraId = $(this).children('option:selected').val()
          localStorage.setItem('txy_webRTC_cameraId', newCameraId)
          self.cameraTestingResult.device = {
            label: $(this).children('option:selected').text(),
            deviceId: $(this).children('option:selected').val(),
            kind: 'videoinput',
          }
          await self.localStream.switchDevice('video', newCameraId)
        })
        // 扬声器设备切换
        $('#voice-select').change(async function () {
          let newVoiceId = $(this).children('option:selected').val()
          localStorage.setItem('txy_webRTC_voiceId', newVoiceId)
          self.voiceTestingResult.device = {
            label: $(this).children('option:selected').text(),
            deviceId: $(this).children('option:selected').val(),
            kind: 'audiooutput',
          }

          let audioPlayer = document.querySelector('#audio-player')
          await audioPlayer.setSinkId(newVoiceId)
        })
        // 麦克风设备切换
        $('#mic-select').change(async function () {
          let newMicID = $(this).children('option:selected').val()
          localStorage.setItem('txy_webRTC_micId', newMicID)
          self.micTestingResult.device = {
            label: $(this).children('option:selected').text(),
            deviceId: $(this).children('option:selected').val(),
            kind: 'audioinput',
          }
          await self.localStream.switchDevice('audio', newMicID)
        })

        $('body').on('click', function () {
          $('#device-connect-list').hide()
        })

        // 获取设备信息
        await this.getDevicesInfo()
        // 初始化设备弹窗信息
        this.startDeviceConnect()
      },
      // 获取设备信息及网络连接信息
      async getDevicesInfo() {

        this.cameraList = await TRTC.getCameras()
        this.micList = await TRTC.getMicrophones()
        this.voiceList = await TRTC.getSpeakers()

        if (this.cameraList.length > 0) {
          this.hasCameraDevice = true
        }
        if (this.micList.length > 0 && this.voiceList.length > 0) {
          this.hasMicAndVoiceDevice = true
        }
        this.cameraList.forEach(camera => {
          if (camera.deviceId.length > 0) {
            this.hasCameraConnect = true
          }
        })
        this.micList.forEach(mic => {
          if (mic.deviceId.length > 0) {

            this.hasMicConnect = true
          }
        })
        if (this.isSafari) {
          this.hasVoiceConnect = true
        } else {
          this.voiceList.forEach(voice => {
            if (voice.deviceId.length > 0) {
              this.hasVoiceConnect = true
            }
          })
        }
        this.hasNetworkConnect = !!navigator.onLine
      },

      showDeviceStatus() {
        $('#device-connect-list').show()
        this.timeout = setTimeout(() => {
          $('#device-connect-list').hide()
        }, 3000)
        $('#connect-camera').css('color', `${this.hasCameraConnect ? 'green' : 'red'}`)
        $('#connect-voice').css('color', `${this.hasVoiceConnect ? 'green' : 'red'}`)
        $('#connect-mic').css('color', `${this.hasMicConnect ? 'green' : 'red'}`)
        $('#connect-network').css('color', `${this.hasNetworkConnect ? 'green' : 'red'}`)
        if (!(this.hasCameraConnect && this.hasVoiceConnect && this.hasMicConnect && this.hasNetworkConnect)) {
          $('#device-testing-btn').css('color', 'red')
        } else {
          $('#device-testing-btn').css('color', 'green')
        }
      },
      // 弹窗-设备连接检查
      startDeviceConnect() {

        // 显示设备检测弹窗
        $('#device-testing-root').show()
        // 设备检测弹窗-设备连接页
        $('#device-testing-prepare').show()

        this.curTestingPageId = 'device-testing-prepare'
        this.initTestingTabTitle()
        // 在设备检测弹窗显示设备连接信息
        this.showDeviceConnectInfo()
        // 如果有设备未连接，唤起请求弹窗
        if (!(this.hasCameraConnect && this.hasVoiceConnect && this.hasMicConnect)) {
          console.log(navigator.mediaDevices)
          navigator.mediaDevices.getUserMedia({ video: this.hasCameraDevice, audio: this.hasMicAndVoiceDevice })
            .then(async () => {
              // 重新获取设备信息
              await this.getDevicesInfo()
              // 更新首页popover的option list
              this.getDevicesList()
              // 显示设备连接信息
              this.showDeviceConnectInfo()
            })
            .catch(err => {
              console.log('err', err.name)
            })
        }
      },
      showDeviceConnectInfo() {
        if (!(this.hasCameraConnect && this.hasVoiceConnect && this.hasMicConnect && this.hasNetworkConnect)) {
          $('#device-testing-btn').css('color', 'red')
        } else {
          $('#device-testing-btn').css('color', 'green')
        }
        // 隐藏设备连接失败提示
        $('#connect-attention-container').hide()

        // 设备连接中
        $('#device-loading').show()
        $('#connect-info').text('设备正在连接中，请稍等').css('color', '#cccccc')
        $('#device-camera, #device-voice, #device-mic, #device-network').removeClass('connect-success connect-fail')
        $('#connect-again-btn').hide()
        $('#start-test-btn').addClass('start-gray').show()

        // 设备连接结束，展示连接结果
        setTimeout(() => {
          $('#device-loading').hide()
          $('#device-camera').removeClass('connect-success connect-fail')
            .addClass(`${this.hasCameraConnect ? 'connect-success' : 'connect-fail'}`)
          $('#device-voice').removeClass('connect-success connect-fail')
            .addClass(`${this.hasVoiceConnect ? 'connect-success' : 'connect-fail'}`)
          $('#device-mic').removeClass('connect-success connect-fail')
            .addClass(`${this.hasMicConnect ? 'connect-success' : 'connect-fail'}`)
          $('#device-network').removeClass('connect-success connect-fail')
            .addClass(`${this.hasNetworkConnect ? 'connect-success' : 'connect-fail'}`)

          if (!(this.hasCameraConnect && this.hasVoiceConnect && this.hasMicConnect)) {
            let connectInfo = this.hasNetworkConnect
              ? '设备连接失败，请允许网页访问摄像头及麦克风'
              : '设备及网络连接失败，请允许网页访问摄像头及麦克风并检查网络连接'
            $('#connect-info').text(connectInfo).css('color', 'red')
            // 显示设备连接失败引导
            $('#connect-attention-container').show()
            $('#connect-attention-info').html(this.deviceFailAttention)
            // 切换按钮状态
            $('#start-test-btn').hide()
            $('#connect-again-btn').show()
          }
          if ((this.hasCameraConnect && this.hasVoiceConnect && this.hasMicConnect) && !this.hasNetworkConnect) {
            $('#connect-info').text('网络连接失败，请检查网络连接').css('color', 'red')
            // 显示网络连接失败引导
            $('#connect-attention-container').show()
            $('#connect-attention-info').html(this.networkFailAttention)
            // 切换按钮状态
            $('#start-test-btn').hide()
            $('#connect-again-btn').show()
          }
          if (this.hasCameraConnect && this.hasVoiceConnect && this.hasMicConnect && this.hasNetworkConnect) {
            $('#connect-info').text('设备及网络连接成功，请开始设备检测').css('color', '#008000')
            $('#connect-again-btn').hide()
            $('#start-test-btn').removeClass('start-gray').show()
          }
        }, 2000)
      },
      // 更新首页popover的option list
      getDevicesList() {
        // populate camera options
        TRTC.getCameras().then(devices => {
          $('#camera-option').empty()
          devices.forEach(device => {
            if (!this.cameraId) {
              this.cameraId = device.deviceId
            }
            let div = $('<div></div>')
            div.attr('id', device.deviceId)
            div.html(device.label)
            div.appendTo('#camera-option')
          })
        })

        // populate microphone options
        TRTC.getMicrophones().then(devices => {
          $('#mic-option').empty()
          devices.forEach(device => {
            if (!this.micId) {
              this.micId = device.deviceId
            }
            let div = $('<div></div>')
            div.attr('id', device.deviceId)
            div.html(device.label)
            div.appendTo('#mic-option')
          })
        })
      },

      // 摄像头检测页-检测展示摄像头设备选择列表
      async updateCameraDeviceList() {
        let cameraDevices = await TRTC.getCameras()
        // cameraDevices.filter(camera => camera.deviceId !== 'default')
        $('#camera-select').empty()
        cameraDevices.forEach(camera => {
          let option = $('<option></option>')
          option.attr('value', camera.deviceId)
          option.html(camera.label)
          option.appendTo('#camera-select')
        })

        // 如果有用户设备选择缓存，优先使用缓存的deviceId
        let cacheCameraDevice = cameraDevices.filter(camera => camera.deviceId === localStorage.getItem('txy_webRTC_cameraId'))
        if (cacheCameraDevice.length > 0) {
          $('#camera-select').val(localStorage.getItem('txy_webRTC_cameraId'))
          this.cameraTestingResult.device = cacheCameraDevice[0]
        } else {
          $('#camera-select').val(cameraDevices[0].deviceId)
          this.cameraTestingResult.device = cameraDevices[0]
        }
      },

      // 摄像头设备测试
      async startCameraTesting() {
        $('#camera-testing-body').show()
        this.curTestingPageId = 'camera-testing-body'
        $('#camera-testing').removeClass('icon-normal').addClass('icon-blue complete')
        this.completedTestingPageIdList.push('camera-testing-body')
        this.completedTestingPageIdList = [...new Set(this.completedTestingPageIdList)]

        await this.updateCameraDeviceList()

        // 创建本地视频流
        this.localStream = TRTC.createStream({
          audio: false,
          video: true,
          cameraId: this.cameraTestingResult.device.deviceId,
        })
        this.localStream.initialize()
        this.localStream.play('camera-video')
      },

      // 初始化/更新扬声器设备数组
      async updateVoiceDeviceList() {
        // 获取扬声器设备并展示在界面中
        let voiceDevices = await TRTC.getSpeakers()
        //voiceDevices = voiceDevices.filter(voice => voice.deviceId !== 'default')
        $('#voice-select').empty()
        voiceDevices.forEach(voice => {
          let option = $('<option></option>')
          option.attr('value', voice.deviceId)
          option.html(voice.label)
          option.appendTo('#voice-select')
        })

        // 如果有用户设备选择缓存，优先使用缓存的deviceId
        let cacheVoiceDevice = voiceDevices.filter(mic => mic.deviceId === localStorage.getItem('txy_webRTC_voiceId'))
        if (cacheVoiceDevice.length > 0) {
          $('#voice-select').val(localStorage.getItem('txy_webRTC_voiceId'))
          this.voiceTestingResult.device = cacheVoiceDevice[0]
        } else {
          $('#voice-select').val(voiceDevices[0].deviceId)
          this.voiceTestingResult.device = voiceDevices[0]
        }
      },

      // 播放器设备测试
      async startVoiceTesting() {
        $('#voice-testing-body').show()
        this.curTestingPageId = 'voice-testing-body'
        $('#voice-testing').removeClass('icon-gray').addClass('icon-blue complete')
        this.completedTestingPageIdList.push('voice-testing-body')
        this.completedTestingPageIdList = [...new Set(this.completedTestingPageIdList)]

        await this.updateVoiceDeviceList()
      },

      // 更新/初始化麦克风设备
      async updateMicDeviceList() {
        // 展示麦克风设备选择
        let micDevices = await TRTC.getMicrophones()
        //micDevices = micDevices.filter(mic => mic.deviceId !== 'default')
        $('#mic-select').empty()
        micDevices.forEach(mic => {
          let option = $('<option></option>')
          option.attr('value', mic.deviceId)
          option.html(mic.label)
          option.appendTo('#mic-select')
        })

        // 如果有用户设备选择缓存，优先使用缓存的deviceId
        let cacheMicDevice = micDevices.filter(mic => mic.deviceId === localStorage.getItem('txy_webRTC_micId'))
        if (cacheMicDevice.length > 0) {
          $('#mic-select').val(localStorage.getItem('txy_webRTC_micId'))
          this.micTestingResult.device = cacheMicDevice[0]
        } else {
          $('#mic-select').val(micDevices[0].deviceId)
          this.micTestingResult.device = micDevices[0]
        }
      },

      // 麦克风设备测试
      async startMicTesting() {
        $('#mic-testing-body').show()
        this.curTestingPageId = 'mic-testing-body'
        $('#mic-testing').removeClass('icon-gray').addClass('icon-blue complete')
        this.completedTestingPageIdList.push('mic-testing-body')
        this.completedTestingPageIdList = [...new Set(this.completedTestingPageIdList)]

        await this.updateMicDeviceList()

        // 展示麦克风的声音大小显示
        if ($('#mic-bar-container').children().length === 0) {
          for (let index = 0; index < 28; index++) {
            $('<div></div>').addClass('mic-bar').appendTo('#mic-bar-container')
          }
        }

        // 创建本地音频流
        this.localStream = TRTC.createStream({
          audio: true,
          microphoneId: this.micTestingResult.device.deviceId,
          video: false,
        })
        this.localStream.initialize()
        this.localStream.play('audio-container')

        // 监听音量，并量化显示出来
        setInterval(() => {
          let volume = this.localStream.getAudioLevel()
          let num = Math.ceil(28 * volume)
          $('#mic-bar-container').children('.active').removeClass('active')
          for (let i = 0; i < num; i++) {
            $('#mic-bar-container').children().slice(0, i).addClass('active')
          }
        }, 100)
      },

      // 系统信息展示
      async startNetworkTesting() {
        $('#network-testing-body').show()
        $('#testing-report-btn').hide()
        this.curTestingPageId = 'network-testing-body'
        $('#network-testing').removeClass('icon-gray').addClass('icon-blue complete')
        this.completedTestingPageIdList.push('network-testing-body')
        this.completedTestingPageIdList = [...new Set(this.completedTestingPageIdList)]

        this.networkQualityNum = 0
        $('#uplink-network').addClass('network-loading').text('')

        // 获取系统信息
        $('#system').empty()
        let OSInfo = getOS()
        $('<div></div>').text(OSInfo.osName).appendTo('#system')

        // 获取浏览器及版本信息
        $('#browser').empty()
        let browser = getBroswer()
        $('<div></div>').text(`${browser.broswer} ${browser.version}`).appendTo('#browser')

        // 获取ip地址信息
        // $('#ip').empty();
        // let IPAddress = await getIPAddress();
        // $('<div></div>').text(IPAddress).appendTo('#ip');
        // this.networkTestingResult.IPAddress = IPAddress;

        // 是否支持屏幕分享能力
        $('#screen-share').empty()
        let isScreenShareSupported = TRTC.isScreenShareSupported()
        $('<div></div>').text(isScreenShareSupported ? '支持' : '不支持').appendTo('#screen-share')

        // 上下行网络质量
        const presetting = new Presetting()
        presetting.login(false, async options => {
          this.client = TRTC.createClient({ mode: 'rtc', ...options })
          this.client.on('network-quality', event => {
            this.networkQualityNum++
            // 收到3次'network-quality'事件的时候认为拿到了网络实际质量
            if (this.networkQualityNum === 3) {
              this.networkTestingResult.upLinkNetwork = event.uplinkNetworkQuality
              this.networkTestingResult.downLinkNetwork = event.downlinkNetworkQuality
              $('#uplink-network').removeClass('network-loading').text(this.NETWORK_QUALITY[String(this.networkTestingResult.upLinkNetwork)])
              $('#testing-report-btn').show()
              this.client && this.client.leave()
              this.client && this.client.off('network-quality')
            }
          })
          await this.client.join({
            roomId: options.roomId,
          })
          this.localStream = TRTC.createStream({
            audio: true,
            video: false,
          })
          await this.localStream.initialize()
          this.localStream.play('audio-container')
          await this.client.publish(this.localStream)
          // 音频轨道静音
          this.localStream.muteAudio()
        })
      },

      // 展示检测报告
      showTestingReport() {
        $('#device-testing').hide()
        $('#network-testing-body').hide()
        $('#device-testing-report').show()
        this.curTestingPageId = 'device-testing-report'

        // 摄像头检测结果
        $('#camera-name').text(this.cameraTestingResult.device.label)

        if (this.cameraTestingResult.statusResult) {
          $('#camera-testing-result').text('正常').css('color', 'green')
        } else {
          $('#camera-testing-result').text('异常').css('color', 'red')
        }


        // 扬声器检测结果(safari浏览器不显示扬声器检测结果)
        if (!this.isSafari) {
          $('#voice-name').text(this.voiceTestingResult.device.label)
          if (this.voiceTestingResult.statusResult) {
            $('#voice-testing-result')
              .text('正常')
              .css('color', 'green')
          } else {
            $('#voice-testing-result')
              .text('异常')
              .css('color', 'red')
          }
        }

        // 麦克风检测结果
        $('#mic-name').text(this.micTestingResult.device.label)
        if (this.micTestingResult.statusResult) {
          $('#mic-testing-result').text('正常').css('color', 'green')
        } else {
          $('#mic-testing-result').text('异常').css('color', 'red')
        }

        // 网络检测结果
        // $('#network-name').text(this.networkTestingResult.IPAddress);
        $('#network-name').text('网络质量')
        $('#network-testing-result').html(`${this.NETWORK_QUALITY[String(this.networkTestingResult.upLinkNetwork)]}`)
          .css('color', `${Number(this.networkTestingResult.upLinkNetwork) > 3 ? 'red' : 'green'}`)
      },

      // 结束设备检测，隐藏设备检测弹窗
      finishDeviceTesting() {
        $('#device-testing-root').hide()
        $('#device-testing').hide()
        $(`#${this.curTestingPageId}`).hide()
        this.curTestingPageId = ''
        this.completedTestingPageIdList = []

        // 停止摄像头/麦克风的流采集并释放摄像头/麦克风设备
        this.localStream && this.localStream.close()
        this.client && this.client.leave()
        this.client && this.client.off('network-quality')
        // 停止播放器的音乐
        let audioPlayer = document.querySelector('#audio-player')
        if (!audioPlayer.paused) {
          audioPlayer.pause()
        }
        audioPlayer.currentTime = 0
      },

      // 恢复检测页面头部图标的状态
      initTestingTabTitle() {
        ['camera', 'voice', 'mic', 'network'].forEach(item => {
          $(`#${item}-testing`).removeClass('icon-blue complete').addClass('icon-gray')
        })
      },
    }
  }

</script>
<style>
  .mic-bar {
    width: 10px;
    height: 30px;
    border: 1px solid #cccccc;
    border-radius: 1px;
    border-radius: 6px;
  }

  .mic-bar:not(:first-child) {
    margin-left: 3px;
  }

  .mic-bar.active {
    background: #006EFF;
  }

</style>

<style scoped>
  * {
    margin: 0;
    padding: 0;
  }

  /*body{*/
  /*    font-family: PingFangSC-Regular !important;*/
  /*}*/
  /*html{*/
  /*    width: 100%;*/
  /*    height: 100%;*/
  /*}*/
  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }

  button {
    margin: 0 !important;
    color: #fff !important;
    background-color: #006EFF !important
  }

  div {
    display: flex;
    align-items: center;
  }

  .row-div {
    flex-direction: row;
  }

  .popover-body > div {
    width: 100%;
    height: 35px;
    justify-content: center;
    cursor: default;
  }

  .popover-body > div:hover {
    background-color: #F7F7F7;
  }

  .icon-gray {
    color: #bfbfbf;
  }

  .icon-normal {
    color: #515151;
  }

  .icon-blue {
    color: #006EFF;
  }

  .device-testing-btn {
    color: #515151;
    cursor: pointer;
    margin-top: -14px;
    opacity: 0.8;
    margin-bottom: 8px;
    display: none;
  }

  .device-connect-list {
    width: 310px;
    height: 70px;
    position: absolute;
    bottom: 50px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    justify-content: space-around;
    padding: 0 10px;
  }

  .device-connect-list::before {
    content: '';
    width: 0;
    height: 0;
    border: 8px transparent solid;
    border-top-color: rgba(0, 0, 0, 0.2);
    opacity: 0.6;
    position: absolute;
    bottom: -16px;
    left: 50%;
    transform: translateX(-50%);
  }

  .device-connect-list::after {
    content: '';
    width: 0;
    height: 0;
    border: 7px transparent solid;
    border-top-color: #fff;
    position: absolute;
    bottom: -14px;
    left: 50%;
    transform: translateX(-50%);
  }

  .connect {
    width: 28px;
    height: 64px;
    font-size: 28px;
    text-align: center;
    position: relative;
    opacity: 0.8;
  }

  .device-icon {
    width: 20px;
    height: 20px;
    margin-right: 3px;
    display: block;
    text-align: center;
    font-size: 20px;
    line-height: 20px;
  }

  #device-testing-root {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-self: center;
    background: rgba(0, 0, 0, 0.1);
  }

  .device-testing-card {
    z-index: 2001;
    width: 640px;
    height: 480px;
    background: #F7F7F7;
    border-radius: 10px;
    position: relative;
    display: block;
  }

  .device-testing-prepare, .device-testing-report {
    display: block;
  }

  .device-testing {
    flex-wrap: wrap;
  }

  .testing-title {
    font-size: 34px;
    justify-content: center;
    margin-top: 55px;
    color: #201e1ee5;
  }

  .testing-prepare-info {
    font-size: 16px;
    justify-content: center;
    margin-top: 25px;
    color: #585656e5;
  }

  .device-testing-close-btn {
    width: 25px;
    height: 25px;
    position: absolute;
    top: 8px;
    right: 8px;
    cursor: pointer;
    font-size: 20px;
  }

  .device-display {
    margin-top: 40px;
    justify-content: center;
  }

  .device {
    width: 46px;
    height: 46px;
    position: relative;
    justify-content: center;
    font-size: 38px;
  }

  .device:not(:first-child) {
    margin-left: 60px;
  }

  .device:not(:first-child).safari {
    margin-left: 100px;
  }

  .device::before {
    content: '';
    width: 28px;
    height: 28px;
    position: absolute;
    bottom: -34px;
    left: 50%;
    transform: translateX(-50%);
  }

  .connect-success::before {
    background: url('./img/success1.png') no-repeat;
    background-size: 100% 100%;
  }

  .connect-fail::before {
    background: url('./img/fail.png') no-repeat;
    background-size: 100% 100%;
  }

  @keyframes device-loading {
    0% {
      width: 0%;
      border-radius: 6px 0 0 6px;
    }
    50% {
      width: 50%;
      border-radius: 6px 0 0 6px;
    }
    100% {
      width: 100%;
      border-radius: 6px;
    }
  }

  .loading-background {
    width: 350px;
    height: 3px;
    border-radius: 6px;
    margin: 20px auto 0;
    background: #bfbfbf;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .device-loading {
    height: 3px;
    background-color: #808080;
    animation: device-loading 2s;
    animation-fill-mode: both;
  }

  .connect-info {
    margin-top: 60px;
    display: flex;
    height: 48px;
    justify-content: center;
  }

  .connect-attention-container {
    position: relative;
    margin-left: 3px;
  }

  .connect-attention-icon {
    font-size: 20px;
    color: red;
  }

  .connect-attention-info {
    padding: 8px 12px;
    min-width: 120px;
    min-height: 50px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 10px;
    color: #fff;
    position: absolute;
    right: 0;
    bottom: 100%;
    transform: translate(20px, -10px);
    display: block;
    white-space: nowrap;
    font-size: 12px;
  }

  .connect-attention-info::after {
    content: '';
    width: 0;
    height: 0;
    border: 10px transparent solid;
    border-top-color: rgba(0, 0, 0, 0.6);
    position: absolute;
    left: 100%;
    top: 100%;
    transform: translateX(-40px);
  }

  .testing-btn-display {
    justify-content: center;
    margin-top: 30px;
  }

  .test-btn {
    width: 200px;
    height: 44px;
    background: #006EFF;
    border-radius: 5px;
    text-align: center;
    color: #fff;
    justify-content: center;
    cursor: pointer;
  }

  .start-gray {
    background: #dddddd;
    color: #fff;
    cursor: not-allowed;
  }

  .device-testing-title {
    justify-content: center;
    width: 100%;
    margin-top: 40px;
  }

  .testing {
    width: 26px;
    height: 26px;
    position: relative;
    justify-content: center;
    text-align: center;
    font-size: 24px;
    line-height: 24px;
  }

  .testing:not(:first-child) {
    margin-left: 90px;
  }

  .testing:not(:first-child)::before {
    content: '';
    width: 70px;
    height: 2px;
    position: absolute;
    top: 50%;
    left: -80px;
    background: #bfbfbf;
  }

  .testing:not(:first-child).safari {
    margin-left: 150px;
  }

  .testing:not(:first-child).safari::before {
    width: 130px;
    left: -140px;
  }

  .testing.complete {
    cursor: pointer;
  }

  .testing.complete:not(:first-child)::before {
    background: #006EFF;
  }

  .testing-body {
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
  }

  .device-list {
    margin: 30px auto 0;
  }

  .device-select {
    width: 260px;
    height: 30px;
    margin-left: 20px;
    padding: 0 10px;
    border-radius: 4px;
    font-size: 16px;
  }

  .camera-video {
    width: 300px;
    height: 180px;
    display: block;
    margin: 30px auto 0;
  }

  .testing-info-container {
    display: block;
    position: absolute;
    bottom: 50px;
    margin-top: 24px;
    left: 50%;
    transform: translateX(-50%);
  }

  .testing-info {
    width: 100%;
    text-align: center;
    display: block;
    font-size: 14px;
    color: #6a6a6a;
  }

  .button-list {
    margin-top: 20px;
    width: 300px;
    justify-content: space-around;
  }

  .fail-button {
    border: 1px solid #006EFF;
    border-radius: 8px;
    color: #006EFF;
    padding: 6px 14px;
    cursor: pointer;
  }

  .success-button {
    border: 1px solid #006EFF;
    border-radius: 8px;
    background: #006EFF;
    color: #fff;
    padding: 6px 14px;
    cursor: pointer;
  }

  .audio-control {
    width: 320px;
    display: block;
    margin: 40px auto 0;
  }

  .audio-control-info {
    margin: 0px auto 20px 6px;
    color: #000;
    font-size: 14px;
  }

  .mic-testing-container {
    display: block;
    margin: 30px auto 0;
  }

  .mic-testing-info {
    color: #000;
    font-size: 14px;
  }

  .mic-bar-container {
    margin-top: 40px;
    justify-content: center;
  }

  .testing-index-list {
    margin-top: 40px;
    width: 100%;
    display: block;
  }

  .testing-index-group {
    width: 55%;
    display: flex;
    justify-content: space-between;
    margin: 14px auto 0;
  }

  @keyframes loading-circle {
    0% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(90deg);
    }
    50% {
      transform: rotate(180deg);
    }
    75% {
      transform: rotate(270deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .network-loading::before {
    content: '';
    width: 16px;
    height: 16px;
    background: url('./img/loading.png');
    background-size: 100% 100%;
    animation: loading-circle 2s linear infinite;
  }

  .testing-footer {
    margin-top: 70px;
    justify-content: center;
  }

  .device-report-list {
    display: block;
    margin-top: 40px;
  }

  .device-report {
    width: 60%;
    margin: 20px auto 0;
    justify-content: space-between;
  }

  .device-info {
    width: 85%;
  }

  .report-icon {
    width: 24px;
    height: 24px;
    margin-right: 20px;
    justify-content: center;
    font-size: 22px;
    line-height: 22px;
    color: #515151;
  }

  .device-name {
    width: 280px;
    height: 24px;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .device-report-footer {
    margin-top: 50px;
    justify-content: center;
  }

  .device-report-btn {
    width: 160px;
    height: 40px;
    border: 1px solid;
    border-radius: 6px;
    justify-content: center;
    cursor: pointer;
  }

  .testing-agin {
    border-color: #006EFF;
    color: #006EFF;
  }

  .testing-finish {
    background: #006EFF;
    color: #fff;
    margin-left: 60px;
  }

  .select-title {
    font-size: 16px;
    color: #6a6a6a;
  }

  /*提示页面*/

  #remind-info-container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 2001;
  }

  .webview-remind {
    display: none;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  .webview-remind-img {
    position: absolute;
    top: 10px;
    right: 45px;
    width: 140px;
  }

  .webview-remind-info {
    position: absolute;
    top: 150px;
    right: 20px;
    width: 360px;
    flex-wrap: wrap;
    font-size: 30px;
    color: #ffffff;
  }

  .browser-remind {
    display: none;
    flex-wrap: wrap;
    padding: 24px 20px 40px;
    min-width: 300px;
    max-width: 480px;
    width: 40%;
    min-height: 90px;
    border-radius: 10px;
    background-color: #f0f0f0;
  }

  .remind-info {
    margin-top: 26px;
    padding: 0 10px;
    font-size: 18px;
    line-height: 34px;
  }

  @media only screen and (max-width: 680px) {
    .testing-title {
      font-size: 22px;
    }
    .testing-prepare-info {
      font-size: 13px;
    }
    .browser-remind {
      width: 80%;
    }
    .device {
      width: 35px;
      height: 35px;
    }
    .mic-testing-container {
      width: 80%;
    }

    .remind-info {
      font-size: 22px;
      line-height: 40px;
    }
    .device-report-footer {
      width: 80%;
      margin: 50px auto 0;
    }
    .device-testing-card {
      width: 96%;
    }
  }

  @media only screen and (min-width: 680px) and (max-width: 1000px) {
    .browser-remind {
      width: 60%;
    }
  }
</style>
