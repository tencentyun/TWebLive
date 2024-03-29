## 注意

此项目已经**废弃**，以后不再维护。我们推出新的视频直播互动组件 [TUIPusher&TUIPlayer](https://cloud.tencent.com/document/product/647/63830)

体验地址：

- [TUIPusher 体验链接](https://web.sdk.qcloud.com/component/tuiliveroom/tuipusher/login.html)
- [TUIPlayer 体验链接](https://web.sdk.qcloud.com/component/tuiliveroom/tuiplayer/login.html)

如果您想要了解更多关于 TUIPusher & TUIPlayer，请阅读官网文档 [TUIPusher&TUIPlayer](https://cloud.tencent.com/document/product/647/63830)

- 欢迎加入 QQ 群：**592465424**，进行技术交流和反馈~

<details>
<summary>以下为原 README 内容</summary>

## 简介
[TWebLive](https://www.npmjs.com/package/tweblive)，腾讯云 Web 直播互动组件，是腾讯云终端研发团队推出的一个新的 SDK，集成了[腾讯云实时音视频 TRTC](https://cloud.tencent.com/product/trtc/)、[腾讯云即时通信 TIM](https://cloud.tencent.com/product/im)、[腾讯云超级播放器 TCPlayer](https://cloud.tencent.com/document/product/454/7503)，覆盖了 Web 直播互动场景常见的功能（推流、开/关麦，开/关摄像头，微信分享观看、聊天点赞等等），并封装了简单易用的 [API](https://web.sdk.qcloud.com/component/tweblive/doc/zh-cn/TWebLive.html)，接入后可快速实现 Web 端推流、拉流以及实时聊天互动功能。

## 效果展示

![](https://web.sdk.qcloud.com/component/tweblive/assets/doc/demo.gif)

## 架构设计

![](https://web.sdk.qcloud.com/component/tweblive/assets/doc/demo-framework.png)

## TWebLive 的优点
开发者接入此 SDK，可**彻底替代 flash 推流方案**，**大大降低** Web 推流、Web 低延时观看、CDN 观看以及实时聊天互动（或弹幕）的**实现复杂度和时间成本**，举例说明：
1. 当需要推流时，创建 Pusher（推流）对象，最简单的推流仅需3步。

```javascript
<div id="pusherView" style="width:100%; height:auto;"></div>
<script>
// 1、创建 Pusher（推流）对象
let pusher = TWebLive.createPusher({ userID: 'your userID' });

// 2、设置渲染界面，且从麦克风采集音频，从摄像头采集视频（默认720p）
pusher.setRenderView({
  elementID: 'pusherView',
  audio: true,
  video: true
}).then(() => {
  // 3、填入 sdkappid roomid 等信息，推流
  // url 必须以 `room://` 开头
  let url = `room://sdkappid=${SDKAppID}&roomid=${roomID}&userid=${userID}&usersig=${userSig}&livedomainname=${liveDomainName}&streamid=${streamID}`;
  pusher.startPush(url).then(() => {
    console.log('pusher | startPush | ok');
  });
}).catch(error => {
  console.error('pusher | setRenderView | failed', error);
});
</script>
```

2. 当需要拉流播放时，创建 Player（播放器）对象，最简单的拉流仅需3步。
```javascript
<div id="playerView" style="width:100%; height:auto;"></div>
<script>
// 1、创建 Player（播放器）对象
let player = TWebLive.createPlayer();

// 2、设置渲染界面
player.setRenderView({ elementID: 'playerView' });

// 3、填入 flv hls 地址等信息，拉 CDN 流播放，此时 url 必须以 `https://` 开头
// 或 填入 sdkappid roomid 等信息，拉 WebRTC 低延时流播放，此时 url 必须以 `room://` 开头
let url = 'https://'
  + 'flv=https://200002949.vod.myqcloud.com/200002949_b6ffc.f0.flv' + '&' // 请替换成实际可用的播放地址
  + 'hls=https://200002949.vod.myqcloud.com/200002949_b6ffc.f0.m3u8' // 请替换成实际可用的播放地址

// let url = `room://sdkappid=${SDKAppID}&roomid=${roomID}&userid=${userID}&usersig=${userSig}`;
player.startPlay(url).then(() => {
  console.log('player | startPlay | ok');
}).catch((error) => {
  console.error('player | startPlay | failed', error);
});
</script>
```

3. 当主播和观众需要聊天互动时，创建 IM（即时通信）对象，最简单的消息收发仅需3步。
```javascript
// 1、创建 IM（即时通信）对象并监听事件
let im = TWebLive.createIM({
  SDKAppID: 0 // 接入时需要将0替换为您的云通信应用的 SDKAppID
});
// 监听 IM_READY IM_TEXT_MESSAGE_RECEIVED 等事件
let onIMReady = function(event) {
  im.sendTextMessage({ roomID: 'your roomID', text: 'hello from TWebLive' });
};
let onTextMessageReceived = function(event) {
  event.data.forEach(function(message) {
    console.log((message.from || message.nick) + ' : ', message.payload.text);
  });
};
// 接入侧监听此事件，然后可调用 SDK 发送消息等
im.on(TWebLive.EVENT.IM_READY, onIMReady);
// 收到文本消息，上屏
im.on(TWebLive.EVENT.IM_TEXT_MESSAGE_RECEIVED, onTextMessageReceived);

// 2、登录
im.login({userID: 'your userID', userSig: 'your userSig'}).then((imResponse) => {
  console.log(imResponse.data); // 登录成功
  if (imResponse.data.repeatLogin === true) {
    // 标识账号已登录，本次登录操作为重复登录
    console.log(imResponse.data.errorInfo);
  }
}).catch((imError) => {
  console.warn('im | login | failed', imError); // 登录失败的相关信息
});

// 3、加入直播间
im.enterRoom('your roomID').then((imResponse) => {
  switch (imResponse.data.status) {
    case TWebLive.TYPES.ENTER_ROOM_SUCCESS: // 加入直播间成功
      break;
    case TWebLive.TYPES.ALREADY_IN_ROOM: // 已经在直播间内
      break;
    default:
      break;
  }
}).catch((imError) => {
  console.warn('im | enterRoom | failed', imError); // 加入直播间失败的相关信息
});
</script>
```

为了进一步降低开发者的开发和人力成本，我们在 TWebLive SDK 的基础上，提供了同时适配 PC 和移动端浏览器的 [Demo](https://github.com/tencentyun/TWebLive)，并开源到了 github。开发者 fork&clone 项目到本地（顺手来个star，谢谢~），稍作修改即可把 Demo 跑起来，或者集成到自己的项目部署上线。

## 运行体验

- [在线 Demo](https://web.sdk.qcloud.com/component/tweblive/demo/latest/index.html#/)
- [本地一分钟跑通体验](https://cloud.tencent.com/document/product/269/47959)

## 接入使用
接入前，您需要：
- 在 [腾讯云实时音视频 TRTC 控制台](https://console.cloud.tencent.com/trtc/app) 中创建一个实时音视频应用（*此时会自动创建一个 `SDKAppID` 相同的 IM 应用*），取得 `SDKAPPID`。然后应用管理 -> 功能配置 -> 开启自动旁路推流。开启旁路推流功能后， TRTC 房间里的每一路画面都配备一路对应的播放地址（*如果不需要 CDN 直播观看，可略过开启旁路推流的步骤*）。
![](https://web.sdk.qcloud.com/component/tweblive/assets/doc/2.png)
- 在 [腾讯云直播控制台](https://console.cloud.tencent.com/live/) 配置播放域名并完成 CNAME 配置，详细操作指引请参见[《CDN 直播观看》](https://cloud.tencent.com/document/product/647/16826)（*如果不需要 CDN 直播观看，此步骤可略过*）。
- 通过 npm 下载 TWebLive
```javascript
npm i tweblive --save
```

## 支持的平台

Web 推流和 Web 低延时观看用到了 WebRTC 技术。目前主要在桌面版 Chrome 浏览器、桌面版 Safari 浏览器以及移动版 Safari 浏览器上有较为完整的支持，其他平台（例如 Android 平台的浏览器）支持情况均比较差，具体如下：

| 操作系统 | 浏览器类型 | 浏览器最低版本要求 | 接收（播放）| 发送（上麦）| 屏幕分享 |
|:-------:|:-------:|:-------:|:-------:|:-------:| :-------:|
| Mac OS  | 桌面版 Safari 浏览器 |  11+ | 支持 | 支持 | 不支持 |
| Mac OS  | 桌面版 Chrome 浏览器 |  56+ | 支持 | 支持 | 支持（需要 chrome72+ 版本） |
| Windows  | 桌面版 Chrome 浏览器|  56+ | 支持 | 支持 | 支持（需要 chrome72+ 版本） |
| Windows  | 桌面版 QQ 浏览器 |  10.4 | 支持 | 支持 | 不支持 |
| iOS | 移动版 Safari 浏览器 | 11.1.2 | 支持 | 支持 | 不支持 |
| iOS | 微信内嵌网页| 12.1.4 | 支持 | 不支持 | 不支持 |
| Android | 移动版 QQ 浏览器| - | 不支持 | 不支持 | 不支持 |
| Android | 移动版 UC 浏览器| - | 不支持 | 不支持 | 不支持 |
| Android | 微信内嵌网页（TBS内核）| - | 支持 | 支持 | 不支持 |

在移动端推荐使用 [小程序](https://cloud.tencent.com/document/product/647/17018) 解决方案，微信和手机 QQ 小程序均已支持，都是由各平台的 Native 技术实现，音视频性能更好，且针对主流手机品牌进行了定向适配。如果您的应用场景主要为教育场景，那么教师端推荐使用稳定性更好的 [Electron](https://cloud.tencent.com/document/product/647/38549) 解决方案，支持大小双路画面，更灵活的屏幕分享方案以及更强大的弱网络恢复能力。

## 注意事项

- 实时音视频应用与 IM 应用的 `SDKAppID` 一致，才能复用账号与鉴权。
- IM 应用针对文本消息，提供基础版本的安全打击能力，如果您希望使用自定义不雅词功能，您可以点击升级或在购买页购买安全打击-专业版服务。
- 本地计算 UserSig 的方式仅用于本地开发调试，请勿直接发布到线上，一旦您的 `SECRETKEY` 泄露，攻击者就可以盗用您的腾讯云流量。正确的 UserSig 签发方式是将 UserSig 的计算代码集成到您的服务端，并提供面向 App 的接口，在需要 UserSig 时由您的 App 向业务服务器发起请求获取动态 UserSig。更多详情请参见 [服务端生成 UserSig](https://cloud.tencent.com/document/product/269/32688#GeneratingdynamicUserSig)。
- 由于 H.264 版权限制，华为系统的 Chrome 浏览器和以 Chrome WebView 为内核的浏览器均不支持 TRTC 桌面浏览器端 SDK 的正常运行。

## 参考文档

- [TWebLive 接口手册](https://web.sdk.qcloud.com/component/tweblive/doc/zh-cn/TWebLive.html)
