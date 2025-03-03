package tn.esprit.petopia_backend.services.vet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.vet.Medicament_Prescription;
import tn.esprit.petopia_backend.repositories.vet.MedicamentPrescriptionRepository;

import java.util.List;

@Service
public class MedicamentPrescriptionServiceImplement implements IMedicamentPrescriptionService {

    @Autowired
    private MedicamentPrescriptionRepository medicamentPrescriptionRepository;

    @Override
    public Medicament_Prescription addMedicamentPrescription(Medicament_Prescription medicamentPrescription) {
        return medicamentPrescriptionRepository.save(medicamentPrescription);
    }

    @Override
    public Medicament_Prescription updateMedicamentPrescription(Medicament_Prescription medicamentPrescription) {
        return medicamentPrescriptionRepository.save(medicamentPrescription);
    }

    @Override
    public void deleteMedicamentPrescription(int idMedicament_Prescription) {
        medicamentPrescriptionRepository.deleteById(idMedicament_Prescription);
    }

    @Override
    public List<Medicament_Prescription> retrieveAllMedicamentPrescriptions() {
        return (List<Medicament_Prescription>) medicamentPrescriptionRepository.findAll();
    }

    @Override
    public Medicament_Prescription retrieveMedicamentPrescription(int idMedicament_Prescription) {
        return medicamentPrescriptionRepository.findById(idMedicament_Prescription).orElse(null);
    }
}
