package tn.esprit.petopia_backend.services.vet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.vet.Diagnosis;
import tn.esprit.petopia_backend.repositories.vet.DiagnosisRepository;

import java.util.List;

@Service
public class DiagnosisServiceImplement implements IDiagnosisService {

    @Autowired
    private DiagnosisRepository diagnosisRepository;

    @Override
    public Diagnosis addDiagnosis(Diagnosis diagnosis) {
        return diagnosisRepository.save(diagnosis);
    }

    @Override
    public Diagnosis updateDiagnosis(Diagnosis diagnosis) {
        return diagnosisRepository.save(diagnosis);
    }

    @Override
    public void deleteDiagnosis(int idDiagnosis) {
        diagnosisRepository.deleteById(idDiagnosis);
    }

    @Override
    public List<Diagnosis> retrieveAllDiagnosis() {
        return (List<Diagnosis>) diagnosisRepository.findAll();
    }

    @Override
    public Diagnosis retrieveDiagnosis(int idDiagnosis) {
        return diagnosisRepository.findById(idDiagnosis).orElse(null);
    }
}
