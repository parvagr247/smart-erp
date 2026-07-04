package com.smarterp;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
@EnableCaching
public class SmartErpApplication {

	public static void main(String[] args) {
		// Programmatically load .env variables before starting the Spring Context
		try {
			java.io.File envFile = new java.io.File(".env");
			if (envFile.exists()) {
				java.nio.file.Files.lines(envFile.toPath())
					.map(String::trim)
					.filter(line -> !line.isEmpty() && !line.startsWith("#"))
					.forEach(line -> {
						int delimiterIndex = line.indexOf('=');
						if (delimiterIndex > 0) {
							String key = line.substring(0, delimiterIndex).trim();
							String value = line.substring(delimiterIndex + 1).trim();
							if (value.startsWith("\"") && value.endsWith("\"")) {
								value = value.substring(1, value.length() - 1);
							}
							if (value.startsWith("'") && value.endsWith("'")) {
								value = value.substring(1, value.length() - 1);
							}
							
							// Safety check: if running with existing Supabase IDE environment configs,
							// do not let the local .env defaults override them.
							boolean isDbKey = key.equals("DATABASE_URL") || key.equals("DATABASE_USERNAME") || key.equals("DATABASE_PASSWORD");
							boolean hasSupabase = System.getenv("SUPABASE-URL") != null || System.getProperty("SUPABASE-URL") != null;
							if (isDbKey && hasSupabase) {
								return;
							}

							if (System.getProperty(key) == null && System.getenv(key) == null) {
								System.setProperty(key, value);
							}
						}
					});
				System.out.println("Loaded environment variables from local .env file.");
			}
		} catch (Exception e) {
			System.err.println("Could not load local .env file: " + e.getMessage());
		}

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
