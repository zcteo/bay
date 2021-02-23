### Maven

#### 跳过测试

```bash
mvn clean install -Dmaven.test.skip=true
```

#### 安装jar包到本地

```bash
mvn install:install-file -Dfile=***.jar -DgroupId=*** -DartifactId=*** -Dversion=*** -Dpackaging=jar
```

#### jar包version后面还有内容，加classifier节点

```xml
<!--json-lib-2.4-jdk15.jar-->
<dependency>
    <groupId>net.sf.json-lib</groupId>
    <artifactId>json-lib</artifactId>
    <version>2.4</version>
    <classifier>jdk15</classifier>
</dependency>
```

