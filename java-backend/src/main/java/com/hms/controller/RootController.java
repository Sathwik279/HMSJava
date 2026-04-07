package com.hms.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/")
    public Map<String, String> root() {
        return Map.of("message", "HMS Backend is running on port 8123", "status", "UP");
    }

    @GetMapping("/api")
    public Map<String, String> apiRoot() {
        return Map.of("message", "Welcome to HMS API", "status", "UP");
    }
}
