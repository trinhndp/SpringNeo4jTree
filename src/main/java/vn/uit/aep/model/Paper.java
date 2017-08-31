package vn.uit.aep.model;

import java.io.*;
import java.util.ArrayList;

/**
 * Created by trinhndp on 31-Jul-17.
 */
public class Paper {
    private String title;
    private String url;
    private String shortDes;
    private String content;

    public Paper() {
    }

    public Paper(String title, String url, String shortDes, String content) {
        this.title = title;
        this.url = url;
        this.shortDes = shortDes;
        this.content = content;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getShortDes() {
        return shortDes;
    }

    public void setShortDes(String shortDes) {
        this.shortDes = shortDes;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @Override
    public String toString() {
        return "{" +
                "title:'" + title + '\'' +
                ", url:'" + url + '\'' +
                ", shortDes:'" + shortDes + '\'' +
                ", content:'" + content + '\'' +
                '}';
    }

    public void readPaper(String path) {
        ArrayList<String> list = new ArrayList();
        try {
            //get Title of file
            FileInputStream fstream = new FileInputStream(path);
            DataInputStream in = new DataInputStream(fstream);
            BufferedReader br = new BufferedReader(new InputStreamReader(in, "UTF-8"));
            String strLine;

            while ((strLine = br.readLine()) != null) {
                list.add(strLine);
            }

            setTitle(list.get(0));
            setUrl(list.get(1));
            setShortDes(list.get(2));
            setContent(list.get(3));
            in.close();
        }
        catch(Exception e){
            e.printStackTrace();
        }
    }
}
