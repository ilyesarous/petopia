package tn.esprit.petopia_backend.services.event;

import tn.esprit.petopia_backend.entities.event.Event;
import tn.esprit.petopia_backend.entities.event.ReservationService;

import java.util.List;
import java.util.Optional;

public interface IReservationService {
    public List<ReservationService> getAllReservations();
    public Optional<ReservationService> getReservationById(Long id);
    public ReservationService createReservation(ReservationService reservation);
    public ReservationService updateReservation(Long id, ReservationService updatedReservation);
    public void deleteReservation(Long id);



}
