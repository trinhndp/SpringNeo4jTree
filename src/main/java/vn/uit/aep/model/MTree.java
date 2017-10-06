package vn.uit.aep.model;

import org.apache.commons.collections.map.HashedMap;

import java.io.*;
import java.sql.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by trinhndp on 07-Aug-17.
 */
public class MTree {
    private Connection con;

    public MTree(){
        try {
            con = DriverManager.getConnection(
                    "jdbc:neo4j:bolt://localhost/?user=neo4j,password=1234567,scheme=basic");  //sửa lại
        } catch (SQLException e) {
            e.printStackTrace();
        }

    }

    public void createTree(LocalDate localDate, int sumDays, String pathFolder){

        try {
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyyMMdd");
            DateTimeFormatter dtf2 = DateTimeFormatter.ofPattern("dd/MM/yyyy");


            Statement stmt = con.createStatement();
            stmt.execute("CREATE (n:Root {name : \"Root\"})");


            for (int d = 0; d < sumDays; d++) {
                LocalDate nextDate = localDate.plusDays(d);
                String path = pathFolder + dtf.format(nextDate);  //sửa lại

                String sql = "MATCH (r:Root)" +
                        "WHERE r.name = \"Root\"" +
                        "CREATE (t:Timestamp {key : \"" + dtf.format(nextDate) + "\", value : \"" + dtf2.format(nextDate) + "\"} )<-[:has]-(r)";

                stmt.execute(sql);
                System.out.println(path);
                File folder = new File(path);
                File[] folders = folder.listFiles();
                System.out.println(folders.length);

                for (File subfolder : folders) {
                    String sql2 = "MATCH (t:Timestamp)" +
                            "WHERE t.value = \"" + dtf2.format(nextDate) + "\"" +
                            "CREATE (n:Topic {name : \"" + subfolder.getName() + "\"} )<-[:appears]-(t)";

                    stmt.execute(sql2);
                    int i=0;
                    File[] files = subfolder.listFiles();
                    for (File file : files) {
                        FileInputStream fstream = new FileInputStream(file);
                        DataInputStream in = new DataInputStream(fstream);
                        BufferedReader br = new BufferedReader(new InputStreamReader(in));
                        String strLine;
                        java.util.ArrayList<String> list = new java.util.ArrayList<String>();

                        while ((strLine = br.readLine()) != null) {
                            list.add(strLine);
                        }
                        String filePath = file.getPath();
                        filePath = filePath.replace("\\", "\\\\");   //-> path = C:\\
                        String sql3 = "MATCH (t:Topic)" + "WHERE t.name = \"" + subfolder.getName() + "\" "
                                + "MATCH (n:Timestamp)-[]-(t)" + "WHERE n.value = \"" + dtf2.format(nextDate)+ "\" "
                                + "CREATE (p:Paper {title: \"" + list.get(0) +"\", path: \"" + filePath + "\"}) <-[:written_in]-(t)";
                        stmt.execute(sql3);
                        i++;
                    }
                    System.out.println("Total files: "+ i);
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void insertBranch(LocalDate localDate, String pathFolder ) {
        try {
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyyMMdd");
            DateTimeFormatter dtf2 = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            String path = pathFolder + dtf.format(localDate);  //sửa lại
            Statement stmt = con.createStatement();
            String sql = "MATCH (r:Root)" +
                    "WHERE r.name = \"Root\"" +
                    "CREATE (t:Timestamp {key : \"" + dtf.format(localDate) + "\", value : \"" + dtf2.format(localDate) + "\"} )<-[:has]-(r)";

            stmt.execute(sql);
            System.out.println(path);
            File folder = new File(path);
            File[] folders = folder.listFiles();
            System.out.println(folders.length);

            for (File subfolder : folders) {
                String sql2 = "MATCH (t:Timestamp)" +
                        "WHERE t.value = \"" + dtf2.format(localDate) + "\"" +
                        "CREATE (n:Topic {name : \"" + subfolder.getName() + "\"} )<-[:appears]-(t)";

                stmt.execute(sql2);
                int i = 0;
                File[] files = subfolder.listFiles();
                for (File file : files) {
                    FileInputStream fstream = new FileInputStream(file);
                    DataInputStream in = new DataInputStream(fstream);
                    BufferedReader br = new BufferedReader(new InputStreamReader(in));
                    String strLine;
                    java.util.ArrayList<String> list = new java.util.ArrayList<String>();

                    while ((strLine = br.readLine()) != null) {
                        list.add(strLine);
                    }
                    String filePath = file.getPath();
                    filePath = filePath.replace("\\", "\\\\");   //-> path = C:\\
                    String sql3 = "MATCH (t:Topic)" + "WHERE t.name = \"" + subfolder.getName() + "\" "
                            + "MATCH (n:Timestamp)-[]-(t)" + "WHERE n.value = \"" + dtf2.format(localDate) + "\" "
                            + "CREATE (p:Paper {title: \"" + list.get(0) + "\", path: \"" + filePath + "\"}) <-[:written_in]-(t)";
                    stmt.execute(sql3);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public Map<String, List<String>> getListKeywordInTopic(String topic,int limit){
        List<String> keyword = new ArrayList<>();
        Map<String, List<String>> array = new HashedMap();
        try{
            Statement stmt = con.createStatement();
            String getKeyword = "MATCH (topic:Topic)-[]-(keyword:KeyWord) where topic.name = \""+ topic +"\" return keyword limit " + limit;

            ResultSet keywordList = stmt.executeQuery(getKeyword);
            while (keywordList.next()) {
                keyword.add(keywordList.getString("keyword"));
            }

            System.out.println(keyword.toString());

            for(String word: keyword){
                String getTimeline = "MATCH (time:Timestamp)-[]-(topic:Topic)-[]-(k:KeyWord) WHERE topic.name = \""+ topic +"\" AND k.value = \""+ word +"\" RETURN time AS timeline ORDER BY timeline asc";

                ResultSet getTimelineList = stmt.executeQuery(getTimeline);
                List<String> timelines = new ArrayList<String>();
                while (getTimelineList.next()) {
                    timelines.add(getTimelineList.getString("timeline"));
                }
                System.out.println(timelines.toString());
                array.put(word, timelines);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return array;
    }

    public static void main(String... args) {
        MTree mTree = new MTree();
        int sumDays=1; //sua lai
        LocalDate localDate = LocalDate.of(2017, 9, 22);  //sửa lại
//        String path = "E:\\workspace\\ThesisCode\\Data_Crawler\\";
        String path = "C:\\Users\\Bean\\Downloads\\de.vogella.rss-V5\\de.vogella.rss - V5\\Data\\";
        mTree.createTree(localDate, sumDays, path);
//        mTree.insertBranch(localDate, path);
    }
}
