package com.smarterp;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class SmartErpApplication {

	public static void main(String[] args) {
		SpringApplication.run(SmartErpApplication.class, args);
	}

	@Bean
	public CommandLineRunner dbCleanupRunner(JdbcTemplate jdbcTemplate) {
		return args -> {
			try {
				System.out.println("--- DB SCHEMA CLEANUP: REMOVING REDUNDANT NAME COLUMN ---");
				jdbcTemplate.execute("ALTER TABLE administration.companies DROP COLUMN IF EXISTS name");
				System.out.println("--- DB SCHEMA CLEANUP SUCCESSFUL ---");
			} catch (Exception e) {
				System.err.println("--- DB SCHEMA CLEANUP FAILED: " + e.getMessage() + " ---");
			}
		};
	}
}
