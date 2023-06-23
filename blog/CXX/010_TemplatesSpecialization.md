# C++ 模板特化

[toc]

## 前言

标题为什么要写 C++ 11 呢，可能是因为我想试试可变参数模板

又一次感慨，写了这么多年 C++，却连皮毛都没摸到，这些东西是怎么想出来的呀

上次有这种感慨还是看 FFmpeg 源码，再上一次是内核源码，真的是优雅。

本文仅讲述类型的特化，不讲范围的特化

关键字：模板、泛化、特化（全特化、偏特化）



## 函数模板及其特化

**示例**

先看下面的例子：（D01）

```cpp
template<typename T>
T max(T t1, T t2) {
    return (t1 > t2) ? t1 : t2;
}

int main() {
    int a = 1;
    int b = 2;
    std::cout << max(a, b) << std::endl;
    const char *d = "b";
    const char *c = "a";
    std::cout << max(c, d) << std::endl;
    return 0;
}
// 输出如下
// 2
// a
```

按理说应该是 b 比 a 大，为什么会输出 a 呢？原来字符串比较的时候是直接比较的指针地址

解决方法，加上以下特化版本即可

```cpp
template<>
const char *max<const char *>(const char *t1, const char *t2) {
    return (strcmp(t1, t2) > 0) ? t1 : t2;
}
```

有些文章可能会推荐使用函数重载来实现函数模板的特化，如刚刚的特化版本可以写为以下重载形式

```cpp
const char *max(const char *t1, const char *t2) {
    return (strcmp(t1, t2) > 0) ? t1 : t2;
}
```

这样写如果是安按照代码（D01）中的方式调用是没问题的；但是万一将 `max(c, d)` 调用换成 `max<const char *>(c, d)` 显示调用就会出问题，这时会去调用默认的泛化版本，所以还是推荐使用模板特化版本

**说明**

函数模板及成员函数均不支持偏特化，仅支持全特化



## 类模板及其特化

### 泛化类

```cpp
template<typename A, typename B>
class Foo {
public:
    Foo(A &&a, B &&b) : a(a), b(b) {}

    void PrintA() {
        std::cout << "A: " << a << std::endl;
    }

    void PrintB() {
        std::cout << "B: " << b << std::endl;
    }

    void Print() {
        std::cout << "A: " << a << "  B: " << b << std::endl;
    }

    void Exec() {
        ++a;
        ++b;
    }

private:
    A a;
    B b;
};
```

### 特化类

假设 double 类型的 Exec 不是自增，二是乘以 1.5，顾需要特化此模板

```cpp
// 偏特化 A 版本
template<typename B>
class Foo<double, B> {
public:
    Foo(double a, B &&b) : a(a), b(b) {}

    void PrintA() {
        std::cout << "A: " << a << std::endl;
    }

    void PrintB() {
        std::cout << "B: " << b << std::endl;
    }

    void Print() {
        std::cout << "A: " << a << "  B: " << b << std::endl;
    }

    void Exec() {
        a *= 1.5;
        ++b;
    }

private:
    double a;
    B b;
};

// 偏特化 B 版本
template<typename A>
class Foo<A, double> {
public:
    Foo(A &&a, double b) : a(a), b(b) {}

    void PrintA() {
        std::cout << "A: " << a << std::endl;
    }

    void PrintB() {
        std::cout << "B: " << b << std::endl;
    }

    void Print() {
        std::cout << "A: " << a << "  B: " << b << std::endl;
    }

    void Exec() {
        ++a;
        b *= 1.5;
    }

private:
    A a;
    double b;
};

// 全特化版本
template<>
class Foo<double, double> {
public:
    Foo(double a, double b) : a(a), b(b) {}

    void PrintA() {
        std::cout << "A: " << a << std::endl;
    }

    void PrintB() {
        std::cout << "B: " << b << std::endl;
    }

    void Print() {
        std::cout << "A: " << a << "  B: " << b << std::endl;
    }

    void Exec() {
        a *= 1.5;
        b *= 1.5;
    }

private:
    double a;
    double b;
};
```

### 说明

三个特化版本中，其实 `PrintA PrintB Print` 三个函数实现是完全一样的，但是类模板特化时就还是需要定义出来，这里倒是有一种方法能偷一点懒：成员函数特化

```cpp
// 偏特化 B 版本  编译不过
template<B>
void Foo<double, B>::Exec() {
    a *= 1.5;
    ++b;
}
// 偏特化 B 版本  编译不过
template<A>
void Foo<A, double>::Exec() {
    ++a;
    b *= 1.5;
}

// 全特化版本
template<>
void Foo<double, double>::Exec() {
    a *= 1.5;
    b *= 1.5;
}
```

理想很丰满，现实很骨感，只有全特化版本能编译通过



## 小结

类的特化需要将所有成员函数都重新实现一遍

函数模板及成员函数均不支持偏特化，仅支持全特化；且函数的全特化版本直接写在头文件的话，会出现多重定义；解决方案有两个，一是仅在头文件申明全特化版本在源文件实现，二是在函数前面加上 `inline` 关键字 
