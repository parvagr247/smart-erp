package com.smarterp.reports.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GstSummaryResponse {
    private BigDecimal inputCgst;
    private BigDecimal inputSgst;
    private BigDecimal inputIgst;
    private BigDecimal totalInputTax;

    private BigDecimal outputCgst;
    private BigDecimal outputSgst;
    private BigDecimal outputIgst;
    private BigDecimal totalOutputTax;

    private BigDecimal netCgstPayable;
    private BigDecimal netSgstPayable;
    private BigDecimal netIgstPayable;
    private BigDecimal netTotalPayable;
}
