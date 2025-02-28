package tn.esprit.petopia_backend.services.vet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.vet.Consultations;
import tn.esprit.petopia_backend.repositories.vet.ConsultationsRepository;

import java.util.List;

@Service
public class ConsultationsServiceImplement implements IConsultationsService{

    @Autowired
    private ConsultationsRepository consultationsRepository;

    @Override
    public Consultations addConsultations(Consultations consultations) {
        return consultationsRepository.save(consultations);
    }

    @Override
    public Consultations updateConsultations(Consultations consultations) {
        return consultationsRepository.save(consultations);
    }

    @Override
    public void deleteConsultations(int idConsultation) {
        consultationsRepository.deleteById(idConsultation);
    }

    @Override
    public List<Consultations> retriveAllConsultations() {
        return (List<Consultations>) consultationsRepository.findAll();
    }

    @Override
    public Consultations retriveConsultations(int idConsultation) {
        return consultationsRepository.findById(idConsultation).orElse(null);
    }
}
