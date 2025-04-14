package tn.esprit.petopia_backend.controller.vet;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Component;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;

@Component
public class QRCodeVetGenerator {

    private static final int QR_WIDTH = 400;
    private static final int QR_HEIGHT = 400;

    public byte[] generateQRCode(Integer vetId) throws Exception {
        // 1. Générer le QR code de base
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(
                "http://localhost:4200/vet/RatingVet/" + vetId,
                BarcodeFormat.QR_CODE,
                QR_WIDTH,
                QR_HEIGHT
        );

        // 2. Convertir en image
        BufferedImage qrImage = MatrixToImageWriter.toBufferedImage(bitMatrix);

        // 3. Convertir en byte array
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        javax.imageio.ImageIO.write(qrImage, "png", baos);
        return baos.toByteArray();
    }
}