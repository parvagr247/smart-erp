package com.smarterp.dashboard.dto;

import lombok.*;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchResultResponse {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SearchHit {
        private UUID id;
        private String type; // LEDGER, PARTNER, STOCK_ITEM, COMPANY
        private String title;
        private String subtitle;
        private String path;
    }

    private List<SearchHit> hits;
}
