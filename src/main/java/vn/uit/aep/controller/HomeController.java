package vn.uit.aep.controller;

import org.bouncycastle.math.raw.Mod;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import vn.uit.aep.model.Paper;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.*;
import java.util.ArrayList;
import java.util.Map;

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
}
