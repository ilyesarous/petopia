package tn.esprit.petopia_backend.services.vet;

import tn.esprit.petopia_backend.entities.vet.Rating_Vet;

import java.util.List;

public interface IRating_VetService {

    Rating_Vet addRatingVet(Rating_Vet rating);
    void deleteRatingVet(int idRating);
    List<Rating_Vet> retrieveAllRatingVet();
    Rating_Vet retrieveRatingVet(int idRating);
    List<Rating_Vet> getRatingVetByUserId(Integer userId);
    void toggleUserLock(Integer userId);
}
