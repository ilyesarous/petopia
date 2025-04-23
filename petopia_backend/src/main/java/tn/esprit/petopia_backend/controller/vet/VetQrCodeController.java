package tn.esprit.petopia_backend.controller.vet;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/auth/api/vet/qrcode")
public class VetQrCodeController {

    private final QRCodeVetGenerator qrGenerator;

    public VetQrCodeController(QRCodeVetGenerator qrGenerator) {
        this.qrGenerator = qrGenerator;
    }

    @GetMapping(value = "/{vetId}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getQrCode(@PathVariable Integer vetId) {
        try {
            byte[] qrCode = qrGenerator.generateQRCode(vetId);
            return ResponseEntity.ok()
                    .header("Content-Disposition", "inline; filename=vet-qr-"+vetId+".png")
                    .body(qrCode);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(("Error generating QR code: " + e.getMessage()).getBytes());
        }
    }
}