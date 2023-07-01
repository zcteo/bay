# C++ 11 可变参数模板类

[toc]

## 前言

之前文章[《C++ 11 类型萃取及可变参数模板》](011_TypeTraitsAndVariadicTemplate.md) 讲述了一下 C++ 11 的一些模板的用法，一直还欠着可变参数模板类的使用，正好最近在用 tuple，就基于 tuple 源码，自己理解并实现一些版本，供后续参考



## 自行实现 Tuple

这个是我自己按照我的理解简易实现的版本

### 组合方式实现

```cpp
//前置声明
template<typename ...Args>
class Tuple;

// 一个参数的特化版本
template<typename H>
class Tuple<H> {
public:
    using Head_t = H;

    explicit Tuple(H h) : head(h) {}

    Head_t &Head() { return head; }

private:
    Head_t head;
};

// 多个参数的特化版本
template<typename H, typename ...Args>
class Tuple<H, Args...> {
public:
    using Head_t = H;
    using Tails_t = Tuple<Args...>;

    explicit Tuple(H h, Args...args) : head(h), tails(Tails_t(args...)) {}

    Head_t &Head() { return head; }

    Tails_t &Tails() { return tails; }

private:
    Head_t head;
    Tails_t tails;
};
```

 内存布局即为参数的顺序

```cpp
Tuple<short, int, float, double> t;
// t的等效结构如下
struct Foo {
    short Head;
    struct {
        int Head;
        struct {
            float Head;
            struct {
                double Head;
            } tails;
        } tails;
    } tails;
};
```



### 继承方式实现

```cpp
// 终止继承泛化版本
template<typename ...Args>
class Tuple {
};

// 递归继承版本
template<typename H, typename ...Args>
class Tuple<H, Args...> : public Tuple<Args...> {
public:
    using Head_t = H;
    using Tails_t = Tuple<Args...>;

    explicit Tuple(H h, Args...args) : Tails_t(args...), head(h) {}

    Head_t &Head() { return head; }

    Tails_t &Tails() { return *this; } // 因为是继承，this指针指向首地址

private:
    Head_t head;
};
```

由于是继承，内存布局顺序正好与模板参数声明的顺序相反

```cpp
Tuple<short, int, float, double> t;
// t的等效继承关系如下
struct D {
    double d;
};
struct F : public D {
    float f;
};
struct I : public F {
    int i;
};
struct S : public I {
    short s;
};
```



### 帮助函数

std 提供了元组的 get 函数以及 make_tuple 等帮助函数。我这边也尝试着去实现一下下。

如果没有帮助函数，那么使用时的代码将会是这样，也太烦了吧，要是有几十个参数怎么办？

```cpp
int main(int argc, char *argv[]) {
    Tuple<short, int, float, double> t(1, 2, 3.3f, 4.4);
    std::cout << t.Head() << std::endl;
    std::cout << t.Tails().Head() << std::endl;
    std::cout << t.Tails().Tails().Head() << std::endl;
    std::cout << t.Tails().Tails().Tails().Head() << std::endl;
    t.Tails().Tails().Tails().Head() = 5.5; // 赋值
    std::cout << t.Tails().Tails().Tails().Head() << std::endl;
    return 0;
}
```

#### makeTuple 函数

std::decay 用于去除类型前面的引用、const、volatile 等限定

```cpp
template<typename ...Args>
Tuple<typename std::decay<Args>::type...> makeTuple(Args &&...args) {
    return Tuple<typename std::decay<Args>::type...>(std::forward<Args>(args)...);
}
```

使用示例

```cpp
// 以下两个方式是完全等价的
Tuple<short, int, float, double> t(1, 2, 3.3f, 4.4)
auto t2 = makeTuple(1, 2, 3.3f, 4.4);
```



#### TupleElement 类获取元素类型

用来获取元组下标位置的数据类型

```cpp
// 前置声明
template<uint32_t index, typename T>
struct TupleElement;

// 继承终止版本
template<typename H, typename ...Args>
struct TupleElement<0, Tuple<H, Args...>> {
    using Type = H;
};

// 递归继承版本
template<uint32_t index, typename H, typename ...Args>
struct TupleElement<index, Tuple<H, Args...>> : public TupleElement<index - 1, Tuple<Args...>> {
};
```

使用方法

```cpp
Tuple<short, int, float, double> t(1, 2, 3.3f, 4.4);
TupleElement<0, decltype(t)>::Type s; // s 为short类型
TupleElement<3, decltype(t)>::Type d; // d 为double类型
```

#### GetHelper 类

使用组合方式加仿函数的方式获取元素的引用

```cpp
template<uint32_t index, typename H, typename ...Args>
struct GetHelper {
    typename TupleElement<index, Tuple<H, Args...>>::Type &operator()(Tuple<H, Args...> &t) {
        GetHelper<index - 1, Args...> helper;
        return helper(t.Tails());
    }
};

template<typename H, typename ...Args>
struct GetHelper<0, H, Args...> {
    H &operator()(Tuple<H, Args...> &t) {
        return t.Head();
    }
};
```

#### 下标 Get 函数

```cpp
template<uint32_t index, typename ...Args>
typename TupleElement<index, Tuple<Args...>>::Type &get(Tuple<Args...> &t) {
    GetHelper<index, Args...> helper;
    return helper(t);
}
```

有了 Get 函数后，之前的使用 [代码](#帮助函数) 就变成了这样，简洁多了

```cpp
int main(int argc, char *argv[]) {
    Tuple<short, int, float, double> t(1, 2, 3.3f, 4.4);
    get<3>(t) = 6.6;
    std::cout << get<0>(t) << std::endl;
    std::cout << get<1>(t) << std::endl;
    std::cout << get<2>(t) << std::endl;
    std::cout << get<3>(t) << std::endl;
    get<3>(t) = 5.5;
    std::cout << get<3>(t) << std::endl;
    return 0;
}
```

#### 类型 Get 函数

跟 std 一样，仅支持 C++ 14，元组内不能有两个类型一样的元素

```cpp
template<typename T, typename ...Args>
constexpr size_t findUniqType() {
    constexpr size_t size = sizeof...(Args);
    bool find[] = {std::is_same<T, Args>()...};
    size_t ret = size;
    for (size_t i = 0; i < size; ++i) {
        if (find[i]) {
            if (ret != size) {
                return size; // 表明有重复的
            }
            ret = i;
        }
    }
    return ret;
}

template<typename T, typename ...Args>
T &get(Tuple<Args...> &t) {
    constexpr uint32_t index = findUniqType<T, Args...>();
    static_assert(index < sizeof ...(Args), "the type T must occur exactly once in the Tuple");
    return get<index>(t);
}
```



## libc++ 实现 std::tuple

### 递归继承加多继承

说实话 libc++ 的实现是真的有点难看懂；这是根据我自己的理解

```cpp
// 使用一个HeadBase来存储数据
template<uint32_t index, typename H>
class HeadBase {
protected:
    using Head_t = H;

    HeadBase() = default;

    explicit HeadBase(Head_t &t) : head(t) {}

    static Head_t &Data(HeadBase &base) {
        return base.head;
    };
private:
    Head_t head{0};
};

// 使用TupleImpl继承来实现
template<uint32_t index, typename ...Tail>
class TupleImpl {
};

template<uint32_t index, typename H, typename ...Tail>
class TupleImpl<index, H, Tail...> : public TupleImpl<index + 1, Tail...>, private HeadBase<index, H> {
public:
    using Head_t = H;
    using Type = TupleImpl<index, Head_t, Tail...>;
    using Base = HeadBase<index, Head_t>;

    TupleImpl() = default;

    explicit TupleImpl(Head_t &h, Tail &...t) : Parent(t...), HeadBase<index, Head_t>(h) {}

    Head_t &Head() {
        return Base::Data();
    }
};

template<typename ...Args>
class Tuple : public TupleImpl<0, Args...> {
public:
    Tuple() = default;

    explicit Tuple(Args...args) : TupleImpl<0, Args...>(args...) {}
};
```

`HeadBase::Data` 和 `Tuple::Head` 的原生实现都是用的类的静态函数实现的，我这里实现为成员函数了，其他的逻辑都是和原生实现差不多的

原生静态函数实现如下，其他一致

```cpp
class HeadBase {
protected:
    static Head_t &Data(HeadBase &base) {
        return base.head;
    };
};
class TupleImpl<index, H, Tail...> {
public:
    static Head_t &Head(TupleImpl<index, H, Tail...> &t) {
        return Base::Data(t);
    }
};

// 对应的Get函数
template<uint32_t index, typename H, typename ...Args>
H &get(TupleImpl<index, H, Args...> &t) {
    return TupleImpl<index, H, Args...>::Head(t);
}
```



### 帮助函数

除 `下标 Get 函数` 外，其他的帮助函数实现都是一样的

#### 下标 Get 函数

由于内部实现的时候就考虑到了 Get 函数，所以实现比较简单

```cpp
template<uint32_t index, typename H, typename ...Args>
H &get(TupleImpl<index, H, Args...> &t) {
    return t.Head();
}
```



## 小结

libc++ 的实现是最难的，据说 MSVC 都是使用组合方式实现的。

好久之前就想去了解一下 C++ 的可变参数模板类的用法，无奈以前觉得好难，拿着资料也看不下去。现如今，终于逼着自己一把，把这个浅浅的研究了一下，也算是给自己一个交代了吧。

突然想起，这里顺便说一下 struct 和 class 使用的界定，这个没有统一的说法，看个人习惯，我自己的习惯如下

使用 struct 的情况，非以下情况均使用 class

1. 仅提供数据存储
2. 仅有构造函数和析构函数
3. 仅重载以下运算符：比较、赋值、输入输出
4. 防函数，也可以归类到第三点



