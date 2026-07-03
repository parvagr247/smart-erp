package com.smarterp.common.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    @GetMapping("/")
    public String home() {
        return "Welcome to SmartERP";
    }

    @GetMapping("/health")
    public String health() {
        return "Application Running Successfully";
    }
}

