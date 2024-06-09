# Bay

jekyll 博客模板

基于 https://github.com/eliottvincent/bay 修改，用于 [闻道](https://zcteo.cn/)


## 环境依赖

* ruby 2.5.x
* bundler 2.0.2


## build

### 安装 ruby

如果是 ubuntu 18.04 可以直接 `apt install ruby-full`

是其他版本可以去 ruby 的 github 仓库看看

<https://github.com/ruby/ruby-builder/releases>

以 ubuntu 22.04 为例

```bash
apt install libyaml-0-2
wget https://github.com/ruby/ruby-builder/releases/download/toolcache/ruby-2.5.9-ubuntu-22.04.tar.gz
mkdir -p /opt/hostedtoolcache/Ruby/2.5.9
tar xvf ruby-2.5.9-ubuntu-22.04.tar.gz -C /opt/hostedtoolcache/Ruby/2.5.9
export PATH=$PATH:/opt/hostedtoolcache/Ruby/2.5.9/x64/bin
```


### 编译

**安装其他环境**

```bash
apt update
apt install gcc g++ make libgmp-dev locales -y
locale-gen en_US.UTF-8 # 生成UTF8语言
gem install bundler -v 2.0.2
```

**编译源码**

```bash
cd project-dir
export MAKEFLAGS="-j$(nproc)" # 安装native包时多线程编译
bundle install
./scripts/build.sh
```

gem 源

```bash
gem sources --add https://mirrors.tuna.tsinghua.edu.cn/rubygems/ --remove https://rubygems.org/
```

bundler 源

```bash
bundle config mirror.https://rubygems.org https://mirrors.tuna.tsinghua.edu.cn/rubygems
```
