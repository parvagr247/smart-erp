package com.smarterp.common.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class PdfExportService {

    public byte[] generateInvoicePdf(String companyName, String invoiceNo, LocalDate date, String customerName, 
                                     List<InvoiceItem> items, BigDecimal taxableAmount, BigDecimal taxAmount, BigDecimal totalAmount) {
        Document document = new Document(PageSize.A4, 36, 36, 54, 36);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // 1. Title & Header
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.BLACK);
            Paragraph title = new Paragraph(companyName, titleFont);
            title.setAlignment(Element.ALIGN_LEFT);
            document.add(title);

            Font subFont = FontFactory.getFont(FontFactory.HELVETICA, 10, BaseColor.GRAY);
            Paragraph subtitle = new Paragraph("Tax Invoice | Invoice No: " + invoiceNo + " | Date: " + date.toString(), subFont);
            subtitle.setAlignment(Element.ALIGN_LEFT);
            subtitle.setSpacingAfter(20);
            document.add(subtitle);

            // 2. Billing details
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, BaseColor.BLACK);
            Font regularFont = FontFactory.getFont(FontFactory.HELVETICA, 11, BaseColor.BLACK);
            
            Paragraph billTo = new Paragraph("Bill To:", boldFont);
            Paragraph customer = new Paragraph(customerName, regularFont);
            customer.setSpacingAfter(20);
            document.add(billTo);
            document.add(customer);

            // 3. Items table
            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{4f, 1f, 1.5f, 1.5f, 2f});

            // Table Headers
            String[] headers = {"Item Description", "Qty", "Rate (₹)", "GST (%)", "Total (₹)"};
            for (String h : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(h, boldFont));
                cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                cell.setPadding(6);
                table.addCell(cell);
            }

            for (InvoiceItem item : items) {
                table.addCell(new PdfPCell(new Phrase(item.description, regularFont)));
                table.addCell(new PdfPCell(new Phrase(String.valueOf(item.qty), regularFont)));
                table.addCell(new PdfPCell(new Phrase(String.format("%.2f", item.rate), regularFont)));
                table.addCell(new PdfPCell(new Phrase(String.format("%.1f", item.gstRate) + "%", regularFont)));
                table.addCell(new PdfPCell(new Phrase(String.format("%.2f", item.total), regularFont)));
            }

            table.setSpacingAfter(20);
            document.add(table);

            // 4. Summaries
            Paragraph taxParagraph = new Paragraph("Taxable Amount: ₹" + String.format("%.2f", taxableAmount), regularFont);
            taxParagraph.setAlignment(Element.ALIGN_RIGHT);
            Paragraph gstParagraph = new Paragraph("GST Amount: ₹" + String.format("%.2f", taxAmount), regularFont);
            gstParagraph.setAlignment(Element.ALIGN_RIGHT);
            Paragraph grandTotalParagraph = new Paragraph("Grand Total: ₹" + String.format("%.2f", totalAmount), boldFont);
            grandTotalParagraph.setAlignment(Element.ALIGN_RIGHT);

            document.add(taxParagraph);
            document.add(gstParagraph);
            document.add(grandTotalParagraph);

            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }

        return out.toByteArray();
    }

    public static class InvoiceItem {
        public String description;
        public int qty;
        public BigDecimal rate;
        public BigDecimal gstRate;
        public BigDecimal total;

        public InvoiceItem(String description, int qty, BigDecimal rate, BigDecimal gstRate, BigDecimal total) {
            this.description = description;
            this.qty = qty;
            this.rate = rate;
            this.gstRate = gstRate;
            this.total = total;
        }
    }
}
