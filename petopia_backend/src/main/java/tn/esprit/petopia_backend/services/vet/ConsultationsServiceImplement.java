package tn.esprit.petopia_backend.services.vet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.pet.Pet;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.entities.vet.Consultations;
import tn.esprit.petopia_backend.entities.vet.Notification;
import tn.esprit.petopia_backend.repositories.pet.PetRepository;
import tn.esprit.petopia_backend.repositories.user.UserRepository;
import tn.esprit.petopia_backend.repositories.vet.ConsultationsRepository;
import tn.esprit.petopia_backend.repositories.vet.NotificationRepository;

import java.util.List;

@Service
public class ConsultationsServiceImplement implements IConsultationsService{

    @Autowired
    private ConsultationsRepository consultationsRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public Consultations addConsultations(Consultations consultation) {
        int clientId = consultation.getUserclient().getId_user();
        int vetId = consultation.getUservet().getId_user();
        int petId = consultation.getPetconsultation().getIdPet();

        User userClient = userRepository.findById(clientId).orElse(null);
        User userVet = userRepository.findById(vetId).orElse(null);
        Pet pet = petRepository.findById(petId).orElse(null);

        consultation.setUserclient(userClient);
        consultation.setUservet(userVet);
        consultation.setPetconsultation(pet);

        Consultations savedConsultation = consultationsRepository.save(consultation);

        // Création de notification pour le client
        createNotification(userClient, "New consultation created for your pet " + pet.getPetName());

        // Création de notification pour le vétérinaire
        createNotification(userVet, "A new " + consultation.getConsultationT() + " consultation has been scheduled with "
                + userClient.getUsername() + " on " + consultation.getConsultation_date() + ".");

        return savedConsultation;
    }

    @Override
    public Consultations updateConsultations(Consultations consultation) {
        Consultations existingConsultation = consultationsRepository.findById(consultation.getIdConsultation()).orElse(null);
        if (existingConsultation != null) {
            // Vérifiez si le statut a changé
            if (!existingConsultation.getStatusT().equals(consultation.getStatusT())) {
                String statusMessage = "Status of your consultation updated: " + consultation.getStatusT();
                createNotification(consultation.getUserclient(), statusMessage);
                createNotification(consultation.getUservet(), statusMessage);
            }

            return consultationsRepository.save(consultation);
        }
        return null;
    }

    private void createNotification(User user, String message) {
        Notification notification = new Notification();
        notification.setMessage(message);
        notification.setUser(user);
        notificationRepository.save(notification);
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
