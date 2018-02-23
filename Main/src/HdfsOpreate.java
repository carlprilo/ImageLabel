

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.*;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.Charset;
import java.util.Base64;

public class HdfsOpreate {
    //initialization
    static FileSystem hdfs;
    static Configuration conf;

    public HdfsOpreate(String ip) {
        conf = new Configuration();

        conf.set("fs.defaultFS", ip);
        try {
            hdfs = FileSystem.get(conf);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    //create a direction
    public void createDir(String dir) throws IOException {
        Path path = new Path(dir);
        hdfs.mkdirs(path);
        System.out.println("new dir \t" + conf.get("fs.default.name") + dir);
    }



    //create a new file
    public void createFile(String fileName, String fileContent,HttpServletResponse response) throws IOException {
        System.out.println(fileContent);
        String path = fileName.split("[.]")[0]+".xml";
        Path dst = new Path(path);
        byte[] bytes = fileContent.getBytes();
        FSDataOutputStream output = hdfs.create(dst);
        output.write(bytes);
        System.out.println("new file \t" + conf.get("fs.default.name") + path);
        output.close();
        OutputStream result = response.getOutputStream();
        result.write("success!".getBytes());
    }

    //list all files
    public void listFiles(String dirName, HttpServletResponse response) throws IOException {
        Path f = new Path(dirName);
        FileStatus[] status = hdfs.listStatus(f);
        OutputStream outputStream = response.getOutputStream();
        System.out.println(dirName + " has all files:");
        outputStream.write((dirName + "\n").getBytes(Charset.forName("UTF-8")));
        for (int i = 0; i < status.length; i++) {
            System.out.println(status[i].getPath().toString());
            outputStream.write((status[i].getPath().toString() + "\n").getBytes(Charset.forName("UTF-8")));
        }
        outputStream.close();
    }



    //read a file
    public void readFile(String fileName, HttpServletResponse response) throws IOException {
        Path f = new Path(fileName);
        boolean isExists = hdfs.exists(f);
        System.out.println(fileName + "  exist? \t" + isExists);

        FSDataInputStream inputStream = hdfs.open(f);
        int i = inputStream.available();
        byte[] buff = new byte[i];
        inputStream.read(buff);
        inputStream.close();
        response.setContentType("image");
        Base64.Encoder encoder = Base64.getEncoder();
        buff = encoder.encode(buff);
        OutputStream out = response.getOutputStream();
        out.write(buff);
        out.close();
    }

    public void readXml(String fileName, HttpServletResponse response) throws IOException {
        System.out.println("check xml");
        String xmlPath = fileName.split("[.]")[0] + ".xml";
        System.out.println(xmlPath);
        Path f = new Path(xmlPath);
        boolean isExists = hdfs.exists(f);
        System.out.println(xmlPath + "  exist? \t" + isExists);

        FSDataInputStream inputStream = hdfs.open(f);
        int i = inputStream.available();
        byte[] buff = new byte[i];
        inputStream.read(buff);
        inputStream.close();
        response.setContentType("text/xml");
        OutputStream out = response.getOutputStream();
        out.write(buff);
        out.close();
    }
}