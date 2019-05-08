<p align="center"><img width="150" src="./public/img/logo.svg"></p>

<h1 align="center">掩耳</h1>

迅雷不及掩耳！

Thunder is inferior to Covear.

基于 [Aria2](https://aria2.github.io/) 开发，目标是提供一个可以代替迅雷的下载软件。支持 HTTP、FTP、BT、Magnet、Metalink等下载方式。

### Why another Aria2 UI
现存的很多 Aria2 可视化操作都是 Web 端，这就需要先在本地启动 Aria2 服务，不是特别的方便，但是也有好处，比如远程控制。

开发时受到 [Motrix](https://motrix.app/) 的诸多启发，在此表示感谢。

决定自己开发的原因也是因为 Motrix 使用的 electron-vue 已经过时，无法配合 vue-cli3 开发，而且 electron 的版本还是 4，而 electron 5 已经发布。另外 Motrix 目前缺少了一些功能，比如浏览磁力链接或者种子文件内的文件列表并选择性下载；有部分不足之处，比如修改任意的配置都需要重启。之后 Covear 还将支持边下边播音视频等功能。

### 截图
![](http://wx4.sinaimg.cn/large/0060lm7Tly1g2uf7yts4fj31hc0s9jsm.jpg)

### 开发
```bash
git clone https://github.com/loliconer/covear.git
cd covear
npm i
npm run electron:serve
```

### 技术栈
[Aria2](https://aria2.github.io/) + [Electron](https://electronjs.org/) + [Vue](https://vuejs.org/) + [Lovue](https://github.com/loliconer/lovue)

### LICENSE
[MIT](https://opensource.org/licenses/MIT)
