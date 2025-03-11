package tn.esprit.petopia_backend.controller.adoptions;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.adoptions.AdoptionCertificate;
import tn.esprit.petopia_backend.services.adoptions.IAdoptionCertificateService;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/adoptionCertificates")
public class AdoptionCertificateController {

    private final IAdoptionCertificateService certificateService;

    public AdoptionCertificateController(IAdoptionCertificateService certificateService) {
        this.certificateService = certificateService;
    }

    @PostMapping("/addAdoptionCertificates/{adoptionId}")
    @PreAuthorize("hasAuthority('ROLE_SHELTER')")
    public ResponseEntity<?> createCertificate(
            @PathVariable Integer adoptionId,
            @RequestBody Map<String, String> signatureRequest) {

        String shelterSignature = signatureRequest.get("shelter_signature");

        AdoptionCertificate createdCertificate = certificateService
                .createCertificateFromAdoption(adoptionId, shelterSignature);

        if (createdCertificate == null) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "Adoption must be approved first."));
        }

        return ResponseEntity.ok(createdCertificate);
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
}
