# VS2017 & VS2019 创建离线安装包
[toc]

## 微软教程

[使用命令行参数安装 Visual Studio 2017](<https://docs.microsoft.com/zh-cn/visualstudio/install/use-command-line-parameters-to-install-visual-studio?view=vs-2017>)

[使用命令行参数安装 Visual Studio 2019](<https://docs.microsoft.com/zh-cn/visualstudio/install/use-command-line-parameters-to-install-visual-studio?view=vs-2019>)



## 下载安装引导程序

以下链接均来自微软官网

[Visual Studio 2017 Community](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=community&rel=15&utm_medium=microsoft&utm_source=docs.microsoft.com&utm_campaign=link+cta&utm_content=download+commandline+parameters+vs2017)

[Visual Studio 2017 Professional](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=professional&rel=15&utm_medium=microsoft&utm_source=docs.microsoft.com&utm_campaign=link+cta&utm_content=download+commandline+parameters+vs2017)

[Visual Studio 2017 Enterprise](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=enterprise&rel=15&utm_medium=microsoft&utm_source=docs.microsoft.com&utm_campaign=link+cta&utm_content=download+commandline+parameters+vs2017)

[Visual Studio 2019 Community](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=community&rel=16&utm_medium=microsoft&utm_source=docs.microsoft.com&utm_campaign=offline+install&utm_content=download+vs2019)

[Visual Studio 2019 Professional](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=professional&rel=16&utm_medium=microsoft&utm_source=docs.microsoft.com&utm_campaign=offline+install&utm_content=download+vs2019)


[Visual Studio 2019 Enterprise](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=enterprise&rel=16&utm_medium=microsoft&utm_source=docs.microsoft.com&utm_campaign=offline+install&utm_content=download+vs2019)



## 创建安装包命令

以VS2017专业版为例，VS2019自带.NET 4.7.2相关内容，可去除相关add项

管理员CMD cd到vs_professional.exe所在目录
```bash
# 全部组件，比较大不推荐，VS2017大约37GB，VS2019大约27GB
vs_professional.exe --layout F:/VS2017/offline-all --lang zh-CN
# 指定组件
vs_professional.exe --layout F:/VS2017/offline --add Microsoft.VisualStudio.Component.CoreEditor --includeRecommended --add Microsoft.VisualStudio.Workload.ManagedDesktop --includeRecommended --add Microsoft.VisualStudio.Workload.NativeDesktop --includeRecommended --add Microsoft.VisualStudio.Workload.NetCoreTools --includeRecommended --add Microsoft.VisualStudio.Workload.NetWeb --includeRecommended --add Microsoft.VisualStudio.Workload.Node --includeRecommended --add Microsoft.Component.HelpViewer --add Microsoft.Net.Component.4.7.2.SDK --add Microsoft.Net.Component.4.7.2.TargetingPack --add Microsoft.Net.ComponentGroup.4.7.2.DeveloperTools --lang zh-CN
```


## 安装文件命令

与下载时运行命令相同，只是这次的可执行文件在下载缓存目录，也可手动点击缓存目录下的vs_setup.exe执行安装，选择其他组件的话，需要联网下载。
```bash
F:/VS2017/offline/vs_professional.exe --add Microsoft.VisualStudio.Component.CoreEditor --includeRecommended --add Microsoft.VisualStudio.Workload.ManagedDesktop --includeRecommended --add Microsoft.VisualStudio.Workload.NativeDesktop --includeRecommended --add Microsoft.VisualStudio.Workload.NetCoreTools --includeRecommended --add Microsoft.VisualStudio.Workload.NetWeb --includeRecommended --add Microsoft.VisualStudio.Workload.Node --includeRecommended --add Microsoft.Component.HelpViewer --add Microsoft.Net.Component.4.7.2.SDK --add Microsoft.Net.Component.4.7.2.TargetingPack --add Microsoft.Net.ComponentGroup.4.7.2.DeveloperTools --lang zh-CN
```


## 已包含工作负载或组件ID和名称

已包含工作负载或组件ID和名称，需要安装其他负载或组件请参见[微软官网](https://docs.microsoft.com/zh-cn/visualstudio/install/workload-component-id-vs-professional?view=vs-2019)


|                 工作负载或组件ID                  |                             名称                             |
| :-----------------------------------------------: | :----------------------------------------------------------: |
|    Microsoft.VisualStudio.Component.CoreEditor    |                    VisualStudio核心编辑器                    |
|  Microsoft.VisualStudio.Workload.ManagedDesktop   |                         .NET桌面开发                         |
|   Microsoft.VisualStudio.Workload.NativeDesktop   |                      使用C++的桌面开发                       |
|   Microsoft.VisualStudio.Workload.NetCoreTools    |                      .NETCore跨平台开发                      |
|      Microsoft.VisualStudio.Workload.NetWeb       |                       ASP.NET和Web开发                       |
|       Microsoft.VisualStudio.Workload.Node        |                         Node.js开发                          |
|          Microsoft.Component.HelpViewer           |                          帮助查看器                          |
|         Microsoft.Net.Component.4.7.2.SDK         |                   .NET Framework 4.7.2 SDK                   |
|    Microsoft.Net.Component.4.7.2.TargetingPack    |                 .NET Framework 4.7.2 目标包                  |
| Microsoft.Net.ComponentGroup.4.7.2.DeveloperTools |                .NET Framework 4.7.2 开发工具                 |
|                    --langzh-CN                    | 中文；其他语言见[微软官网](<https://docs.microsoft.com/en-us/visualstudio/install/create-an-offline-installation-of-visual-studio?view=vs-2019>) |
|               --includeRecommended                |                         包括建议组件                         |
|                 --includeOptional                 |                         包括可选组件                         |
|             --layoutF:/VS2019/offline             |                         缓存文件目录                         |






***
*由于个人水平有限，文中若有不合理或不正确的地方欢迎指出改正*

*文章可能更新不及时，请以[个人博客](https://zcteo.top/)处文章为准*

