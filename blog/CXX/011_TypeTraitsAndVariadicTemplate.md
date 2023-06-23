# C++ 11 类型萃取及可变参数模板

[toc]

## 前言

之前我这有个需求是需要限制模板的参数类型，搜了一圈发现是使用类型萃取来实现，实现过程中用到了一点可变参数模板，顾将类型萃取和可变参数模板一起记录一下

又一次感慨，写了这么多年 C++，却连皮毛都没摸到，这些东西是真的6

上次有这种感慨还是看 FFmpeg 源码，再上一次是内核源码，真的是优雅。



## 类型萃取

### type_traits 是什么

在 C++ 11之前，stl 就已经用到了类型萃取相关技术了，比如迭代器使用相关的类型获取

C++ 11引入了 type_traits，核心就是定义了一系列的类模板，使得可以来在编译期判断类型的属性、对给定类型进行一些操作获得另一种特定类型、判断类型和类型之间的关系等，这在模板编程里是很有用的，而它们的实现用到的核心技术就是编译期的常量和模板的最优匹配机制。
 type_traits 里面的内容可以分为三大类：

1. 辅助基类: std::integral_constant 以及两个常用特化 true_type 和 false_type，用于创建编译器常量，也是类型萃取类模板的基类。
2. 类型萃取类模板: 用于以编译期常量的形式获得类型特征，比如某个类型是不是浮点数，某个类型是不是另一个类型的基类等等，大部分都是是与否的判断，但也有获取数组的秩这种比较特殊的。
3. 类型转换类模板: 用于通过执行特定操作从已有类型获得新类型，比如为一个类型添加 const、去除 volatile 等。



### 辅助基类

```cpp
template<typename _Tp, _Tp __v>
struct integral_constant
{
    static constexpr _Tp                  value = __v;
    typedef _Tp                           value_type;
    typedef integral_constant<_Tp, __v>   type;
    constexpr operator value_type() const noexcept { return value; }
#if __cplusplus > 201103L
    constexpr value_type operator()() const noexcept { return value; }
#endif
};
using true_type =  integral_constant<bool, true>;
using false_type = integral_constant<bool, false>;
```

std::integral_constant是一个类模板，用于为特定类型封装一个静态常量和对应类型，是整个c++ type traits的基础。

首先我们看模板参数，有两个参数，第一个是类型 T，第二个是对应类型的值 v，value 是一个编译期就能确定的常量，值根据 v 确定，value_type 就是类型 T， 有两个成员函数，均用于返回 value，都是 constexpr 编译期的值：

1. 类型转换函数方式：constexpr operator value_type() const noexcept;
2. 仿函数方式：constexpr value_type operator()() const noexcept; (since C++14)

type_traits 有很多可用的模板，具体定义如下

<https://en.cppreference.com/w/cpp/header/type_traits>

此处就挑几个用到的说明一下

### is_same

判断两个类型是否一致，类型一致时匹配到第二个，即返回 true_type

```cpp
template<typename _Tp, typename _Up>
struct is_same : public false_type {
};

template<typename _Tp>
struct is_same<_Tp, _Tp> : public true_type {
};
```



### conditional

根据条件选择定义的具体类型，条件 false 是匹配到第二个模板类

```cpp
template<bool _Cond, typename _Iftrue, typename _Iffalse>
struct conditional {
    typedef _Iftrue type;
};

template<typename _Iftrue, typename _Iffalse>
struct conditional<false, _Iftrue, _Iffalse> {
    typedef _Iffalse type;
};
```



### enable_if

**SFINAE 机制**

SFINAE 表示替换失败不是错误，Substitution Failure Is Not An Error

当模板定义中出现了一些符合 C++ 语法，但是不存在的类型，函数，变量等。只要没有真正实例化， 也不会报错。

**enable_if**

enable_if 的关键正是 SFINAE，其定义如下，当条件为 true 时定义给定的类型，否则无定义

```cpp
template<bool, typename _Tp = void>
struct enable_if {
};

template<typename _Tp>
struct enable_if<true, _Tp> {
    typedef _Tp type;
};
```



## 限定模板类型

### 指出限定类型

有了以上基础，我们就可以限定模板类型了，如之前文章[《C++ 模板特化》](010_TemplatesSpecialization.md)提到的 max 模板函数，我不想提供字符串特化版本，直接不允许传入其他类型

```cpp
// 仅接收整形或浮点数
template<typename T>
typename std::enable_if<std::is_integral<T>::value || std::is_floating_point<T>::value, T>::type 
    max(T t1, T t2)
{
    return (t1 > t2) ? t1 : t2;
}
```

除了使用 enable_if 外，还可以使用 static_assert 静态断言，见后文 [可变参数模板函数](#可变参数模板函数)

### 封装一下

那如果想限定指定的几个类型呢？这个 enable_if 里面的条件是不是一大堆，所以简单封装一下

```cpp
template<typename...>
struct is_any_of : public std::false_type {
};

template<typename T, typename HEAD, typename... TAIL>
struct is_any_of<T, HEAD, TAIL...>
        : public std::conditional<std::is_same<T, HEAD>::value, std::true_type, 
                                  is_any_of<T, TAIL...>>::type {
};
```

仅允许 int, long, double 三种类型

```cpp
template<typename T>
typename std::enable_if<is_any_of<T, int, long, double>::value, T>::type max(T t1, T t2) {
    return (t1 > t2) ? t1 : t2;
}
```



## 可变参数模板

可变参数模板是 C++11 引入的新特性，是真的很难搞懂（反正目前我还没搞懂）

### 可变参数模板函数

递归展开，需要一个终止函数

```cpp
template<typename T>
double Sum(T t) {
    static_assert(std::is_integral<T>::value || std::is_floating_point<T>::value, "for integer or floating point only");
    return t;
}

template<typename T, typename ...Args>
double Sum(T t, Args ...args) {
    static_assert(std::is_integral<T>::value || std::is_floating_point<T>::value, "for integer or floating point only");
    return t + Sum(args...);
}

int main() {
    std::cout << Sum(1, 2, 3l, 1.1f, 2.2) << std::endl;
    return 0;
}
```

模板展开分析，自下而上

```cpp
template<>
double Sum<double>(double d) {
    return d;
}

template<>
double Sum<float, double>(float f, double d) {
    return f + Sum(d);
}

template<>
double Sum<long, float, double>(long l, float f, double d) {
    return l + Sum(f, d);
}

template<>
double Sum<int, long, float, double>(int i, long l, float f, double d) {
    return i + Sum(l, f, d);
}
```



### 类似 std::thread 实现

看到可变参数模板的第一反应就是 std::thread，类似实现如下

```cpp
class Bar {
public:
    template<typename Fn, typename...Args>
    explicit Bar(Fn &&f, Args &&...args) {
        static_assert(std::__is_invocable<typename std::decay<Fn>::type,
                              typename std::decay<Args>::type...>::value,
                      "arguments must be invocable after conversion to rvalues");
        std::forward<Fn>(f)(std::forward<Args>(args)...);
    }
};

void f1() {
    printf("f1\n");
}

void f2(const char *msg) {
    printf("f2 %s\n", msg);
}

int main() {
    Bar b1(f1);
    Bar b2(f2, "hello");
    return 0;
}
```



### 其他

可以使用 sizeof 运算符求出可变参数的个数，这个好像没什么意思

```cpp
template<typename ...Args>
void Fun(Args ...args) {
    std::cout << sizeof...(args) << std::endl;
}
```



### 分析一下 is_any_of

我们使用可变参数模板及其特化版本：开始检查 T 是否与类型列表的 HEAD 相同。如果找到匹配项，则我们从 std::true_type 继承并完成。如果未找到匹配项，则将参数包 TAIL... 用于继续实例化模板。如果根本找不到匹配项，参数包大小将降至零，并且编译器将匹配到泛化版本，从 std::false_type 完成继承。



## 小结

类型萃取及可变参数模板这个内容好用是好用，就是太难理解了，目前我自己掌握的就这么点东西，太难了，等后续掌握其他东西的时候再慢慢完善吧。



