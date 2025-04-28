package tn.esprit.petopia_backend.services.vet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.pet.Pet;
import tn.esprit.petopia_backend.entities.vet.Pet_Growth;
import tn.esprit.petopia_backend.repositories.pet.PetRepository;
import tn.esprit.petopia_backend.repositories.vet.PetGrowthRepository;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PetGrowthServiceImplement implements IPetGrowthService {

    @Autowired
    private PetGrowthRepository petGrowthRepository;
    @Autowired
    private PetRepository petRepository;  // Pour récupérer le Pet

    //    @Override
//    public Pet_Growth addPetGrowth(Pet_Growth petGrowth) {
//        return petGrowthRepository.save(petGrowth);
//    }
    @Override
    public Pet_Growth addPetGrowth(Pet_Growth petGrowth) {
        if (petGrowth.getPetgrowth() == null || petGrowth.getPetgrowth().getIdPet() == 0) {
            throw new RuntimeException("Pet ID is required");
        }

        Pet pet = petRepository.findById(petGrowth.getPetgrowth().getIdPet())
                .orElseThrow(() -> new RuntimeException("Pet not found"));

        petGrowth.setPetgrowth(pet);  // Associer le Pet à Pet_Growth

        return petGrowthRepository.save(petGrowth);
    }

    @Override
    public Pet_Growth updatePetGrowth(Pet_Growth petGrowth) {
        return petGrowthRepository.save(petGrowth);
    }

    @Override
    public void deletePetGrowth(int idPet_Growth) {
        petGrowthRepository.deleteById(idPet_Growth);
    }

    @Override
    public List<Pet_Growth> retrieveAllPetGrowths() {
        return (List<Pet_Growth>) petGrowthRepository.findAll();
    }

    @Override
    public Pet_Growth retrievePetGrowth(int idPet_Growth) {
        return petGrowthRepository.findById(idPet_Growth).orElse(null);
    }

    @Override
    public List<Pet_Growth> retrievePetGrowthsByPetId(int petId) {
        // Vérifiez d'abord si le pet existe
        if (!petRepository.existsById(petId)) {
            throw new RuntimeException("Pet with ID " + petId + " not found");
        }

        // Récupérez tous les Pet_Growth associés à ce pet
        return petGrowthRepository.findByPetgrowth_IdPet(petId);
    }


    @Override
    public Map<String, String> calculatePetBMI(int petId) {
        // Récupérer tous les enregistrements de croissance pour ce pet
        List<Pet_Growth> growths = petGrowthRepository.findByPetgrowth_IdPet(petId);

        if (growths.isEmpty()) {
            throw new RuntimeException("No growth records found for pet with ID: " + petId);
        }

        // Prendre le dernier enregistrement (le plus récent)
        Pet_Growth latestGrowth = growths.stream()
                .max(Comparator.comparing(Pet_Growth::getMeasurement_date))
                .orElseThrow(() -> new RuntimeException("No growth records found"));

        // Calculer l'IMC (BMI = weight / (height * height))
        double heightInMeters = latestGrowth.getHeight() / 100; // convertir cm en m
        double bmi = latestGrowth.getWeight() / (heightInMeters * heightInMeters);

        // Déterminer l'état de santé
        String status;
        String advice;
        String videoUrl;

        if (bmi < 15) {
            status = "UNDERWEIGHT";
            advice = "Your pet is underweight. Consider increasing meal portions or consulting a vet for a special diet plan.";
            videoUrl = "https://youtu.be/drFie83MZpQ?si=M4umibUg9QNRX-vd";
        } else if (bmi >= 15 && bmi <= 30) {
            status = "NORMAL";
            advice = "Your pet is at a healthy weight. Maintain current diet and exercise routine.";
            videoUrl = "https://youtu.be/N5UPW2NFFjA?si=ghTrnDcJzFczZtzG";
        } else {
            status = "OVERWEIGHT";
            advice = "Your pet is overweight. Consider reducing meal portions, switching to diet food, and increasing daily exercise.";
            videoUrl = "https://youtu.be/Erta4eh6oYE?si=1xjwhze9a4wKaoVd";
        }

        // Formater le résultat
        Map<String, String> result = new HashMap<>();
        result.put("bmi", String.format("%.1f", bmi));
        result.put("status", status);
        result.put("advice", advice);
        result.put("lastMeasurementDate", latestGrowth.getMeasurement_date().toString());
        result.put("weight", String.format("%.1f kg", latestGrowth.getWeight()));
        result.put("height", String.format("%.1f cm", latestGrowth.getHeight()));
        result.put("videoUrl", videoUrl);

        return result;
    }
}
