package tn.esprit.petopia_backend.controller.vet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.vet.Medicament_Prescription;
import tn.esprit.petopia_backend.services.vet.IMedicamentPrescriptionService;

import java.util.List;

@RestController
@RequestMapping("/MedicamentPrescription")
public class MedicamentPrescriptionController {

    @Autowired
    IMedicamentPrescriptionService medicamentPrescriptionService;

    @PostMapping("/addMedicamentPrescription")
    public Medicament_Prescription addMedicamentPrescription(@RequestBody Medicament_Prescription medicamentPrescription) {
        return medicamentPrescriptionService.addMedicamentPrescription(medicamentPrescription);
    }

    @PutMapping("/updateMedicamentPrescription")
    public Medicament_Prescription updateMedicamentPrescription(@RequestBody Medicament_Prescription medicamentPrescription) {
        return medicamentPrescriptionService.updateMedicamentPrescription(medicamentPrescription);
    }

    @DeleteMapping("/deleteMedicamentPrescription/{idMedicament_Prescription}")
    public void deleteMedicamentPrescription(@PathVariable int idMedicament_Prescription) {
        medicamentPrescriptionService.deleteMedicamentPrescription(idMedicament_Prescription);
    }

    @GetMapping("/retrieveAllMedicamentPrescriptions")
    public List<Medicament_Prescription> retrieveAllMedicamentPrescriptions() {
        return medicamentPrescriptionService.retrieveAllMedicamentPrescriptions();
    }

    @GetMapping("/retrieveMedicamentPrescription/{idMedicament_Prescription}")
    public Medicament_Prescription retrieveMedicamentPrescription(@PathVariable int idMedicament_Prescription) {
        return medicamentPrescriptionService.retrieveMedicamentPrescription(idMedicament_Prescription);
    }
}
