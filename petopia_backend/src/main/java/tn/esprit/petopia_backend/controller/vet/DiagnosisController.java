package tn.esprit.petopia_backend.controller.vet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.vet.Diagnosis;
import tn.esprit.petopia_backend.services.vet.IDiagnosisService;

import java.util.List;

@RestController
@RequestMapping("/auth/Diagnosis")
public class DiagnosisController {

    @Autowired
    IDiagnosisService diagnosisService;

    @PostMapping("/addDiagnosis")
    public Diagnosis addDiagnosis(@RequestBody Diagnosis diagnosis) {
        return diagnosisService.addDiagnosis(diagnosis);
    }

    @PutMapping("/updateDiagnosis")
    public Diagnosis updateDiagnosis(@RequestBody Diagnosis diagnosis) {
        return diagnosisService.updateDiagnosis(diagnosis);
    }

    @DeleteMapping("/deleteDiagnosis/{idDiagnosis}")
    public void deleteDiagnosis(@PathVariable int idDiagnosis) {
        diagnosisService.deleteDiagnosis(idDiagnosis);
    }

    @GetMapping("/retrieveAllDiagnosis")
    public List<Diagnosis> retrieveAllDiagnosis() {
        return diagnosisService.retrieveAllDiagnosis();
    }

    @GetMapping("/retrieveDiagnosis/{idDiagnosis}")
    public Diagnosis retrieveDiagnosis(@PathVariable int idDiagnosis) {
        return diagnosisService.retrieveDiagnosis(idDiagnosis);
    }
}
