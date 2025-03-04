package tn.esprit.petopia_backend.services.vet;

import tn.esprit.petopia_backend.entities.vet.Medicament_Prescription;
import java.util.List;

public interface IMedicamentPrescriptionService {
    Medicament_Prescription addMedicamentPrescription(Medicament_Prescription medicamentPrescription);
    Medicament_Prescription updateMedicamentPrescription(Medicament_Prescription medicamentPrescription);
    void deleteMedicamentPrescription(int idMedicament_Prescription);
    List<Medicament_Prescription> retrieveAllMedicamentPrescriptions();
    Medicament_Prescription retrieveMedicamentPrescription(int idMedicament_Prescription);
}
