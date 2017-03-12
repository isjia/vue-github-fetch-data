# Gettting up and Running with the Vue.js 2.0 Framework

原文：<https://www.sitepoint.com/up-and-running-vue-js-2-0/>
Code on Github: <https://github.com/jackfranklin/vue2-demo-proj>

本文介绍：
- vue 2.0 框架入门
- vue template
- components

## Components

- 建议一个 `.vue` 文件来定义一个组件
- 通过构建工具（比如webpack），build成最终可执行的js文件

一个典型的组件看起来是这样的：

```vue
<template>
  <p>This is my HTML for my component</p>
</template>

<script>
export default {
  // all code for my component goes here
}
</script>

<style scoped>
  /* CSS here
   * by including `scoped`, we ensure that all CSS
   * is scoped to this component!
   */
</style>
```

我们也可以给每个元素指定 `src` 属性，分别指向 HTML、JS、CSS 文件。

## 建立一个项目

使用 `Vue CLI` 工具，可以轻松建立一个 vue 项目。这里介绍一下从零开始建立的步骤，以便能更好的理解构建工具在其中起到的作用，这里会用到：
- webpack
- vue-loader plugin
- Bebel

### Webpack的配置

- Make Webpack build from src/main.js, and output into build/main.js
- Tell Webpack to use the vue-loader for any .vue files
- Tell Webpack to use Babel for any .js files
- Tell the vue-loader that it should use Babel to transpile all JavaScript. This means that when we include JavaScript in our \*.vue files, it will be transpiled through Babel.

webpack 配置文件如下：

```js
module.exports = {
  entry: './src/main',
  output: {
    path: './build',
    filename: 'main.js',
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue',
      },
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
      },
    ],
  },
  vue: {
    loaders: {
      js: 'babel',
    },
  },
}
```

## Hello World

`src/App/index.vue`

```js
<template src="./template.html"></template>
<script src="./script.js"></script>
<style scoped src="./style.css"></style>
```

`src/App/script.js`

```js
export default {
  name: 'App',
  data() {
    return {}
  },
}
```

`src\main.js`

```js
import Vue from 'vue'

import AppComponent from './App/index.vue'

const vm = new Vue({
  el: '#app',
  components: { //注册组件
    app: AppComponent,
  },
  render: h => h('app'),
})
```

**建议安装chrome plugin：Vue Devtools**

## 开始一个app project

`src/GithubInput`目录下创建4个文件：
- index.vue
- template.html
- script.js
- style.css

```js
export default {
  name: 'GithubInput',
  data() {
    return {
      username: '',
    }
  }
}
```

`src\GithubInput\emplate.html`

```html
<p>github input</p>
```

在 `src/App/script.js` 中引入 GithubInput 组件：

```js
import GithubInput from '../GithubInput/index.vue'

export default {
  name: 'App',
  components: {
    'github-input': GithubInput,
  },
  data() {
    return {}
  },
}
```

更新 `src/App/template.html`，注意每个组件只能被一个 HTML 跟标签包裹，所以这里要加上一个`<div>`

```html
<div>
  <p>Hello World</p>
  <github-input></github-input>
</div>
```

### 修改为 Form Input

- 跟踪用户在input中的输入
- 同步更新其他引用input value的值

`src/GithubInput/template.html`

```html
<form v-on:submit.prevent="onSubmit">
  <input type="text" v-model="username" placeholder="Enter a github username here" />
  <button type="submit">Go!</button>
</form>
```

- `v-on` 用来绑定事件
- `v-model` 用来双向绑定数据

`src/GithubInput/script.js` 中添加 `onSubmit` 方法

```js
name: 'GithubInput',
methods: {
  onSubmit(event) {
    if (this.username && this.username !== '') {
    }
  }
},
```

为了在组件之间传递消息，我们这里用一个 message bus 对象，`src/bus.js`

```js
import Vue from 'vue'
const bus = new Vue()

export default bus
```

在 `GithubInput` 中引入 message bus：

```js
import bus from '../bus'

export default {
  ...,
  methods: {
    onSubmit(event) {
      if (this.username && this.username !== '') {
        bus.$emit('new-username', this.username)
      }
    }
  },
  ...
}
```

## 显示结果的组件 GithubOutput

创建`GithubOutput`组件：

```js
import bus from '../bus'

export default {
  name: 'GithubOutput',
  data() {
    return {
      currentUsername: null,
      githubData: {}
    }
  }
}
```

`GithubOutput`组件需要监听`new-username`事件：

```js
export default {
  name: 'GithubOutput',
  created() {
    bus.$on('new-username', this.onUsernameChange)
  },
  destroyed() {
    bus.$off('new-username', this.onUsernameChange)
  },
  ...
}
```

当`new-username`事件触发时，设置`currentUsername`:

```js
methods: {
  onUsernameChange(name) {
    this.currentUsername = name
  }
},
```

渲染页面：`src/GithubOutput/template.html`

```html
<div>
  <p v-if="currentUsername == null">
    Enter a username above to see their Github data
  </p>
  <p v-else>
    Below are the results for {{ currentUsername }}
  </p>
</div>
```

### Fetch Github 数据

*建议使用第三方的 HTTP fetch API, vue 官方推荐 Axios*

简单起见，我们用 `fetchGithubData` 这个方法来获取 Github API 的数据，并存储到本地。

```js
fetchGithubData(name) {
  // if we have data already, don't request again
  if (this.githubData.hasOwnProperty(name)) return

  const url = `https://api.github.com/users/${name}`
  fetch(url)
    .then(r => r.json())
    .then(data => {
      // in here we need to update the githubData object
    })
}
```

在页面中显示结果：`src/GithubOutput/template.html`

```html
<div v-if="githubData[currentUsername]">
  <h4>{{ githubData[currentUsername].name }}</h4>
  <p>{{ githubData[currentUsername].company }}</p>
  <p>Number of repos: {{ githubData[currentUsername].public_repos }}
</div>
```
