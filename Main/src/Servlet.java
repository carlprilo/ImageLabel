import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FSDataOutputStream;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

//@WebServlet(name = "Servlet",urlPatterns = {"/main.html"})
public class Servlet extends javax.servlet.http.HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        opreateHdfs();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        //PrintWriter out = response.getWriter();
        //out.println("Hello First Servlet!");
        System.out.print("Just have a try!\n");

    }

    private void opreateHdfs() throws IOException {
        org.apache.hadoop.conf.Configuration conf = new org.apache.hadoop.conf.Configuration(true);
        System.out.println("-----------:"+conf);
        conf.set("fs.defaultFS", "hdfs://192.168.1.203:9000");    //master
        String dst = "/Output/test3";
        FileSystem fs = FileSystem.get(conf);
        Path dstPath = new Path(dst); // 目标路径
        // 打开一个输出流
        FSDataOutputStream outputStream = fs.create(dstPath);
        outputStream.write(Integer.parseInt("contents here"));
        outputStream.close();
        fs.close();
        System.out.println("文件创建成功！");
    }
}
