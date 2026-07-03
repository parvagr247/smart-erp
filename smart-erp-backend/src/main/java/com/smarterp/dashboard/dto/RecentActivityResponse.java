package com.smarterp.dashboard.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecentActivityResponse {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActivityItem {
        private String type; // e.g. LEDGER, PARTNER, STOCK_ITEM, COMPANY
        private String title;
        private String details;
        private LocalDateTime timestamp;
    }

    private List<ActivityItem> activities;
}
