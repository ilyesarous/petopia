package tn.esprit.petopia_backend.services.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.event.ReservationService;
import tn.esprit.petopia_backend.entities.event.ServiceAnimal;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.repositories.event.ReservationRepository;
import tn.esprit.petopia_backend.repositories.event.ServiceAnimalRepository;
import tn.esprit.petopia_backend.services.user.UserService;

import java.util.List;
import java.util.Optional;

@Service
public class ReservationServiceImplement implements IReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ServiceAnimalImplement serviceAnimalService;

    @Autowired
    private UserService userService;

    @Override
    public List<ReservationService> getAllReservations() {
        return reservationRepository.findAll();
    }

    @Override
    public Optional<ReservationService> getReservationById(Long id) {
        return reservationRepository.findById(id);
    }

    @Override
    public ReservationService createReservation(ReservationService reservation) {
        ServiceAnimal serviceAnimal = serviceAnimalService.getServiceAnimalById(reservation.getServiceAnimal().getIdServiceAnimal())
                .orElseThrow(() -> new RuntimeException("ServiceAnimal not found"));

        //User user = userService.getUsersById(reservation.getUtilisateur().getId_user()).getOurUsers();
//        reservation.setUtilisateur(user);
//
      reservation.setServiceAnimal(serviceAnimal);
//        reservation.setUtilisateur(user);

        return reservationRepository.save(reservation);
    }



    @Override
    public ReservationService updateReservation(Long id, ReservationService updatedReservationService) {
        return reservationRepository.findById(id).map(reservationService -> {
            reservationService.setDateReservation(updatedReservationService.getDateReservation());
            reservationService.setServiceAnimal(updatedReservationService.getServiceAnimal());
            reservationService.setUtilisateur(updatedReservationService.getUtilisateur());
            return reservationRepository.save(reservationService);
        }).orElseThrow(() -> new RuntimeException("ReservationService not found"));
    }

    @Override
    public void deleteReservation(Long id) {
        reservationRepository.deleteById(id);
    }
}
