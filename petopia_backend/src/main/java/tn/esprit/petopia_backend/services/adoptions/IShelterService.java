package tn.esprit.petopia_backend.services.adoptions;


import tn.esprit.petopia_backend.entities.adoptions.Shelter;
import java.util.List;

public interface IShelterService {
    Shelter createShelter(Shelter shelter);
    Shelter updateShelter(Shelter shelter);
    void deleteShelter(Integer id);
    Shelter getShelterById(Integer id);
    List<Shelter> getAllShelters();
    Shelter getShelterByUserId(Integer userId);
}
