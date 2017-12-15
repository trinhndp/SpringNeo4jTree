package vn.uit.aep.controller;

import net.sf.javaml.clustering.Clusterer;
import net.sf.javaml.clustering.KMedoids;
import net.sf.javaml.core.Dataset;
import net.sf.javaml.core.DefaultDataset;
import net.sf.javaml.core.DenseInstance;
import net.sf.javaml.distance.EuclideanDistance;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import vn.uit.aep.model.Paper;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


/**
 * Created by trinhndp on 29-Jul-17.
 */
@Controller
public class HomeController {

    @RequestMapping("/")
    public String home() {
        return "home";
    }

    @RequestMapping(value = "/details", method = RequestMethod.POST)
    public ModelAndView getContentFile(HttpServletResponse response, HttpServletRequest request,
                                       @RequestParam("id") int id, @RequestParam("path") String pathFile) {
        ModelAndView model = new ModelAndView("home");
        Paper paper = new Paper();
        paper.readPaper(pathFile);
        model.addObject("id", id);
        model.addObject("titleFile", paper.getTitle());
        model.addObject("intro", paper.getShortDes());
        model.addObject("contentFile", paper.getContent());
        model.addObject("url", paper.getUrl());
        System.out.println(model);
        return model;
    }

    @RequestMapping(value = "/getPapers", method = RequestMethod.POST)
    public String getContentFile(HttpServletResponse response, HttpServletRequest request,
                                       @RequestParam("topic") String topicName) {
        System.out.println(topicName);
        return "home";
    }

    @RequestMapping(value = "/clustering", method = RequestMethod.POST)
    public ModelAndView clustering( @RequestParam(value = "arr") String arr) {
        ModelAndView model = new ModelAndView("home");
        System.out.println("Recieved");

        arr = arr.replace("[[", "["); //remove first [
        arr = arr.replace("]]", "]"); //remove last ]
        arr = arr.replace("],[", "]#["); // create the point to break
//        System.out.println(arr);
        System.out.println("Has step here again");
        String [] splitArr = arr.split("#");

         /* Load a dataset */
        Dataset data = new DefaultDataset();

        for (String str: splitArr) {
            str = str.substring(1, str.length()-2);
            str = str.replace("\"", "");
            String [] parts = str.split(",");
            double [] vector = new double[parts.length - 2];
            String name = parts[parts.length-1];
            for (int i = 0; i < vector.length; i++){
               vector[i] = java.lang.Double.parseDouble(parts[i]);
            }
            data.add(new DenseInstance(vector, name));
        }
      /*
          Create a new instance of the KMeans algorithm, with no options
          specified. By default this will generate 4 clusters.
         */
        Clusterer km = new KMedoids(6, 100, new EuclideanDistance());
        /*
          Cluster the data, it will be returned as an array of data sets, with
          each dataset representing a cluster
         */
        Dataset[] clusters = km.cluster(data);
        data = new DefaultDataset();
//
        System.out.println("=======================\nCluster count: " + clusters.length);
        int i = 0;
        String json = "{";
        for (Dataset temp : clusters) {
            i++;
            String papers = "[\"";
            System.out.println("Number of Elements in cluster " + i + " is: " + temp.size());
            for(int j = 0; j < temp.size(); j++){
                String paper = temp.get(j).classValue().toString();
                papers += paper;
                if((j+1) < temp.size()) papers += "\",\"";
                else papers += "\"]";
            }
            json += "\"" + i + "\":" + papers;

            if((i+1)<7) json += ",";
            else json += "}";
        }
        System.out.println(json);

        model.addObject("json", json);
        System.out.println(model);
        return model;
    }

    @RequestMapping(value = "/getTopKeywords", method = RequestMethod.POST)
    public void getTopKeywords(@RequestParam(value = "arr") String arr){
        System.out.println(arr);
    }
}
