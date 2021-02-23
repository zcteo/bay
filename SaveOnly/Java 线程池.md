## Java 线程池

线程池不推荐使用 Executors 去创建，而是通过 ThreadPoolExecutor 的方式，这样的处理方式让写的同学更加明确线程池的运行规则，规避资源耗尽的风险。 

说明：Executors 返回的线程池对象的弊端如下 

1. FixedThreadPool 和 SingleThreadPool: 允许的请求队列长度为 Integer.MAX_VALUE，可能会堆积大量的请求，从而导致 OOM
2. CachedThreadPool 和 ScheduledThreadPool: 允许的创建线程数量为 Integer.MAX_VALUE，可能会创建大量的线程，从而导致 OOM。



ThreadPoolExecutor 构造方法的参数说明

```java
public ThreadPoolExecutor(int corePoolSize, // 1
                          int maximumPoolSize,  // 2
                          long keepAliveTime,  // 3
                          TimeUnit unit,  // 4
                          BlockingQueue<Runnable> workQueue, // 5
                          ThreadFactory threadFactory,  // 6
                          RejectedExecutionHandler handler ); //7
```



| 序号 |      名称       |           类型            |       含义       |
| :--: | :-------------: | :-----------------------: | :--------------: |
|  1   |  corePoolSize   |            int            |  核心线程池大小  |
|  2   | maximumPoolSize |            int            |  最大线程池大小  |
|  3   |  keepAliveTime  |           long            | 线程最大空闲时间 |
|  4   |      unit       |         TimeUnit          |     时间单位     |
|  5   |    workQueue    | BlockingQueue\<Runnable\> |   线程等待队列   |
|  6   |  threadFactory  |       ThreadFactory       |   线程创建工厂   |
|  7   |     handler     | RejectedExecutionHandler  |     拒绝策略     |

