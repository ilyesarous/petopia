package tn.esprit.petopia_backend.services.adoptions;


import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.adoptions.Adoption;
import tn.esprit.petopia_backend.entities.adoptions.AdoptionCertificate;
import tn.esprit.petopia_backend.entities.adoptions.AdoptionStatus;
import tn.esprit.petopia_backend.repositories.adoptions.AdoptionCertificateRepository;
import tn.esprit.petopia_backend.repositories.adoptions.AdoptionRepository;
import tn.esprit.petopia_backend.services.adoptions.IAdoptionCertificateService;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdoptionCertificateServiceImpl implements IAdoptionCertificateService {

    private final AdoptionCertificateRepository certificateRepository;
    private final AdoptionRepository adoptionRepository;
    public AdoptionCertificateServiceImpl(AdoptionCertificateRepository certificateRepository,AdoptionRepository adoptionRepository) {
        this.certificateRepository = certificateRepository;
        this.adoptionRepository = adoptionRepository;
    }
    @Override
    @Transactional
    public AdoptionCertificate createCertificateFromAdoption(Integer adoptionId, String shelterSignature) {

        Adoption adoption = adoptionRepository.findById(adoptionId)
                .orElseThrow(() -> new RuntimeException("Adoption not found"));

        if (adoption.getStatus() != AdoptionStatus.APPROVED) {
            throw new RuntimeException("Cannot create certificate: Adoption not approved.");
        }

        AdoptionCertificate certificate = new AdoptionCertificate();
        certificate.setPet(adoption.getPet());
        certificate.setUser(adoption.getRequester());
        certificate.setShelter(adoption.getShelter());
        certificate.setShelter_signature(shelterSignature);
        certificate.setIssued_date(LocalDateTime.now());
        certificate.setUser_signature(null);

        return certificateRepository.save(certificate);
    }


    @Override
    @Transactional
    public AdoptionCertificate userSignCertificate(Integer certificateId, String userSignature) {

        AdoptionCertificate existingCertificate = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new RuntimeException("Certificate not found"));

        if (existingCertificate.getUser_signature() != null) {
            throw new RuntimeException("Certificate already signed by user.");
        }

        existingCertificate.setUser_signature(userSignature);

        return certificateRepository.save(existingCertificate);
    }

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
}

