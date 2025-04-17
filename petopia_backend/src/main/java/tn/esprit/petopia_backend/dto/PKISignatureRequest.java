package tn.esprit.petopia_backend.dto;

import lombok.Data;

@Data
public class PKISignatureRequest {
    private String base64SignatureImage;
    private String base64DigitalSignature;
    private String base64PublicKey;
    private Integer certificateId;
    private String timestamp;
}