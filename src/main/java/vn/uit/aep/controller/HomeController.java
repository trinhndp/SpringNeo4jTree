package vn.uit.aep.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by trinhndp on 29-Jul-17.
 */
@Controller
public class HomeController {

    @RequestMapping("/")
    String home(){
        return "home";
    }
}
