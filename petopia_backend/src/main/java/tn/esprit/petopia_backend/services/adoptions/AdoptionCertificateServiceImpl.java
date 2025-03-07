package tn.esprit.petopia_backend.services.adoptions;


import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.adoptions.AdoptionCertificate;
import tn.esprit.petopia_backend.repositories.adoptions.AdoptionCertificateRepository;
import tn.esprit.petopia_backend.services.adoptions.IAdoptionCertificateService;
import java.util.List;

@Service
public class AdoptionCertificateServiceImpl implements IAdoptionCertificateService {

    private final AdoptionCertificateRepository certificateRepository;

    public AdoptionCertificateServiceImpl(AdoptionCertificateRepository certificateRepository) {
        this.certificateRepository = certificateRepository;
    }

    @Override
    public AdoptionCertificate createCertificate(AdoptionCertificate certificate) {
        return certificateRepository.save(certificate);
    }

    @Override
    public AdoptionCertificate updateCertificate(AdoptionCertificate certificate) {
        return certificateRepository.save(certificate);
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

