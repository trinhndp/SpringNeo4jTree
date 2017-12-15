package vn.uit.aep.model;

import vn.uit.aep.model.helper.ValueComparator;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by trinhndp on 13-Dec-17.
 */
public class TermFrequency {

    private Connection con;
    private String user = "neo4j";
    private String pass = "1234567";

    private Map<String, double[]> termFrequencyInTopic;

    private void establishConnection() {
        // Connect
        try {
            con = DriverManager.getConnection("jdbc:neo4j:bolt://localhost", user, pass);
            if(con.isClosed()) System.out.println(true);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private void endConnection() {
        try {
            con.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public TermFrequency() {
    }

    private Map<String, Double> getSetOfKeywordsInPaper(int id) {
        Map<String, Double> setOfKeywords = new HashMap<>();
        try(Connection con = DriverManager.getConnection("jdbc:neo4j:bolt://localhost", user, pass)) {
//            // Querying
            Statement stmt = con.createStatement();

            ResultSet topicRes = stmt.executeQuery("MATCH (k:KeyWord)-[r:presents]-(p:Paper) WHERE id(p) = " + id + " return k.value, r.weight");
            while (topicRes.next()) {
                String s = topicRes.getString("k.value");
                Double d = Double.parseDouble(topicRes.getString("r.weight"));
                setOfKeywords.put(s, d);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } catch (NullPointerException e) {
            System.out.println(" No connection.");
        }
//        System.out.println("Set of keywords in paper " + id);
//        System.out.println(setOfKeywords);
        return setOfKeywords;
    }

    private List<Map<String, Double>> getAllPapersInACluster(List<Integer> paperIds) {
        List<Map<String, Double>> setOfPapersInCluster = new ArrayList<>();
        for (int id : paperIds) {
            Map<String, Double> setOfKeywordsOfAPaper = getSetOfKeywordsInPaper(id);
            setOfPapersInCluster.add(setOfKeywordsOfAPaper);
        }
        System.out.println("All papers in cluster");
        System.out.println(setOfPapersInCluster);
        return setOfPapersInCluster;
    }

    private double computeIDF(List<Map<String, Double>> setOfPapersInCluster, String term) {
        int number = 0;
        for (int i = 0; i < setOfPapersInCluster.size(); i++) {
            Map<String, Double> paper = setOfPapersInCluster.get(i);
            if (paper.containsKey(term))
                number++;
        }
        return Math.log(setOfPapersInCluster.size() / number);
    }

    public Map<Integer, Map<String, Double>> getKeywordsOfCluster(List<Integer> paperIds) {
        Map<Integer, Map<String, Double>> setOfKeywords = new HashMap<>();
        List<Map<String, Double>> aCluster = getAllPapersInACluster(paperIds);
        for (int i = 0; i < aCluster.size(); i++) {
            Map<String, Double> paper = aCluster.get(i);
            Map<String, Double> keyWordsInOrder = new HashMap<>();
            for (String key : paper.keySet()) {
                double prob = computeIDF(aCluster, key);
                double tfIdf = prob * paper.get(key);
                keyWordsInOrder.put(key, tfIdf);
            }

            keyWordsInOrder = ValueComparator.sortByValueAndGet10(keyWordsInOrder);
            setOfKeywords.put(i, keyWordsInOrder);
        }
        System.out.println("TF-IDF of cluster and get 10 highest words:");
        System.out.println(setOfKeywords);
        setOfKeywords = convertTo10ScoreSystem(setOfKeywords);
        System.out.println("After entering 10 score system:");
        System.out.println(setOfKeywords);
        return setOfKeywords;
    }

    private Map<Integer, Map<String, Double>> convertTo10ScoreSystem(Map<Integer, Map<String, Double>> list){
        Map<Integer, Map<String, Double>> scoreList = new HashMap<>();
        for (int i = 0; i < list.size(); i++) {
            Map<String, Double> paper = list.get(i);
            Map<String, Double> scoredKeyword = new HashMap<>();
            double score = 10;
            for (String key : paper.keySet()) {
                scoredKeyword.put(key, score--);
            }
            scoreList.put(i, ValueComparator.sortByValueAndGet10(scoredKeyword));
        }
        return scoreList;
    }

    public Map<String, Double>  getTopKeywordsOfACluster(Map<Integer, Map<String, Double>> papers, int limit) {
        Map<String, Double> frequency = new HashMap<>();
        for (int i = 0; i < papers.size(); i++) {
            Map<String, Double> list = papers.get(i);
            for(String term : list.keySet()){
                if(frequency.containsKey(term))
                    frequency.replace(term, frequency.get(term) + (10 - list.get(term)));
                else frequency.put(term, list.get(term));
            }
        }
        frequency = ValueComparator.sortByValueAndGet20(frequency);
        System.out.println("size of keywords list: " + frequency.size());
        System.out.println(frequency);
        return frequency;
    }

    public void getTopKeywordsOfEveryCluster(Map<Integer, List<Integer>> clusters){
        Map<Integer, Map<String, Double>> result = new HashMap<>();
        for(int i : clusters.keySet()) {
            List<Integer> ids = clusters.get(i);
            Map<Integer, Map<String, Double>> temp = getKeywordsOfCluster(ids);
            result.put(i, getTopKeywordsOfACluster(temp, 10));
        }
        System.out.println(result);
    }

    public static void main(String args[]) {
        TermFrequency termFrequency = new TermFrequency();
        List<Integer> ids1 = new ArrayList<>();
        List<Integer> ids2 = new ArrayList<>();
        ids1.add(22516);
        ids1.add(22517);
        ids1.add(22518);
        ids1.add(22519);
        ids1.add(22520);
        ids2.add(22521);
        ids2.add(22522);
        ids2.add(22523);
        ids2.add(22524);
        ids2.add(22525);
        ids2.add(22526);
        ids2.add(22527);
        ids1.add(22528);
        ids1.add(22529);
        Map<Integer, List<Integer>> clusters = new HashMap<>();
        clusters.put(1, ids1);
        clusters.put(2, ids2);

        termFrequency.getTopKeywordsOfEveryCluster(clusters);
    }
}
