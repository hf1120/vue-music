# vue-music

> 基于vue的移动音乐播放器


###Q
1、组件 scroll 下，加载失败时的提示
2、loading 里的 title 变化，要通过 computed 实现

###预解释
1、如果出现图片无法点击的情况，尝试为img添加 'needsclick' 类名

### 改动

##### 快速入口列表
1、教程中的快速入口列表，对应的字母项只显示对应的入口，比如说如果没有姓名拼音A开头的，入口则没有A这一项
   这个版本添加了所有的入口，热 + A-Z，没有的姓氏对应的入口颜色会变淡



难点：
（1）、在动态创建 DOM 的时候，不能按照老方法将对应索引存到 data-index 中，因为这样会导致索引超出上限，这个索引应该是和对应的歌手索引一致的。
      所以这里在 data-index 创建的时候调用了新增的一个方法，方法返回一个递增的自定义变量，如果是不存在的姓氏返回 -1。
      这时候遇到了一个问题，VUE报错，提示是一个无限的循环，所以在方法里限制了一个条件，看起来不会导致索引一直递增，事实上是不会一直递增的。
      这时候又遇到一个问题，存到自定义属性 data-index 的值有时候是不对的，本应该是从 0 开始的，却经常是从 22 开始了，后来找到原因是在 DOM 渲染的时候这个新增的方法就开始执行了，数据改变时，又执行了一遍，所以在方法内通过判断数据的 title 项，再将原始索引重置，问题就解决了。

（2）拖动的时候，如果通过起始落点到滑动落点的差来计算，如果中间有不存在的姓氏，将导致定位不到正确的位置。这里通过两个自定义属性解决。

