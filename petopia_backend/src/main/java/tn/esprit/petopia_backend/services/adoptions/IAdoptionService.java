package tn.esprit.petopia_backend.services.adoptions;

import tn.esprit.petopia_backend.entities.adoptions.Adoption;
import tn.esprit.petopia_backend.entities.adoptions.AdoptionStatus;
import java.util.List;

public interface IAdoptionService {
    Adoption createAdoption(Adoption adoption, Integer userId);
    Adoption updateAdoption(Integer id, Adoption adoption);
    void deleteAdoption(Integer id);
    Adoption getAdoptionById(Integer id);
    List<Adoption> getAllAdoptions();
    List<Adoption> getAdoptionsByRequesterId(Integer requesterId);
    List<Adoption> getAdoptionsByShelterId(Integer shelterId);
    List<Adoption> getAdoptionsByPetId(Integer petId);
    List<Adoption> getAdoptionsByStatus(AdoptionStatus status);

}
