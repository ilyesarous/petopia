package tn.esprit.petopia_backend.services.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.event.Event;
import tn.esprit.petopia_backend.entities.event.Participation;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.repositories.event.ParticipationRepository;
import tn.esprit.petopia_backend.services.user.UserService;

import java.util.List;
import java.util.Optional;

@Service
public class ParticipationServiceImplement implements IParticipationService {

    @Autowired
    private ParticipationRepository participationRepository;
    @Autowired
    private UserService userService;

    @Override
    public List<Participation> getAllParticipations() {
        return participationRepository.findAll();
    }

    @Override
    public Optional<Participation> getParticipationById(Long id) {
        return participationRepository.findById(id);
    }

    @Override
    public Participation createParticipation(Participation participation) {
        User user = userService.getUsersById(participation.getParticipant().getId_user()).getOurUsers();
        participation.setParticipant(user);
        return participationRepository.save(participation);
    }

    @Override
    public Participation updateParticipation(Long id, Participation updatedParticipation) {
        return participationRepository.findById(id).map(participation -> {
            participation.setStatusParticipation(updatedParticipation.getStatusParticipation());
            participation.setDateInscription(updatedParticipation.getDateInscription());
            return participationRepository.save(participation);
        }).orElseThrow(() -> new RuntimeException("Participation not found"));
    }

    @Override
    public void deleteParticipation(Long id) {
            participationRepository.deleteById(id);
    }
}
