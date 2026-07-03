package com.smarterp.common.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.*;

@RestController
public class TestController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/")
    public String home() {
        return "Welcome to SmartERP";
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Map<String, Object>> columns = jdbcTemplate.queryForList(
                "SELECT column_name, data_type, is_nullable FROM information_schema.columns " +
                "WHERE table_schema = 'accounting' AND table_name = 'ledger_groups' " +
                "ORDER BY column_name"
            );
            
            List<Map<String, Object>> tables = jdbcTemplate.queryForList(
                "SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema IN ('accounting', 'app_auth', 'administration', 'inventory', 'partner', 'purchase', 'common')"
            );
            
            List<Map<String, Object>> tableReport = new ArrayList<>();
            for (Map<String, Object> row : tables) {
                String schema = (String) row.get("table_schema");
                String table = (String) row.get("table_name");
                long count = 0;
                try {
                    count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM " + schema + "." + table, Long.class);
                } catch (Exception e) {
                    // Ignore count error
                }
                Map<String, Object> tr = new HashMap<>();
                tr.put("schema", schema);
                tr.put("table", table);
                tr.put("rows", count);
                tableReport.add(tr);
            }
            
            result.put("success", true);
            result.put("audit_columns_found", columns);
            result.put("tables", tableReport);
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
        }
        return result;
    }
}

