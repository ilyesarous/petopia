package tn.esprit.petopia_backend.services.adoptions;


import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.dto.PKISignatureRequest;
import tn.esprit.petopia_backend.entities.adoptions.Adoption;
import tn.esprit.petopia_backend.entities.adoptions.AdoptionCertificate;
import tn.esprit.petopia_backend.entities.adoptions.AdoptionStatus;
import tn.esprit.petopia_backend.entities.adoptions.Shelter;
import tn.esprit.petopia_backend.entities.pet.Pet;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.repositories.adoptions.AdoptionCertificateRepository;
import tn.esprit.petopia_backend.repositories.adoptions.AdoptionRepository;
import tn.esprit.petopia_backend.services.adoptions.IAdoptionCertificateService;

import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.Signature;
import java.security.spec.X509EncodedKeySpec;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class AdoptionCertificateServiceImpl implements IAdoptionCertificateService {

    private final AdoptionCertificateRepository certificateRepository;
    private final AdoptionRepository adoptionRepository;
    private final CertificatePdfGenerator certificatePdfGenerator;

    public AdoptionCertificateServiceImpl(
            AdoptionCertificateRepository certificateRepository,
            AdoptionRepository adoptionRepository,
            CertificatePdfGenerator certificatePdfGenerator
    ) {
        this.certificateRepository = certificateRepository;
        this.adoptionRepository = adoptionRepository;
        this.certificatePdfGenerator = certificatePdfGenerator;
    }

    public AdoptionCertificate createCertificateFromAdoption(Integer adoptionId, Integer petId, Integer shelterId, Integer userId) {
        Adoption adoption = adoptionRepository.findById(adoptionId)
                .orElseThrow(() -> new RuntimeException("Adoption not found"));

        AdoptionCertificate certificate = new AdoptionCertificate();
        certificate.setAdoption(adoption);

        Pet pet = new Pet();
        pet.setIdPet(petId);
        certificate.setPet(pet);

        Shelter shelter = new Shelter();
        shelter.setId_shelter(shelterId);
        certificate.setShelter(shelter);

        User user = new User();
        user.setId_user(userId);
        certificate.setUser(user);

        certificate.setIssued_date(LocalDateTime.now());
        certificate.setShelter_signature(null); // force null explicitly
        certificate.setUser_signature(null);    // force null explicitly

        return certificateRepository.save(certificate);
    }



    @Override
    @Transactional
    public AdoptionCertificate userSignCertificate(Integer certificateId, String userSignature) {

        AdoptionCertificate certificate = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new RuntimeException("Certificate not found"));

        if (certificate.getUser_signature() != null) {
            throw new RuntimeException("User has already signed this certificate.");
        }

        certificate.setUser_signature(userSignature);

        return certificateRepository.save(certificate);
    }

    @Override
    public AdoptionCertificate shelterSignCertificate(Integer certificateId, String shelterSignature) {
        AdoptionCertificate certificate = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new RuntimeException("Certificate not found"));

        certificate.setShelter_signature(shelterSignature);

        return certificateRepository.save(certificate);    }

    @Override
    public void deleteCertificate(Integer id) {
        certificateRepository.deleteById(id);
    }

    @Override
    public AdoptionCertificate getCertificateById(Integer id) {
        return certificateRepository.findById(id).orElse(null);
    }

    @Override
    public List<AdoptionCertificate> getAllCertificates() {
        return certificateRepository.findAll();
    }

    @Override
    public List<AdoptionCertificate> getCertificatesByUserId(Integer userId) {
        return certificateRepository.findByUserId(userId);
    }

    @Override
    public List<AdoptionCertificate> getCertificatesByPetId(Integer petId) {
        return certificateRepository.findByPetId(petId);
    }

    @Override
    public List<AdoptionCertificate> getCertificatesByShelterId(Integer shelterId) {
        return certificateRepository.findByShelterId(shelterId);
    }
    @Override
    public byte[] generateCertificatePdf(Integer certificateId) {
        AdoptionCertificate cert = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new RuntimeException("Certificate not found"));

        try {
            return certificatePdfGenerator.generateCertificatePdf(cert);
        } catch (Exception e) {
            throw new RuntimeException("Error generating certificate PDF", e);
        }
    }
    @Override
    public Optional<AdoptionCertificate> getCertificateByAdoptionId(Integer adoptionId) {
        return certificateRepository.findByAdoptionId(adoptionId);
    }
    @Override
    public boolean verifyAndStorePKISignature(PKISignatureRequest req) {
        try {
            String payload = "certificateId:" + req.getCertificateId() + ";timestamp:" + req.getTimestamp();
            byte[] data = payload.getBytes(StandardCharsets.UTF_8);
            byte[] signature = Base64.getDecoder().decode(req.getBase64DigitalSignature());

            byte[] pubKeyBytes = Base64.getDecoder().decode(req.getBase64PublicKey());
            X509EncodedKeySpec keySpec = new X509EncodedKeySpec(pubKeyBytes);
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            PublicKey publicKey = keyFactory.generatePublic(keySpec);

            Signature sig = Signature.getInstance("SHA256withRSA");
            sig.initVerify(publicKey);
            sig.update(data);

            if (!sig.verify(signature)) {
                return false;
            }

            // Optionally store the image signature + digital proof
            AdoptionCertificate cert = certificateRepository.findById(req.getCertificateId())
                    .orElseThrow(() -> new RuntimeException("Certificate not found"));

            cert.setShelter_signature(req.getBase64SignatureImage());
            certificateRepository.save(cert);
            return true;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    @Override
    public boolean verifyAndStoreUserPKISignature(PKISignatureRequest req) {
        try {
            String payload = "certificateId:" + req.getCertificateId() + ";timestamp:" + req.getTimestamp();
            byte[] data = payload.getBytes(StandardCharsets.UTF_8);
            byte[] signature = Base64.getDecoder().decode(req.getBase64DigitalSignature());

            byte[] publicKeyBytes = Base64.getDecoder().decode(req.getBase64PublicKey());
            X509EncodedKeySpec keySpec = new X509EncodedKeySpec(publicKeyBytes);
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            PublicKey publicKey = keyFactory.generatePublic(keySpec);

            Signature sig = Signature.getInstance("SHA256withRSA");
            sig.initVerify(publicKey);
            sig.update(data);
            boolean isValid = sig.verify(signature);

            if (!isValid) return false;

            AdoptionCertificate certificate = certificateRepository.findById(req.getCertificateId())
                    .orElseThrow(() -> new RuntimeException("Certificate not found"));

            certificate.setUser_signature(req.getBase64SignatureImage()); // Store canvas image
            certificateRepository.save(certificate);

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}

