import com.sun.beans.decoder.DocumentHandler;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FSDataOutputStream;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.dom4j.DocumentHelper;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.XMLWriter;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import javax.annotation.processing.SupportedSourceVersion;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.lang.annotation.ElementType;


@WebServlet(name = "Servlet",urlPatterns = {"/hello"})
public class Servlet extends javax.servlet.http.HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        System.out.print("get post");
        String content =  request.getParameter("xml");
        System.out.print(content+"aaa");
        String path  ="/home/chenpan/Files/images/";
        saveXml(content,path);


    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        //PrintWriter out = response.getWriter();
        //out.println("Hello First Servlet!");
        System.out.print("Just have a try!\n");
        opreateHdfs();
       // readLocalFile();
        //String content = request.getParameter("xml");
        //System.out.print(content);

    }

    private void opreateHdfs() throws IOException {
        Configuration conf = new Configuration(true);
        System.out.println("-----------:"+conf);
        conf.set("fs.defaultFS", "hdfs://192.168.1.203:9000");    //master
        String dst = "/Output/test3";
        FileSystem fs = FileSystem.get(conf);
        Path dstPath = new Path(dst); // 目标路径
        // 打开一个输出流
        FSDataOutputStream outputStream = fs.create(dstPath);
        outputStream.write(Integer.parseInt("contentshere"));
        outputStream.close();
        fs.close();
        System.out.println("文件创建成功！");
    }

    private void readLocalFile() {
        Element element = null;
        File f = new File("/home/chenpan/Files/images/index.xml");
        DocumentBuilder db = null;
        DocumentBuilderFactory dbf = null;
        try{
            dbf = DocumentBuilderFactory.newInstance();
            db = dbf.newDocumentBuilder();
            Document dt = db.parse(f);
            element = dt.getDocumentElement();
            System.out.print("root:" + element.getNodeName()+"\n");
        } catch (Exception e){
            e.printStackTrace();
        }
    }

    private void saveXml(String xml,String path) {
        org.dom4j.Document doc = null;
        try{
            System.out.println("save xml");
            doc = org.dom4j.DocumentHelper.parseText(xml);
            OutputFormat format = OutputFormat.createPrettyPrint();
            format.setEncoding("GB2312");
            XMLWriter writer = new XMLWriter(new FileWriter(new File(path+"index0.xml")),format);writer.write(doc);
            writer.close();
        }catch (Exception ex)
        {
            ex.printStackTrace();
        }

    }
}
