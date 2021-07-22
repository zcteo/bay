# C++11 中的字面量

# 引言

也是看了 [JSON for Modern C++](https://github.com/nlohmann/json) 的源码，发现它竟然可以直接通过以下代码直接生成 json 对象

```cpp
nlohmann::json json = R"({"Foo":"foo"})"_json;
```

通过 IDE 跳转到定义，看到函数定义如下

```cpp
inline nlohmann::json operator "" _json(const char* s, std::size_t n)
{
    return nlohmann::json::parse(s, s + n);
}
```

我孤陋寡闻了，没见过这种写法。



## 用户定义字面量

根据 C++11 标准规定，用户定义字面量只有下列参数列表是合法的

```cpp
char const *
unsigned long long
long double
char const *, size_t
wchar_t const *, size_t
char16_t const *, size_t
char32_t const *, size_t
```

四个对于字符串相当有用，因为第二个参数会自动推断为字符串的长度

```cpp
size_t operator "" _len(const char *str, size_t size)
{
    return size;
}

int main()
{
    PRINT("ABCD"_len);
    return 0;
}
// 输出 4
```

*PRINT宏定义可以参考上一篇文章[《C 可变参数宏》](005_CxxVariableParameterMacro.md)*
