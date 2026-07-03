package com.smarterp.inventory.master.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PriceListDto {
    private String name;
    private String priceType;
    private BigDecimal price;
    private LocalDateTime effectiveFrom;
    private LocalDateTime effectiveTo;
}
