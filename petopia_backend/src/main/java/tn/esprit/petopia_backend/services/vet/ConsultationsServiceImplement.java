package tn.esprit.petopia_backend.services.vet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.pet.Pet;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.entities.vet.Consultations;
import tn.esprit.petopia_backend.repositories.pet.PetRepository;
import tn.esprit.petopia_backend.repositories.user.UserRepository;
import tn.esprit.petopia_backend.repositories.vet.ConsultationsRepository;

import java.util.List;

@Service
public class ConsultationsServiceImplement implements IConsultationsService{

    @Autowired
    private ConsultationsRepository consultationsRepository;
    @Autowired
    private UserRepository userRepository;  // Ajout du repository des utilisateurs

    @Autowired
    private PetRepository petRepository;  // Ajout du repository des animaux

    /*
        @Override
        public Consultations addConsultations(Consultations consultations) {
            return consultationsRepository.save(consultations);
        }

     */
    @Override
    public Consultations addConsultations(Consultations consultation) {
        System.out.println("***********service***********");
        //if (consultation.getUserclient() != null && consultation.getUservet() != null && consultation.getPetconsultation() != null) {
            int clientId = consultation.getUserclient().getId_user();
            int vetId = consultation.getUservet().getId_user();
            int petId = consultation.getPetconsultation().getIdPet();

            User userClient = userRepository.findById(clientId).orElse(null);
            User userVet = userRepository.findById(vetId).orElse(null);
            Pet pet = petRepository.findById(petId).orElse(null);

          //  if (userClient != null && userVet != null && pet != null) {
                consultation.setUserclient(userClient);
                consultation.setUservet(userVet);
                consultation.setPetconsultation(pet);
                System.out.println(consultation.toString());
                return consultationsRepository.save(consultation);
          //  }
       // }
       // return null; // Retourne null si un des objets est introuvable
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
