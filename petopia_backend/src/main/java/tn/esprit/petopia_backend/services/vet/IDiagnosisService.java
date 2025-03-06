package tn.esprit.petopia_backend.services.vet;

import tn.esprit.petopia_backend.entities.vet.Diagnosis;

import java.util.List;

public interface IDiagnosisService {
    Diagnosis addDiagnosis(Diagnosis diagnosis);
    Diagnosis updateDiagnosis(Diagnosis diagnosis);
    void deleteDiagnosis(int idDiagnosis);
    List<Diagnosis> retrieveAllDiagnosis();
    Diagnosis retrieveDiagnosis(int idDiagnosis);
}
