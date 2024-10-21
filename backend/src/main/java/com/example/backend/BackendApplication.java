package com.example.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Collections;

@SpringBootApplication
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(BackendApplication.class);

        // Retrieve the PORT environment variable
        String port = System.getenv("PORT");
        if (port != null && !port.isEmpty()) {
            // Set the server port to the PORT environment variable
            app.setDefaultProperties(Collections.singletonMap("server.port", port));
        }

        app.run(args);
    }
}
