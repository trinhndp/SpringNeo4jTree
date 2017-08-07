package vn.uit.aep.model;

import java.io.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * Created by trinhndp on 07-Aug-17.
 */
public class MTree {
    private Connection con;

    MTree(){
        try {
            con = DriverManager.getConnection(
                    "jdbc:neo4j:bolt://localhost/?user=neo4j,password=1234567,scheme=basic");  //sửa lại
        } catch (SQLException e) {
            e.printStackTrace();
        }

    }

    public void createTree(LocalDate localDate, int sumDays){

        try {
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyyMMdd");
            DateTimeFormatter dtf2 = DateTimeFormatter.ofPattern("dd/MM/yyyy");


            Statement stmt = con.createStatement();
            stmt.execute("CREATE (n:Root {name : \"Topic Evolution\"})");


            for (int d = 0; d < sumDays; d++) {
                LocalDate nextDate = localDate.plusDays(d);
                String path = "E:\\workspace\\ThesisCode\\Data_Crawler\\" + dtf.format(nextDate);  //sửa lại

                String sql = "MATCH (r:Root)" +
                        "WHERE r.name = \"Topic Evolution\"" +
                        "CREATE (t:Timestamp {value : \"" + dtf2.format(nextDate) + "\"} )<-[:has]-(r)";

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

    public void insertBranch(LocalDate localDate ) {
        try {
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyyMMdd");
            DateTimeFormatter dtf2 = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            String path = "D:\\Thesis\\Data\\Result\\" + dtf.format(localDate);  //sửa lại
            Statement stmt = con.createStatement();
            String sql = "MATCH (r:Root)" +
                    "WHERE r.name = \"Topic Evolution\"" +
                    "CREATE (t:Timestamp {value : \"" + dtf2.format(localDate) + "\"} )<-[:has]-(r)";

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

    public static void main(String... args) {
        MTree mTree = new MTree();
        int sumDays=16; //sua lai
        LocalDate localDate = LocalDate.of(2017, 07, 22);  //sửa lại
        mTree.createTree(localDate, sumDays);

//        mTree.insertBranch(localDate);
    }
}
