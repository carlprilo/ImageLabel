# ImageLabel Web版文档
## 标注操作流程
>1、先点击read image图标填写完整地址名和文件名，地址名格式 ip:path/file。ip为hdfs的ip，path是文件在hdfs中的路径，file是路径名。参考输入框中给出的样例填写即可。 
>
>2、图片加载好后，点击create rectBox上方图标，图标变化之后，便可以在图片上绘制box。按下鼠标左键，沿对角线拖动，松开鼠标左键后，box便绘制完成。
>
>3、绘制好box后，在add label上方的输入框中输入label的名称，写好之后点击输入框下方图标便可添加label。
>
>4、之后再次点击create rectBox上方的图标，完成一个标注操作。
>
>5、若要在同一张图上标注多个物体，请重复步骤2-4。注意：一次标注操作对应一次box绘制和一次label的添加。重新点击rectBox退出编辑模式再进入编辑模式的操作都是无效操作，不会被存入xml文件中。
>
>6、若要删除某次标注的结果，在右侧第二个输入框中，输入label后中括号对应的编号，再点击delete label上方的图标。
>
>7、更改文件之后（添加/删除操作），点击save上方的图标便可新建或更新xml文件，默认和图片文件在同一个目录下。所有的添加/删除操作，未经保存不会在xml中体现，只会在浏览器中的体现。
>
>

## 开发环境
>ubuntu 16.04LTS + IDEA ULTIMATE 2017.3

## 运行环境
>jdk1.8.0_161 + tomcat 9.0.4


## 打包部署
>1、用IDEA打开项目文件夹，java文件可能会提示缺少包，直接alt+enter快速修复，然后选择将maven导入的包加入classpath即可解决。
>
>2、File->Project Strcuture->Artifats. 点击Main:war，右侧type 选择Web Application：Archive即可。点击Apply。
>
>3、tomcat默认配置完成，但由于tomcat和jdk路径不同需要重新配置。
>
>4、直接点击Run运行项目，运行成功后，在项目的/out/artifacts/the name of .war/ 下可以找到 .war 文件（具体
>命名可在第二步中更改）。
>
>5、将.war文件移动到tomcat安装目录下的webapps下,然后进入tomcat目录下的bin目录，运行 ./
>catalina.sh run 即可启动服务。（需要实现配置JAVA_HOME）.


## 代码组织
>imglabel/Main/web/main.html: 页面布局
>
>imglabel/Main/web/index.js: 前端代码
>
>imglabel/Main/web/index.xml:生成xml的模版文件
>
>imglabel/Main/web/icons:存放图标
>
>imglabel/Main/src/HdfsOpreate.java: 封装hdfs操作
>
>imglabel/Main/src/Servlet.java: 后端代码，处理前端请求
>

## 运行指令

sudo docker run --network=host  --rm -d -e JAVA_HOME="/opt/jdk1.8.0_161" xwzheng/imagelabel:carlprilo /opt/tomcat/apache-tomcat-9.0.4/bin/catalina.sh run
