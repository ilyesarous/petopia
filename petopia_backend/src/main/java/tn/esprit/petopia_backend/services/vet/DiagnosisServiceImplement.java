package tn.esprit.petopia_backend.services.vet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.vet.Diagnosis;
import tn.esprit.petopia_backend.entities.vet.Medicament_Prescription;
import tn.esprit.petopia_backend.repositories.vet.DiagnosisRepository;

import java.util.List;

@Service
public class DiagnosisServiceImplement implements IDiagnosisService {

    @Autowired
    private DiagnosisRepository diagnosisRepository;

    /*
    @Override
    public Diagnosis addDiagnosis(Diagnosis diagnosis) {
        return diagnosisRepository.save(diagnosis);
    }

     */
    @Override
    public Diagnosis addDiagnosis(Diagnosis diagnosis) {
        if (diagnosis.getMedicamentPrescriptions() != null) {
            for (Medicament_Prescription mp : diagnosis.getMedicamentPrescriptions()) {
                mp.setDiagnosis(diagnosis); // Associer chaque medicament à ce diagnosis
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


    @Override
    public void deleteDiagnosis(int idDiagnosis) {
        diagnosisRepository.deleteById(idDiagnosis);
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

}
