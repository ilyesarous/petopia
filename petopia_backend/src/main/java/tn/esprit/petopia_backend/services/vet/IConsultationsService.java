package tn.esprit.petopia_backend.services.vet;

import tn.esprit.petopia_backend.entities.pet.Pet;
import tn.esprit.petopia_backend.entities.vet.Consultations;

import java.util.List;

public interface IConsultationsService {

    Consultations addConsultations(Consultations consultations);
    Consultations updateConsultations(Consultations consultations);
    void deleteConsultations(int idConsultation);
    List<Consultations> retriveAllConsultations();
    Consultations retriveConsultations(int idConsultation);

    public List<Pet> getUniquePetsForVet(Long vetId);

}
