package tn.esprit.petopia_backend.services.event;

import tn.esprit.petopia_backend.entities.event.Event;
import tn.esprit.petopia_backend.entities.event.Participation;

import java.lang.reflect.Parameter;
import java.util.List;
import java.util.Optional;

public interface IParticipationService {
    public List<Participation> getAllParticipations();
    public Optional<Participation> getParticipationById(Long id);
    public Participation createParticipation(Participation participation);
    public Participation updateParticipation(Long id, Participation updatedParticipation);
    public void deleteParticipation(Long id);
}
