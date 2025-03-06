package tn.esprit.petopia_backend.services.store;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.store.Feedback;
import tn.esprit.petopia_backend.repositories.store.FeedbackRepository;
import tn.esprit.petopia_backend.services.store.interfaces.IFeedbackService;

import java.util.List;

@Service
@AllArgsConstructor
public class FeedbackService implements IFeedbackService {
    private FeedbackRepository repository;

    @Override
    public Feedback addFeedback(Feedback feedback) {
        return repository.save(feedback);
    }

    @Override
    public Feedback findById(int id) {
        return repository.findById(id).get();
    }

    @Override
    public void deleteById(int id) {
        repository.deleteById(id);
    }

    @Override
    public Feedback updateFeedback(Feedback feedback) {
        return repository.save(feedback);
    }

    @Override
    public List<Feedback> findAll() {
        return repository.findAll();
    }
}
