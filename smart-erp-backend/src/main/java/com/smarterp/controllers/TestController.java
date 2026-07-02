package com.smarterp.controllers;

import org.springframework.web.bind.annotation.GetMapping;

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
