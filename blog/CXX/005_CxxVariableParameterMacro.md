# C 可变参数宏

[toc]

## 引言

在看 [JSON for Modern C++](https://github.com/nlohmann/json) 的源码时，看到有可变参数宏的使用，觉得这是个好东西，遂研究之。



## 收集资料

经过一番百度后，大概只能搜到以下用法

```cpp
#define PRINTF(...) printf(__VA_ARGS__)

PRINTF("Foo %d Bar %d", 1, 2);
```

或者这种用法

```cpp
#define ERROR(...) \
fprintf(stderr, "File: %s, Line: %d\n", __FILE__, __LINE__); \
fprintf(stderr, __VA_ARGS__)

ERROR("Error NO.%d\n", 9);
```

夺笋啊！这个不就是套娃吗？把可变参数宏转给可变参数函数，那我还研究什么可变参数宏，我直接去研究可变参数函数好了。果然百度没啥用。

还好，机缘巧合之下找到了一篇文章，看了之后豁然开朗：<https://blog.csdn.net/lmhuanying1012/article/details/78715351>



## 进入正题

可变参数宏是 C99 规范中新增的，编译器会把 ```…``` 保存在预定义宏 ```__VA_ARGS__ ``` 中，这样预定义宏 ```__VA_ARGS__ ```  就可以被用在替换部分中，替换省略号所代表的字符串。就是宏替换的时候 ```__VA_ARGS__ ```  会代表省略号 ```…``` 的内容。

然后参考上面提到的 json 中的用法，写出了如下宏定义

```cpp
#define PRINT(...) std::cout \
GET_MACRO(__VA_ARGS__, OUTPUT5, OUTPUT4, OUTPUT3, OUTPUT2, OUTPUT1, ...)(__VA_ARGS__) \
<< std::endl

#define GET_MACRO(_1, _2, _3, _4, _5, NAME, ...) NAME

#define OUTPUT1(v1)   << " " << v1
#define OUTPUT2(v1, v2) OUTPUT1(v1) OUTPUT1(v2)
#define OUTPUT3(v1, v2, v3) OUTPUT1(v1) OUTPUT2(v2, v3)
#define OUTPUT4(v1, v2, v3, v4) OUTPUT1(v1) OUTPUT3(v2, v3, v4)
#define OUTPUT5(v1, v2, v3, v4, v5) OUTPUT1(v1) OUTPUT4(v2, v3, v4, v5)
```

使用上述宏

```cpp
PRINT(1);
PRINT(1, 2);
PRINT(1, 2, 3);
PRINT(1, 2, 3, 4);
PRINT(1, 2, 3, 4, 5);
PRINT("FOO");
PRINT("FOO", "BAR");
```

以上宏展开为

```cpp
std::cout << " " << 1 << std::endl;
std::cout << " " << 1 << " " << 2 << std::endl;
std::cout << " " << 1 << " " << 2 << " " << 3 << std::endl;
std::cout << " " << 1 << " " << 2 << " " << 3 << " " << 4 << std::endl;
std::cout << " " << 1 << " " << 2 << " " << 3 << " " << 4 << " " << 5 << std::endl;
std::cout << " " << "FOO" << std::endl;
std::cout << " " << "FOO" << " " << "BAR" << std::endl;
```



## 展开过程分析

以 ```PRINT(1);``` 和 ```PRINT(1, 2, 3);``` 为例

```cpp
PRINT(1);
// 第一步展开
std::cout GET_MACRO(1, OUTPUT5, OUTPUT4, OUTPUT3, OUTPUT2, OUTPUT1, ...)(1) << std::endl;
// 先看一下对应
// GET_MACRO( 1, OUTPUT5, OUTPUT4, OUTPUT3, OUTPUT2, OUTPUT1, ...)
// GET_MACRO(_1,      _2,      _3,      _4,      _5,    NAME, ...) NAME
// 替换出来
std::cout OUTPUT1(1) << std::endl;
// 最后
std::cout << " " << 1 << std::endl;
```

```cpp
PRINT(1, 2, 3);
// 第一步展开后
std::cout GET_MACRO(1, 2, 3, OUTPUT5, OUTPUT4, OUTPUT3, OUTPUT2, OUTPUT1, ...)(1, 2, 3) << std::endl;
// 先看一下对应
// GET_MACRO( 1,  2,  3, OUTPUT5, OUTPUT4, OUTPUT3, OUTPUT2, OUTPUT1, ...)
// GET_MACRO(_1, _2, _3,      _4,      _5,    NAME, ...) NAME
// 替换出来
std::cout OUTPUT3(1, 2, 3) << std::endl;
// 后面就不用说了吧
```



## 还有一句

几个参数就需要定义几个宏；比如上面的例子，6个参数就会出问题了。可以看一下大神的代码，他定义了64个，非常之壮观

[JSON for Modern C++ 中的可变参数宏定义](https://github.com/nlohmann/json/blob/b2e784c33bcdda3b58244f5811c89f023cd54715/single_include/nlohmann/json.hpp#L2352-L2484)






***
*由于个人水平有限，文中若有不合理或不正确的地方欢迎指出改正*

*文章可能更新不及时，请以[个人博客](https://zcteo.top/)处文章为准*

