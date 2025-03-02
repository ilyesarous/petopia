package tn.esprit.petopia_backend.services.store.interfaces;

import tn.esprit.petopia_backend.entities.store.SecondHand;

import java.util.List;

public interface ISecondHandService {
    SecondHand addSecondHand(SecondHand secondHand);
    SecondHand findById(int id);
    void deleteById(int id);
    SecondHand updateSecondHand(SecondHand secondHand);
    List<SecondHand> findAll();
}
