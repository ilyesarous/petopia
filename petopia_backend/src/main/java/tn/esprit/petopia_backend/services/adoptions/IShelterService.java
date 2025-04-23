package tn.esprit.petopia_backend.services.adoptions;


import org.springframework.web.multipart.MultipartFile;
import tn.esprit.petopia_backend.entities.adoptions.Shelter;
import java.util.List;

public interface IShelterService {
    Shelter createShelter(Shelter shelter, Integer userIdFromToken, MultipartFile logoFile);
    Shelter updateShelter(Shelter shelter, Integer userIdFromToken,MultipartFile logoFile);
    void deleteShelter(Integer id);
    Shelter getShelterById(Integer id);
    List<Shelter> getAllShelters();
    Shelter getShelterByUserId(Integer userId);
}
