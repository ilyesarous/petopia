package tn.esprit.petopia_backend.services.vet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.pet.Pet;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.entities.vet.Rating_Vet;
import tn.esprit.petopia_backend.repositories.user.UserRepository;
import tn.esprit.petopia_backend.repositories.vet.RatingVetRepository;

import java.util.List;

@Service
public class RatingVetServiceImplement implements IRating_VetService {

    @Autowired
    private RatingVetRepository ratingVetRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public Rating_Vet addRatingVet(Rating_Vet rating) {

        int clientId = rating.getUserclientR().getId_user();
        int vetId = rating.getUservetR().getId_user();

        User userClient = userRepository.findById(clientId).orElse(null);
        User userVet = userRepository.findById(vetId).orElse(null);

        rating.setUserclientR(userClient);
        rating.setUservetR(userVet);

        Rating_Vet savedRatingVet = ratingVetRepository.save(rating);

        return savedRatingVet;
    }

    @Override
    public void deleteRatingVet(int idRating) {
        ratingVetRepository.deleteById(idRating);
    }

    @Override
    public List<Rating_Vet> retrieveAllRatingVet() {
        return (List<Rating_Vet>) ratingVetRepository.findAll();
    }

    @Override
    public Rating_Vet retrieveRatingVet(int idRating) {
        return ratingVetRepository.findById(idRating).orElse(null);
    }

    @Override
    public List<Rating_Vet> getRatingVetByUserId(Integer userId) {
        return ratingVetRepository.findByUserId(userId);
    }


}
