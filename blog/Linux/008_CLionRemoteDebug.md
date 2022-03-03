# CLion 远程调试 Linux

本地机器 Windows，目标机器 Ubuntu

步骤如下：

1. 目标机器安装cmake，gcc，g++，gdb，gdbserver
2. 本地机器安装 Clion
3. 配置 Clion Toolchains，选择 Remote Host，使用 ssh 连接，clion会自动检测工具链
4. 打开项目之后，可以在 Tools->Deployment->Configuration->Mappings设置目录映射
