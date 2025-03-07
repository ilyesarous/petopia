package tn.esprit.petopia_backend.services.adoptions;


import tn.esprit.petopia_backend.entities.adoptions.AdoptionCertificate;
import java.util.List;

public interface IAdoptionCertificateService {
    AdoptionCertificate createCertificate(AdoptionCertificate certificate);
    AdoptionCertificate updateCertificate(AdoptionCertificate certificate);
    void deleteCertificate(Integer id);
    AdoptionCertificate getCertificateById(Integer id);
    List<AdoptionCertificate> getAllCertificates();
    List<AdoptionCertificate> getCertificatesByUserId(Integer userId);
    List<AdoptionCertificate> getCertificatesByPetId(Integer petId);
    List<AdoptionCertificate> getCertificatesByShelterId(Integer shelterId);
}
