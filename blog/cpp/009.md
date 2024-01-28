# 线程设置名字

有些情况下，多线程的话，需要给线程设置名字，方便调试。

但是 C++11 虽说标准库就支持线程，但是并没有封装其他操作线程的方法，就很难受。

话不多说，show code

```cpp
#include <thread>
#ifdef WIN32
#include <Windows.h>
#include <processthreadsapi.h>
#else
#include <pthread.h>
#endif

void worker()
{
    std::this_thread::sleep_for(std::chrono::seconds(5));
}

int main()
{
    std::thread foo(worker);
    auto handle = foo.native_handle();
#ifdef WIN32
    SetThreadDescription(handle, L"FOO");
#else
    pthread_setname_np(handle, "FOO");
#endif
    foo.join();
    return 0;
}
```

这是没有设置名字的，线程名字都是程序名字

![01](img/009/01.png)



这是设置了名字的，线程名字已经变成 FOO 了

![02](img/009/02.png)



说明：

1. Linux 下设置名字最多 16 字节，去除 `'\0'` 后，就只有 15 字节了

2. Windows 这个函数对系统版本有要求，来自[MS文档](https://docs.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-setthreaddescription)

   | **Minimum supported client** | Windows 10, version 1607 [desktop apps \| UWP apps] |
   | ---------------------------- | --------------------------------------------------- |
   | **Minimum supported server** | Windows Server 2016 [desktop apps \| UWP apps]      |
   | **Target Platform**          | Windows                                             |
   | **Header**                   | processthreadsapi.h                                 |
   | **Library**                  | Kernel32.lib                                        |
   | **DLL**                      | Kernel32.dll                                        |



