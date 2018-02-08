import com.sun.beans.decoder.DocumentHandler;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FSDataInputStream;
import org.apache.hadoop.fs.FSDataOutputStream;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IOUtils;
import org.dom4j.DocumentHelper;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.XMLWriter;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import src.HdfsOpreate;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.*;

@WebServlet(name = "Servlet",urlPatterns = {"/hello"})
public class Servlet extends javax.servlet.http.HttpServlet {

    static String ip = "hdfs://192.168.1.203:9000";
    static String path = "/Output";

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
//        System.out.print("get post");
//        String content =  request.getParameter("xml");
//        System.out.print(content+"aaa");
//        String path  ="/home/chenpan/Files/images/";
//        saveXml(content,path);
        System.out.print("got Post request");
        String type_s = request.getParameter("type");
        handlePost(type_s,request);

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        //PrintWriter out = response.getWriter();
        //out.println("Hello First Servlet!");
        System.out.print("got Get request!\n");
        String type_s = request.getParameter("type");
        handleGet(type_s,request);
        //wirteHdfs();
        //readHdfs();
       // readLocalFile();
        //String content = request.getParameter("xml");
        //System.out.print(content);

    }

    private boolean handleGet(String type,HttpServletRequest request) throws IOException {
        boolean result = false;
        HdfsOpreate hdfsOpreate = new HdfsOpreate(ip);
        //hdfsOpreate.listFiles(path);
        switch (type) {
            case "readImage":
                hdfsOpreate.readFile(path + "/image/index.jpg");
                result = true;
                break;
            case "saveXml":
                hdfsOpreate.createFile(path + "/image/index.xml", request.getParameter("xml_content"));
                result = true;
                break;
            case "readDir":
                hdfsOpreate.listFiles(path);
                result = true;
                break;
        }

        return result;
    }

    private boolean handlePost(String type,HttpServletRequest request) throws IOException {
       return handleGet(type,request);
    }


    private void readHdfs() throws IOException{
        try{
        Configuration conf = new Configuration(true);
        System.out.println("-----------:"+conf);
        conf.set("fs.defaultFS", "hdfs://192.168.1.203:9000");    //master
        String dst = "/Output/test3";
        FileSystem fs = FileSystem.get(conf);
        Path dstPath = new Path(dst); // 目标路径
        // 打开一个输出流
        FSDataInputStream inputStream = fs.open(dstPath);
        BufferedReader d = new BufferedReader(new InputStreamReader(inputStream));
        String s = "";
        while ((s = d.readLine()) != null) {
            System.out.println(s);
           }
        d.close();
        fs.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    private void wirteHdfs() throws IOException {
        Configuration conf = new Configuration(true);
        System.out.println("-----------:"+conf);
        conf.set("fs.defaultFS", "hdfs://192.168.1.203:9000");    //master
        String dst = "/Output/test3";
        FileSystem fs = FileSystem.get(conf);
        Path dstPath = new Path(dst); // 目标路径
        // 打开一个输出流
        FSDataOutputStream outputStream = fs.create(dstPath);
        outputStream.writeUTF("Hello hadoop");
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
