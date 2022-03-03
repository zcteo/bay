# Go 语言开发环境准备

[toc]

## Go 语言环境安装（Win）

### 下载

<https://golang.google.cn/dl/>



### 环境变量

GOPATH  项目目录；作用参见 [go入门--设置 GOPATH 有什么意义](https://www.jianshu.com/p/2f7473f47c6d)

GOROOT  安装路径

path 添加 %GOROOT%\bin

cmd 输入 `go env` 检查环境变量是否设置成功



## IDE 安装（GoLand）

下载地址 <www.jetbrains.com/go/>

请支持正版 <http://www.520xiazai.com/soft/jetbrains-2020-pojie.html>



## 实例

```go
package main

import "fmt"

func main() {
   var hello = "Hello"
   var world string
   world = "World"
   var i, j = 2, 3
   fmt.Println(hello+" "+world+"!", i, j)
   var length = len(hello)
   fmt.Println("hello len:", length)
}
```

* 没有分号
* 类型在变量后面，可自动推导
* 左花括号换行会引起编译错误



Go语言动态库

<http://reborncodinglife.com/2018/04/29/how-to-create-dynamic-lib-in-golang/>
