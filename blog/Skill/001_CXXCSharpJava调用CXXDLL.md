### CXX CSharp Java调用CXX DLL

[toc]

#### 导出C++ Dll

C++编译器为VS2019

64为的Debug模式生成的无法调用（不知道具体原因）

C++导出函数接口的方式主要有两种：

***_stdcall可以在项目属性 -> C/C++ -> 高级 -> 调用约定处指定，就不用在每个函数前指定了***

##### 在函数定义时候加extern "C" _declspec(dllexport)

exportdll.h

```cpp
extern "C" _declspec(dllexport) int _stdcall Add(int i, int j);
extern "C" _declspec(dllexport) float _stdcall Avg(int i, int j);
```

exportdll.cpp

```cpp
#include "exportdll.h"
int Add(int i, int j)
{
	return i + j;
}
float Avg(int i, int j)
{
	return (i + j) / 2.0f;
}
```

##### 使用模块定义文件（.def）声明

exportdll.h

```C++
int _stdcall Add(int i, int j);
float _stdcall Avg(int i, int j);
```

exportdll.cpp

```cpp
#include "exportdll.h"
int Add(int i, int j)
{
	return i + j;
}
float Avg(int i, int j)
{
	return (i + j) / 2.0f;
}
```

右键源文件，选择添加模块定义文件exportdll.def

在项目属性 -> 链接器 -> 输入 -> 模块定义文件处输入exportdll.def

exportdll.def

```def
LIBRARY	exportdll
EXPORTS
    Add
    Avg
```

 ==CMake+MinGW好像不能使用def，只需要加上extern "C"==

#### 简单调用C++ DLL

***均为基本数据类型的调用，复杂的数据类型会涉及到转换对应关系***

##### C++动态调用

_stdcall也可以在项目属性 -> C/C++ -> 高级 -> 调用约定处指定

第五行可能会出错E0167 "const char *" 类型的实参与 "LPCWSTR" 类型的形参不兼容，项目属性 -> 高级 -> 字符集选择"使用多字节字符集”

```cpp
// MinGW注意头文件手动指定为Windows.h
int main()
{
	typedef int(_stdcall* AddFun)(int, int);
	typedef float(_stdcall* AvgFun)(int, int);
	HINSTANCE dll = LoadLibrary("exportdll.dll");
	if (dll != NULL) 
    {
		AddFun Add = (AddFun)GetProcAddress(dll, "Add");
		if (Add != NULL) 
        {
			cout << Add(3, 4) << endl;
		}
		AvgFun Avg = (AvgFun)GetProcAddress(dll, "Avg");
		if (Avg != NULL) 
        {
			cout << Avg(3, 4) << endl;
		}
	}
    return 0;
}
```

##### C#调用

 CallingConvention为StdCall可以不用指定

```csharp
class Program
{
    [DllImport("exportdll.dll", CallingConvention = CallingConvention.StdCall)]
    public static extern float Avg(int left, int right);
    [DllImport("exportdll.dll"]
    public static extern int Add(int left, int right);
    static void Main(string[] args)
    {
        Console.WriteLine(Avg(11, 2));
        Console.WriteLine(Add(11, 2));
    }
}
```

#####  Java调用

Java调用C++主要有三种方法：

**1. JNI**

性能最高，这里不做阐述

**2. JNative**

DllImport.java

```java
public class DllImport {
    public static void main(String[] args) {
        JNative add = new JNative("exportdll.dll", "Add");
        // 设置函数返回值为int
        add.setRetVal(Type.INT);
        // add函数的第一个参数是3
        add.setParameter(0, 3);
        // add函数的第二个参数是4
        add.setParameter(1, 4);  
        // 执行
        add.invoke();
        // 获取结果
        int result = Integer.parseInt(add.getRetVal());  //获取返回结果
        System.out.println(result);
    }
}
```

**3. JNA**

性能较低，但是最简单

pom.xml

```xml
<dependency>
    <groupId>com.sun.jna</groupId>
    <artifactId>jna</artifactId>
    <version>3.0.9</version>
</dependency>
```

DllLibrary.java

```java
public interface DllLibrary extends Library{
    int Add(int i, int j);
    float Avg(int i, int j);
}
```

DllImport.java

```java
public class DllImport {
    public static void main(String[] args) {
        DllLibrary dll = (DllLibrary)Native.loadLibrary("exportdll.dll", DllLibrary.class);
        System.out.println(dll.Add(3, 4));
        System.out.println(dll.Avg(3, 4));
    }
}
```