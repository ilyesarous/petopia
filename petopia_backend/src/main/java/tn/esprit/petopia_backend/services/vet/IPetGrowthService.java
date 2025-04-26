package tn.esprit.petopia_backend.services.vet;

import tn.esprit.petopia_backend.entities.vet.Pet_Growth;
import java.util.List;
import java.util.Map;

public interface IPetGrowthService {
    Pet_Growth addPetGrowth(Pet_Growth petGrowth);
    Pet_Growth updatePetGrowth(Pet_Growth petGrowth);
    void deletePetGrowth(int idPet_Growth);
    List<Pet_Growth> retrieveAllPetGrowths();
    Pet_Growth retrievePetGrowth(int idPet_Growth);
    List<Pet_Growth> retrievePetGrowthsByPetId(int petId);

    Map<String, String> calculatePetBMI(int petId);
}
