package tn.esprit.petopia_backend.services.adoptions;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.adoptions.AdoptionCertificate;

import java.io.ByteArrayOutputStream;
import java.util.Base64;

@Service
public class CertificatePdfGenerator {

    public byte[] generateCertificatePdf(AdoptionCertificate cert) throws Exception {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate(), 50, 50, 70, 50); // Increased top margin
        PdfWriter writer = PdfWriter.getInstance(document, outputStream);
        document.open();

        PdfContentByte canvas = writer.getDirectContent();

        float width = PageSize.A4.rotate().getWidth();
        float height = PageSize.A4.rotate().getHeight();
        float radius = 15f;

        canvas.setColorFill(new BaseColor(255, 97, 124));
        for (float x = 0; x < width; x += radius * 2) {
            canvas.circle(x, height - radius, radius);
            canvas.circle(x, radius, radius);
        }
        for (float y = 0; y < height; y += radius * 2) {
            canvas.circle(radius, y, radius);
            canvas.circle(width - radius, y, radius);
        }
        canvas.fill();

        Font titleFont = new Font(Font.FontFamily.HELVETICA, 30, Font.BOLD, new BaseColor(248, 49, 130));
        Font subTitleFont = new Font(Font.FontFamily.HELVETICA, 16, Font.BOLD);
        Font nameFont = new Font(Font.FontFamily.HELVETICA, 22, Font.BOLD, new BaseColor(248, 49, 130));
        Font italicFont = new Font(Font.FontFamily.HELVETICA, 13, Font.ITALIC, BaseColor.GRAY);
        Font regularFont = new Font(Font.FontFamily.HELVETICA, 14);

        // Title with extra spacing
        Paragraph title = centeredParagraph("CERTIFICATE OF ADOPTION", titleFont);
        title.setSpacingAfter(40f); // Increased space after title
        document.add(title);

        // Main content with increased spacing
        document.add(centeredParagraph("This is to certify that", subTitleFont));

        Paragraph userName = centeredParagraph(cert.getUser().getName(), nameFont);
        userName.setSpacingAfter(10f); // Increased space
        document.add(userName);

        document.add(centeredParagraph("has officially adopted", subTitleFont));

        Paragraph petName = centeredParagraph(cert.getPet().getPetName(), nameFont);
        petName.setSpacingAfter(10f); // Increased space
        document.add(petName);

        Paragraph promise = centeredParagraph("Promising to give a lifetime full of love, care, fun & happiness", italicFont);
        promise.setSpacingAfter(30f); // Increased space
        document.add(promise);

        // Signatures table with improved spacing
        PdfPTable signaturesTable = new PdfPTable(2);
        signaturesTable.setWidthPercentage(90); // Slightly narrower for better margins
        signaturesTable.setWidths(new float[]{1f, 1f});
        signaturesTable.setSpacingBefore(10f); // Space above table
        signaturesTable.setSpacingAfter(10f); // Space below table

        PdfPCell shelterCell = new PdfPCell();
        shelterCell.setBorder(Rectangle.NO_BORDER);
        shelterCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        shelterCell.setPaddingLeft(60f); // Left padding
        shelterCell.setPaddingRight(50f);
        Paragraph shelterName = new Paragraph(cert.getShelter().getShelter_name(), subTitleFont);
        shelterCell.addElement(shelterName);

        Paragraph shelterLabel = new Paragraph("Shelter Signature:", regularFont);
        shelterCell.addElement(shelterLabel);

        if (cert.getShelter_signature() != null) {
            Image shelterSig = Image.getInstance(Base64.getDecoder().decode(cert.getShelter_signature()));
            shelterSig.scaleToFit(120, 60);
            shelterSig.setAlignment(Image.ALIGN_LEFT);
            shelterCell.addElement(shelterSig);
        }

        PdfPCell userCell = new PdfPCell();
        userCell.setBorder(Rectangle.NO_BORDER);
        userCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        shelterCell.setPaddingLeft(60f); // Left padding


        Paragraph userNameSig = new Paragraph(cert.getUser().getName(), subTitleFont);
        userCell.addElement(userNameSig);

        Paragraph userLabel = new Paragraph("Adopter Signature:", regularFont);
        userCell.addElement(userLabel);

        if (cert.getUser_signature() != null) {
            Image userSig = Image.getInstance(Base64.getDecoder().decode(cert.getUser_signature()));
            userSig.scaleToFit(120, 60);
            userCell.addElement(userSig);
        }

        signaturesTable.addCell(shelterCell);
        signaturesTable.addCell(userCell);

        document.add(signaturesTable);

        // Date with proper spacing
        Paragraph date = new Paragraph("Issued on: " + cert.getIssued_date().toLocalDate(), regularFont);
        date.setAlignment(Element.ALIGN_CENTER);
        document.add(date);

        document.close();
        return outputStream.toByteArray();
    }

    private Paragraph centeredParagraph(String text, Font font) {
        Paragraph p = new Paragraph(text, font);
        p.setAlignment(Element.ALIGN_CENTER);
        p.setSpacingAfter(15f); // Default spacing between elements
        return p;
    }
}