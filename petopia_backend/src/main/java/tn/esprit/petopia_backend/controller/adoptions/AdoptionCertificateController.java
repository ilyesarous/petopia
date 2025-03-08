package tn.esprit.petopia_backend.controller.adoptions;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.adoptions.AdoptionCertificate;
import tn.esprit.petopia_backend.services.adoptions.IAdoptionCertificateService;
import java.util.List;

@RestController
@RequestMapping("/adoptionCertificates")
public class AdoptionCertificateController {

    private final IAdoptionCertificateService certificateService;

    public AdoptionCertificateController(IAdoptionCertificateService certificateService) {
        this.certificateService = certificateService;
    }

    @PostMapping("/addAdoptionCertificates")
    @PreAuthorize("hasAuthority('ROLE_SHELTER')")
    public ResponseEntity<AdoptionCertificate> createCertificate(@RequestBody AdoptionCertificate certificate) {
        return ResponseEntity.ok(certificateService.createCertificate(certificate));
    }

    @PutMapping("/updateAdoptionCertificates/{id}")
    @PreAuthorize("hasAuthority('ROLE_SHELTER')")
    public ResponseEntity<AdoptionCertificate> updateCertificate(@PathVariable Integer id, @RequestBody AdoptionCertificate certificate) {
        certificate.setId_certificate(id);
        return ResponseEntity.ok(certificateService.updateCertificate(certificate));
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
