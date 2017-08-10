package vn.uit.aep.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
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
}
