package tn.esprit.petopia_backend.services.store.interfaces;

import tn.esprit.petopia_backend.entities.store.Feedback;

import java.util.List;

public interface IFeedbackService {
    String addFeedback(Feedback feedback);
    Feedback findById(int id);
    void deleteById(int id);
    Feedback updateFeedback(Feedback feedback);
    List<Feedback> findAll();
}
