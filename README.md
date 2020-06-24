## 腾讯云 Web 直播互动组件

### 简介

腾讯云 Web 直播互动组件，以腾讯云 Web 超级播放器 - [TcPlayer](https://cloud.tencent.com/document/product/454/7503) 和腾讯云即时通信 IM - [TIM](https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/TIM.html) 为基础，封装了简单易用的 [API](https://webim-1252463788.cos.ap-shanghai.myqcloud.com/tweblive/TWebLive.html)，提供了免费开源的 [Demo](https://webim-1252463788.cos.ap-shanghai.myqcloud.com/TWebLive-demo.zip)，方便开发者快速接入和使用。适用于 Web 直播互动场景，如大型会议、活动、课程、讲座等的在线直播，带货直播的微信 H5 分享等，效果如下：

![](https://main.qcloudimg.com/raw/04f7ad86951354ba40f5d85cd204b5f5.jpg)
![](https://main.qcloudimg.com/raw/2c46a40ce36c0faecc01ef12d317e803.png)

### 在线体验
微信扫一扫二维码  ![](https://user-gold-cdn.xitu.io/2020/5/29/1725f98d5d57713f?w=260&h=260&f=png&s=6258)

或者 [点我体验](https://webim-1252463788.cos.ap-shanghai.myqcloud.com/tweblivedemo/index.html)

### 开发背景

前端开发同学经常遇到这样的需求：
- 项目周期赶，甲方爸爸急着要，或者公司要做推广活动，只给了不到一周的时间（╮(╯▽╰)╭，业界常态）
- 微信扫一扫、或者用手机浏览器扫一扫就能看直播，并且能跟其他看直播的人聊天互动，也能点赞、送礼（给我做一个虎牙或者斗鱼的那种直播效果出来！）
- 在 Windows 或 Mac 浏览器上也需要上述的功能（小孩子才做选择，产品经理：我全都要！）

开发同学接到这样的需求，一般会怎么实现呢？对 Web 直播有一定了解的会选择 flv.js 或者 hls.js 来播放直播源。聊天互动用 websocket 快速写一个简单的消息收发 demo。然而写原型 demo 不难，但接下来会遇到到很多挑战：
- 服务器该怎么布点才能让用户就近接入？遇到蜂拥请求，服务器扛不住并发压力怎么办？
- 直播活动人数往往较多，全国各地的用户访问，消息通道建立不起来怎么办？
- 短时间内自研一个 IM Server，如何保证服务高可用？
- 消息量大，IM Server 推送消息遇到性能问题，导致消息堆积，或者丢消息怎么办？
- 用户在直播间骂人，发表涉黄、涉政言论怎么办？
- 如果用第三方 IM 服务，选择谁好呢？万一有坑，反馈问题没人理，导致项目延期怎么办？
- 第三方 IM 服务往往有一大堆概念和 API，需要花时间熟悉和使用，留给开发业务逻辑的时间太仓促
  
由此可见，在短时间内如果自己从头开始组装开发，往往是加班加点，赶鸭子上架，开发同学身心俱疲，直播效果也不一定好。现在直播这么火热，***难道就没有一个开源的，组合了直播和聊天互动功能的项目，让我稍微改一改就能用起来么？***

腾讯云终端研发中心 Web 团队，开发了腾讯云 Web 超级播放器和即时通信 IM SDK（还有其它 SDK 暂且按下不表←_←），面对这样常见的需求和痛点，于是以这两个可靠优秀的产品为基础，开发了开源的腾讯云 Web 直播互动组件，供开发者使用和参考。

### 对开发者和项目有什么好处？

##### 1、为开发者节省大量重复造轮子的时间，可专注于开发业务逻辑

使用腾讯云 Web 直播互动组件，开发者仅需在下载好 [SDK](https://www.npmjs.com/package/tweblive) 后简单填入几个参数，即可快速把一个包含直播视频播放、聊天互动、点赞送礼等常见功能的项目跑起来。如下所示：
```javascript
// npm i tweblive
import TWebLive from 'TWebLive';

let options = {
  SDKAppID: 0, // 接入时需要将0替换为您的云通信应用的 SDKAppID
  domID: "id_test_video", // 页面上播放器容器 ID，如 <div id="id_test_video" style="width:100%; height:auto;"></div>
  // 必须同时同时填入 hls 和 flv 流地址
  // 在支持 MSE 的浏览器上，直播组件会优先选择使用 flv 直播源，延时更低，直播效果更好
  // 在不支持 MSE 的浏览器上，直播组件会使用 hls 直播源，延时稍大，但在移动端适应性好
  m3u8: "http://200002949.vod.myqcloud.com/200002949_b6ffc.f0.m3u8", // 请替换成实际可用的播放地址
  flv: "http://200002949.vod.myqcloud.com/200002949_b6ffc.f0.flv" // 请替换成实际可用的播放地址
};
// 创建实例
let tweblive = new TWebLive(options);

// SDK 进入 ready 状态时触发，接入侧监听此事件，然后可调用 SDK 发送消息等api，使用 SDK 的各项功能
let onIMReady = function() {
  tweblive.sendTextMessage({
    roomID: 'TWebLiveDeveloperHub', // 替换为已加入的直播间 ID
    text: 'hello from TWebLive'
  }).then(function(res) {
    console.log('demo sendTextMessage OK', res);
  }).catch(function(err) {
    console.log('demo sendTextMessage failed', err);
  });
}
tweblive.on(TWebLive.EVENT.IM_READY, onIMReady);

// 收到直播间其他人发的文本消息
let onTextMessageReceived = function(event) {
  event.data.forEach(function(message) {
    // 有昵称则用昵称，无昵称用 userID
    console.log('demo ' + (message.nick || message.from) + ' 说: ', message.payload.text);
  });
}
tweblive.on(TWebLive.EVENT.TEXT_MESSAGE_RECEIVED, onTextMessageReceived);

// 收到直播间其他人发的送礼、点赞等自定义消息
let onCustomMessageReceived = function(event) {
  event.data.forEach(function(message) {
    console.log('demo ' + 'data:' + message.payload.data + ' description:' + message.payload.description + ' extension:' + message.payload.extension);
  });
}
tweblive.on(TWebLive.EVENT.CUSTOM_MESSAGE_RECEIVED, onCustomMessageReceived);

// 收到其他人加入直播间的通知
let onRemoteUserJoin = function(event) {
  event.data.forEach(function(message) {
    // 有昵称则用昵称，无昵称用 userID
    console.log('demo ' + (message.nick || message.payload.userIDList[0]) + ' 来了');
  });
}
tweblive.on(TWebLive.EVENT.REMOTE_USER_JOIN, onRemoteUserJoin);

// 更多事件请参考：https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/module-EVENT.html

// 加入直播间，未登录时匿名加入直播间，只能收消息，不能发消息
tweblive.enterRoom(""); // 接入时填要加入的直播间 ID，对应于 IM 系统的直播大群（AVChatRooM）的 groupID

```

##### 2、为开发者节省大量定位和解决问题的时间

- 直播场景观众数量多，消息量大时，自研服务容易出现性能瓶颈，如服务器扛不住并发压力导致请求成功率低、消息堆积、丢消息、消息收发延时严重等难以排查和难以解决的问题。腾讯云 Web 直播互动组件的消息服务集成的是腾讯云即时通信 IM，以 QQ 多年的 IM 能力为基础，保证高并发、高可靠的即时通信能力，且有完善的统计和日志排障系统，遇到问题可快速定位解决。
- 腾讯云 Web 直播互动组件支持设置消息优先级，如主播发言、观众送礼物等可设置为 [高优先级](https://webim-1252463788.cos.ap-shanghai.myqcloud.com/tweblive/module-TYPES.html#.MSG_PRIORITY_HIGH)，点赞等不重要的消息可设置为 [低优先级](https://webim-1252463788.cos.ap-shanghai.myqcloud.com/tweblive/module-TYPES.html#.MSG_PRIORITY_LOW)，IM 系统会保证高优先级消息的下发（直播间消息量超过40条/秒时 IM 后台会限频）。

##### 3、为项目节省大量的开发和运维成本

- 腾讯云 Web 直播互动组件是完全免费开源的，其集成的腾讯云 Web 超级播放器是免费的，仅腾讯云即时通信 IM 是增值服务。如果您的项目处于起步阶段，可以使用免费版的 IM 服务。项目发展好，用户量大时，可以购买 [IM 旗舰版](https://cloud.tencent.com/document/product/269/40267)，价格非常美丽，全行业最低。
- 腾讯云即时通信 IM 的直播大群（AVChatRoom），群成员人数无上限（这个厉害了，让我叉会腰）。
- 腾讯云 IM 服务器的节点覆盖面广，可保证用户就近接入，且不用担心服务器扩容问题。
- 支持针对涉黄、涉政以及不雅词的安全打击，满足安全监管需求。
- 腾讯云 IM 服务团队响应即时，为您的项目保驾护航。

### 开发者需要做什么？

##### 1、提供直播源，推荐用 [腾讯实时音视频 TRTC](https://cloud.tencent.com/document/product/647/16788) 的 [旁路推流](https://cloud.tencent.com/document/product/647/16826)

为了同时兼容 PC 和移动端，开发者必须同时提供 flv 和 hls 两种格式的直播源，在支持 MSE 的浏览器上，直播组件会优先选择使用 flv 直播源，延时更低，直播效果更好；在不支持 MSE 的浏览器上，直播组件会使用 hls 直播源，延时稍大，但在移动端适应性好。

如果在 Windows 或 Mac 平台推直播流，强烈建议使用 [TRTC Electron](https://github.com/tencentyun/TRTCSDK/tree/master/Electron)，***旁路推流可同时生成 flv 和 hls 流，跟腾讯云即时通信 IM 完美结合，稳定可靠，服务周到，价格美丽***。
[跑通 Electron Demo](https://cloud.tencent.com/document/product/647/38548) 这篇文档会帮您快速实现直播和旁路推流，效果如下：
![](https://user-gold-cdn.xitu.io/2020/5/29/1725f98d5d80e0b0?w=945&h=631&f=gif&s=7387017)

##### 2、注册腾讯云即时通信 IM 应用

- 在 [即时通信 IM 控制台](https://console.cloud.tencent.com/avc) 注册应用，获得 SDKAppID。
- [生成 UserSig](https://cloud.tencent.com/document/product/269/32688)。
- 用 [REST API](https://cloud.tencent.com/document/product/269/1519) 向 IM 系统 [导入账号](https://cloud.tencent.com/document/product/269/1608)。
- 在 [即时通信 IM 控制台](https://console.cloud.tencent.com/avc) 或者用 REST API [创建直播大群（AVChatRoom）](https://cloud.tencent.com/document/product/269/1615)

##### 3、在腾讯云 Web 直播互动组件的基础上，开发相关业务逻辑

### 常见问题

##### 1、进入直播间，其他人看到的提示信息和聊天消息都用的是 `userID`，能否支持用昵称（nick）展示？

如果进直播间想要展示昵称，需要先设置昵称（已设置过可忽略此步骤），设置成功后再加入
```javascript
// 只有已登录的用户才能修改自己的昵称
tweblive.setMyProfile({ nick: "胡八一" }).then(() => {
  tweblive.enterRoom(""); // 填要加入的直播间 ID，对应于 IM 系统的直播大群（AVChatRooM）的 groupID
});
```

##### 2、组件什么时候会选择播放 flv 流？flv 和 hls 直播源的播放时延分别是多少？

在支持 MSE 的浏览器上，如 PC Chromium 内核浏览器（360极速浏览器，Chrome浏览器等），或者 [TBS](https://x5.tencent.com/tbs/product/video.html) 模式下(Android 的微信、QQ 浏览器)，组件会优先选择播放 flv 流。播放时延对比：
| 浏览器 | 播放时延|
| --- | ---|
| Windows Chrome 浏览器 | 3s~5s|
| Mac Chrome 浏览器 | 3s~5s |
| Mac Safari 浏览器 | 10s~20s |
| iOS Safari 浏览器 | 10s~20s |
| iOS 微信 | 10s~20s |
| Android 微信([TBS](https://x5.tencent.com/tbs/product/video.html)) | 3s~5s |
| Android QQ 浏览器 | 3s~5s |
| Android Chrome 浏览器 | 3s~5s |
| Android 其它浏览器 | 10s~20s |


### 参考文档

- [腾讯云 Web 直播互动组件 API](https://webim-1252463788.cos.ap-shanghai.myqcloud.com/tweblive/TWebLive.html)
- [腾讯实时音视频 TRTC](https://cloud.tencent.com/document/product/647/16788)
- [TRTC Electron API](https://cloud.tencent.com/document/product/647/38551)
- [腾讯云 Web 超级播放器 TcPlayer](https://cloud.tencent.com/document/product/454/7503)
- [腾讯云即时通信 IM](https://cloud.tencent.com/document/product/269/1498)
- [WebIM API](https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/TIM.html)
