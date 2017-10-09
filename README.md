##VueMuisc

简介：

· 在线预览地址：http://101.132.128.94/

· 项目在 vue-cli 的基础上编写，通过 QQ音乐 的接口拉取真实数据填充内容，已经完善播放内核，以及基本切歌、歌词功能。已经实现了的功能：

- 歌单推荐
- 歌手列表
	- 热门歌手、全部歌手
	- 快速入口列表（热门 + A - Z）
- 歌单排行
- 歌手详情
- 歌单详情
- 歌曲、歌手搜索
- 播放内核
	- 播放音乐
	- 暂停播放
	- 上一首
	- 下一首
	- 顺序播放
	- 单曲循环
	- 随机播放
	- 滚动歌词
	- 音乐进度展示
	- 进度条拖拽
- 歌单头像、歌手头像图片懒加载

· 前端：Vue + vuex + webpack + nodeJS + JSONP + axios
· 后台：大部分接口都是通过 JSONP 跨域请求的，但是有两个特殊的接口需要模拟请求头，所以在 NodeJS 里通过 axios 获取。（项目演示的服务器上已经部署 nodeJS）

部分内容展示：
- 歌单推荐
![image](https://github.com/thinkupp/vue-music/pic/WX20171009-162411@2x.png)

- 歌手列表
![image](https://github.com/thinkupp/vue-music/pic/WX20171009-162436@2x.png)

- 歌手详情
![image](https://github.com/thinkupp/vue-music/pic/WX20171009-162722@2x.png)

- 歌单排行
![image](https://github.com/thinkupp/vue-music/pic/WX20171009-162541@2x.png)

- 播放内核
![image](https://github.com/thinkupp/vue-music/pic/WX20171009-162640@2x.png)

- 加载效果
![image](https://github.com/thinkupp/vue-music/pic/WX20171009-163041@2x.png)

待添加内容：

个人中心、搜索记录、歌曲列表、收藏歌曲……
