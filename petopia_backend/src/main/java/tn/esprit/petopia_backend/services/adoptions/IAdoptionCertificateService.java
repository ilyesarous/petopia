package tn.esprit.petopia_backend.services.adoptions;


import tn.esprit.petopia_backend.entities.adoptions.AdoptionCertificate;
import java.util.List;

public interface IAdoptionCertificateService {
    AdoptionCertificate createCertificateFromAdoption(Integer adoptionId, Integer petId, Integer shelterId, Integer userId);
    AdoptionCertificate userSignCertificate(Integer certificateId, String userSignature);
    AdoptionCertificate shelterSignCertificate(Integer certificateId, String shelterSignature);

    void deleteCertificate(Integer id);
    AdoptionCertificate getCertificateById(Integer id);
    List<AdoptionCertificate> getAllCertificates();
    List<AdoptionCertificate> getCertificatesByUserId(Integer userId);
    List<AdoptionCertificate> getCertificatesByPetId(Integer petId);
    List<AdoptionCertificate> getCertificatesByShelterId(Integer shelterId);
   byte[] generateCertificatePdf(Integer certificateId);
}
