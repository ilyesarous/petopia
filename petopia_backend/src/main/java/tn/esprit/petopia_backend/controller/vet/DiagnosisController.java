package tn.esprit.petopia_backend.controller.vet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.vet.Diagnosis;
import tn.esprit.petopia_backend.services.vet.IDiagnosisService;

import java.util.List;

@RestController
//@RequestMapping("/auth/Diagnosis")
public class DiagnosisController {

    @Autowired
    IDiagnosisService diagnosisService;

    @PostMapping("/auth/Diagnosis/addDiagnosis")//vet
    public Diagnosis addDiagnosis(@RequestBody Diagnosis diagnosis) {
        return diagnosisService.addDiagnosis(diagnosis);
    }

    @PutMapping("/auth/Diagnosis/updateDiagnosis")//vet
    public Diagnosis updateDiagnosis(@RequestBody Diagnosis diagnosis) {
        return diagnosisService.updateDiagnosis(diagnosis);
    }

    @DeleteMapping("/auth/Diagnosis/deleteDiagnosis/{idDiagnosis}")//vet
    public void deleteDiagnosis(@PathVariable int idDiagnosis) {
        diagnosisService.deleteDiagnosis(idDiagnosis);
    }

    @GetMapping("/auth/Diagnosis/retrieveAllDiagnosis")
    public List<Diagnosis> retrieveAllDiagnosis() {
        return diagnosisService.retrieveAllDiagnosis();
    }

    @GetMapping("/auth/Diagnosis/retrieveDiagnosis/{idDiagnosis}")
//    public Diagnosis retrieveDiagnosis(@PathVariable int idDiagnosis) {
//        return diagnosisService.retrieveDiagnosis(idDiagnosis);
//    }

    public Diagnosis retrieveDiagnosis(@PathVariable int idDiagnosis) {
        Diagnosis diagnosis = diagnosisService.retrieveDiagnosis(idDiagnosis);
        if (diagnosis != null) {
            try {
                QRCodeGenerator.generateQRCode(diagnosis);
                System.out.println("QR Code généré avec succès : " + diagnosis.getIdDiagnosis());
            } catch (Exception e) {
                e.printStackTrace(); // Affiche l'erreur dans la console
            }
        }
        return diagnosis;
    }
}
