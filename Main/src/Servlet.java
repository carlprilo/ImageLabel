
import src.HdfsOpreate;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

@WebServlet(name = "Servlet",urlPatterns = {"/hello"})
public class Servlet extends javax.servlet.http.HttpServlet {

    static String ip = "hdfs://192.168.1.203:9000";
    static String path = "/Output";

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        System.out.print("got Post request");
        String type_s = request.getParameter("type");
        handlePost(type_s,request,response);

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        System.out.print("got Get request!\n");
        String type_s = request.getParameter("type");
        handleGet(type_s,request,response);
    }

    private boolean handleGet(String type,HttpServletRequest request,HttpServletResponse response) throws IOException {
        boolean result = false;
        HdfsOpreate hdfsOpreate = new HdfsOpreate(ip);
        switch (type) {
            case "readImage":
                hdfsOpreate.readFile(request.getParameter("path"),response);
                result = true;
                break;
            case "saveXml":
                hdfsOpreate.createFile(request.getParameter("path"),request.getParameter("xml_content"),response);
                result = true;
                break;
            case "readDir":
                hdfsOpreate.listFiles(request.getParameter("path"),response);
                result = true;
                break;
            case "readXml":
                hdfsOpreate.readXml(request.getParameter("path"),response);
                break;
            default:
                System.out.print("no match!");
                break;
        }

        return result;
    }

    private boolean handlePost(String type,HttpServletRequest request,HttpServletResponse response) throws IOException {
       return handleGet(type,request,response);
    }


//    private void readLocalFile() {
//        Element element = null;
//        File f = new File("/home/chenpan/Files/images/index.xml");
//        DocumentBuilder db = null;
//        DocumentBuilderFactory dbf = null;
//        try{
//            dbf = DocumentBuilderFactory.newInstance();
//            db = dbf.newDocumentBuilder();
//            Document dt = db.parse(f);
//            element = dt.getDocumentElement();
//            System.out.print("root:" + element.getNodeName()+"\n");
//        } catch (Exception e){
//            e.printStackTrace();
//        }
//    }
//
//    private void saveXml(String xml,String path) {
//        org.dom4j.Document doc = null;
//        try{
//            System.out.println("save xml");
//            doc = org.dom4j.DocumentHelper.parseText(xml);
//            OutputFormat format = OutputFormat.createPrettyPrint();
//            format.setEncoding("GB2312");
//            XMLWriter writer = new XMLWriter(new FileWriter(new File(path+"index0.xml")),format);writer.write(doc);
//            writer.close();
//        }catch (Exception ex)
//        {
//            ex.printStackTrace();
//        }
//
//    }
}
