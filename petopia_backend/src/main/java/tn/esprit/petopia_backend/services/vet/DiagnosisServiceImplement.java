package tn.esprit.petopia_backend.services.vet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.pet.Pet;
import tn.esprit.petopia_backend.entities.vet.Diagnosis;
import tn.esprit.petopia_backend.entities.vet.Medicament_Prescription;
import tn.esprit.petopia_backend.repositories.pet.PetRepository;
import tn.esprit.petopia_backend.repositories.vet.DiagnosisRepository;
import tn.esprit.petopia_backend.repositories.vet.MedicamentPrescriptionRepository;

import java.util.List;
import java.util.Set;

@Service
public class DiagnosisServiceImplement implements IDiagnosisService {

    @Autowired
    private DiagnosisRepository diagnosisRepository;
    @Autowired
    private PetRepository petRepository;
    @Autowired
    private MedicamentPrescriptionRepository medicamentRepository;

    /*
    @Override
    public Diagnosis addDiagnosis(Diagnosis diagnosis) {
        return diagnosisRepository.save(diagnosis);
    }

     */
//    @Override
//    public Diagnosis addDiagnosis(Diagnosis diagnosis) {
//        if (diagnosis.getMedicamentPrescriptions() != null) {
//            for (Medicament_Prescription mp : diagnosis.getMedicamentPrescriptions()) {
//                mp.setDiagnosis(diagnosis); // Associer chaque medicament à ce diagnosis
//            }
//        }
//        return diagnosisRepository.save(diagnosis);
//    }

    @Override
    public Diagnosis addDiagnosis(Diagnosis diagnosis) {
        if (diagnosis.getPetdiagnosis() == null || diagnosis.getPetdiagnosis().getIdPet() == 0) {
            throw new RuntimeException("Pet ID is required");
        }

        Pet pet = petRepository.findById(diagnosis.getPetdiagnosis().getIdPet())
                .orElseThrow(() -> new RuntimeException("Pet not found"));

        diagnosis.setPetdiagnosis(pet); // Associer le pet au diagnosis

        if (diagnosis.getMedicamentPrescriptions() != null) {
            for (Medicament_Prescription mp : diagnosis.getMedicamentPrescriptions()) {
                mp.setDiagnosis(diagnosis);
            }
        }

        return diagnosisRepository.save(diagnosis);
    }

    /*
    @Override
    public Diagnosis updateDiagnosis(Diagnosis diagnosis) {
        return diagnosisRepository.save(diagnosis);
    }

 */
    @Override
    public Diagnosis updateDiagnosis(Diagnosis diagnosis) {
        Diagnosis existingDiagnosis = diagnosisRepository.findById(diagnosis.getIdDiagnosis()).orElse(null);

        if (existingDiagnosis != null) {
            // Conserver les prescriptions existantes
            for (Medicament_Prescription mp : diagnosis.getMedicamentPrescriptions()) {
                mp.setDiagnosis(existingDiagnosis);
            }

            // Mettre à jour les informations du diagnosis
            existingDiagnosis.setDiagnosis_description(diagnosis.getDiagnosis_description());
            existingDiagnosis.setDiagnosis_date(diagnosis.getDiagnosis_date());
            existingDiagnosis.setMedicamentPrescriptions(diagnosis.getMedicamentPrescriptions());

            return diagnosisRepository.save(existingDiagnosis);
        }
        return null; // Ou gérer une exception
    }


    //    @Override
//    public void deleteDiagnosis(int idDiagnosis) {
//        diagnosisRepository.deleteById(idDiagnosis);
//    }
    @Override
    public void deleteDiagnosis(int idDiagnosis) {
        Diagnosis diagnosis = diagnosisRepository.findById(idDiagnosis)
                .orElseThrow(() -> new RuntimeException("Diagnosis not found"));

        // Supprimer les médicaments associés à ce diagnosis
        Set<Medicament_Prescription> medicaments = diagnosis.getMedicamentPrescriptions();
        medicamentRepository.deleteAll(medicaments);

        // Supprimer le diagnosis
        diagnosisRepository.delete(diagnosis);
    }


    @Override
    public List<Diagnosis> retrieveAllDiagnosis() {
        return (List<Diagnosis>) diagnosisRepository.findAll();
    }
    /*
        @Override
        public Diagnosis retrieveDiagnosis(int idDiagnosis) {
            return diagnosisRepository.findById(idDiagnosis).orElse(null);
        }

     */
    @Override
    public Diagnosis retrieveDiagnosis(int idDiagnosis) {
        return diagnosisRepository.findById(idDiagnosis)
                .orElse(null); // Les Medicament_Prescriptions seront récupérés automatiquement grâce à la relation OneToMany
    }

    @Override
    public List<Diagnosis> retrieveDiagnosisByPetId(int petId) {
        // Vérifiez d'abord si le pet existe
        if (!petRepository.existsById(petId)) {
            throw new RuntimeException("Pet with ID " + petId + " not found");
        }

        // Récupérez tous les Pet_Growth associés à ce pet
        return diagnosisRepository.findByPetdiagnosis_IdPet(petId);
    }

}
