package tn.esprit.petopia_backend.controller.adoptions;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.dto.PKISignatureRequest;
import tn.esprit.petopia_backend.entities.adoptions.AdoptionCertificate;
import tn.esprit.petopia_backend.repositories.adoptions.AdoptionCertificateRepository;
import tn.esprit.petopia_backend.services.adoptions.CertificatePdfGenerator;
import tn.esprit.petopia_backend.services.adoptions.IAdoptionCertificateService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/adoptionCertificates")
public class AdoptionCertificateController {
    private final IAdoptionCertificateService certificateService;
    private final CertificatePdfGenerator certificatePdfGenerator;
    private final AdoptionCertificateRepository certificateRepository;


    public AdoptionCertificateController(IAdoptionCertificateService certificateService,CertificatePdfGenerator certificatePdfGenerator,AdoptionCertificateRepository certificateRepository) {
        this.certificateService = certificateService;
        this.certificatePdfGenerator=certificatePdfGenerator;
        this.certificateRepository=certificateRepository;
    }

    @PostMapping("/addAdoptionCertificates/{adoptionId}")
    @PreAuthorize("hasAuthority('ROLE_SHELTER')")
    public ResponseEntity<?> createCertificate(
            @PathVariable Integer adoptionId,
            @RequestBody Map<String, Integer> payload) {

        Integer petId = payload.get("pet_id_pet");
        Integer shelterId = payload.get("shelter_id_shelter");
        Integer userId = payload.get("user_id_user");

        AdoptionCertificate createdCertificate = certificateService
                .createCertificateFromAdoption(adoptionId, petId, shelterId, userId);

        if (createdCertificate == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to create certificate"));
        }

        return ResponseEntity.ok(createdCertificate);
    }

    @PutMapping("/shelterSignCertificate/{certificateId}")
    @PreAuthorize("hasAuthority('ROLE_SHELTER')")
    public ResponseEntity<AdoptionCertificate> shelterSignCertificate(
            @PathVariable Integer certificateId,
            @RequestBody Map<String, String> signatureRequest) {

        String shelterSignature = signatureRequest.get("shelter_signature");

        AdoptionCertificate updatedCertificate = certificateService.shelterSignCertificate(certificateId, shelterSignature);
        return ResponseEntity.ok(updatedCertificate);
    }



    @PutMapping("/userSignCertificate/{certificateId}")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<AdoptionCertificate> userSignCertificate(
            @PathVariable Integer certificateId,
            @RequestBody Map<String, String> signatureRequest) {

        String userSignature = signatureRequest.get("user_signature");

        AdoptionCertificate updatedCertificate = certificateService
                .userSignCertificate(certificateId, userSignature);

        return ResponseEntity.ok(updatedCertificate);
    }

    @DeleteMapping("/deleteAdoptionCertificates/{id}")
    @PreAuthorize("hasAuthority('ROLE_SHELTER')")
    public ResponseEntity<Void> deleteCertificate(@PathVariable Integer id) {
        certificateService.deleteCertificate(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/getAdoptionCertificate/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_SHELTER','ROLE_USER')")
    public ResponseEntity<AdoptionCertificate> getCertificateById(@PathVariable Integer id) {
        return ResponseEntity.ok(certificateService.getCertificateById(id));
    }

    @GetMapping("/getALLAdoptionCertificateS")
    @PreAuthorize("hasAnyAuthority('ROLE_SHELTER')")
    public ResponseEntity<List<AdoptionCertificate>> getAllCertificates() {
        return ResponseEntity.ok(certificateService.getAllCertificates());
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<List<AdoptionCertificate>> getCertificatesByUserId(@PathVariable Integer userId) {
        return ResponseEntity.ok(certificateService.getCertificatesByUserId(userId));
    }

    @GetMapping("/pet/{petId}")
    @PreAuthorize("hasAnyAuthority('ROLE_SHELTER','ROLE_USER')")
    public ResponseEntity<List<AdoptionCertificate>> getCertificatesByPetId(@PathVariable Integer petId) {
        return ResponseEntity.ok(certificateService.getCertificatesByPetId(petId));
    }

    @GetMapping("/shelter/{shelterId}")
    @PreAuthorize("hasAuthority('ROLE_SHELTER')")
    public ResponseEntity<List<AdoptionCertificate>> getCertificatesByShelterId(@PathVariable Integer shelterId) {
        return ResponseEntity.ok(certificateService.getCertificatesByShelterId(shelterId));
    }

    @GetMapping("/certificate/download/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_USER','ROLE_SHELTER')")
    public ResponseEntity<byte[]> downloadCertificate(@PathVariable Integer id) {
        byte[] pdfBytes = certificateService.generateCertificatePdf(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "adoption_certificate.pdf");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
    @GetMapping("/certificates/{id}/pdf")
    public ResponseEntity<byte[]> getCertificatePdf(@PathVariable Integer id) throws Exception {
        AdoptionCertificate cert = certificateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certificate not found"));

        byte[] pdf = certificatePdfGenerator.generateCertificatePdf(cert);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("inline", "certificate.pdf"); // view inline

        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }
    @GetMapping("/adoption/{adoptionId}")
    @PreAuthorize("hasAnyAuthority('ROLE_SHELTER','ROLE_USER')")
    public ResponseEntity<AdoptionCertificate> getCertificateByAdoptionId(@PathVariable Integer adoptionId) {
        return certificateService.getCertificateByAdoptionId(adoptionId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/shelterSignWithPKI")
    @PreAuthorize("hasAuthority('ROLE_SHELTER')")
    public ResponseEntity<?> shelterSignWithPKI(@RequestBody PKISignatureRequest request) {
        boolean isValid = certificateService.verifyAndStorePKISignature(request);
        if (!isValid) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid signature");
        }
        return ResponseEntity.ok("Signature verified and stored.");
    }
    @PostMapping("/userSignWithPKI")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<?> userSignWithPKI(@RequestBody PKISignatureRequest request) {
        boolean isValid = certificateService.verifyAndStoreUserPKISignature(request);
        if (!isValid) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid digital signature");
        }
        return ResponseEntity.ok("User signature verified and saved.");
    }


}
