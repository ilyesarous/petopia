package tn.esprit.petopia_backend.entities.vet;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tn.esprit.petopia_backend.entities.pet.Pet;
import tn.esprit.petopia_backend.entities.user.User;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Consultations {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idConsultation;

    private LocalDate consultation_date;
    private LocalTime start_time;
    private LocalTime end_time;
    @Enumerated(EnumType.STRING)
    private consultation_type consultationT;
    private Double consultation_price = 50.0;
    @Enumerated(EnumType.STRING)
    private status_type statusT = status_type.waiting;

    //relation consultation * to 1 user client eli bech yekou ell rdv
    //@ManyToOne(cascade = CascadeType.ALL)
    //@ManyToOne(fetch = FetchType.LAZY
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "userclient_id_user", nullable = false)
    private User userclient;

    //relation consultation * to 1 user vet
    //@ManyToOne(cascade = CascadeType.ALL)
    //@ManyToOne(fetch = FetchType.LAZY)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "uservet_id_user", nullable = false)
    private User uservet;

    //relation consultation * to 1 pet
    //@ManyToOne(fetch = FetchType.LAZY)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "petconsultation_id_pet", nullable = false) // Clé étrangère dans la table notification
    private Pet petconsultation;

    @Override
    public String toString() {
        return "Consultations{" +
                "idConsultation=" + idConsultation +
                ", consultation_date=" + consultation_date +
                ", start_time=" + start_time +
                ", end_time=" + end_time +
                ", consultationT=" + consultationT +
                ", consultation_price=" + consultation_price +
                ", statusT=" + statusT +
                ", userclient=" + userclient +
                ", uservet=" + uservet +
                ", petconsultation=" + petconsultation +
                '}';
    }

    public Pet getPetconsultation() {
        return petconsultation;
    }

    public void setPetconsultation(Pet petconsultation) {
        this.petconsultation = petconsultation;
    }

    public User getUserclient() {
        return userclient;
    }

    public void setUserclient(User userclient) {
        this.userclient = userclient;
    }

    public User getUservet() {
        return uservet;
    }

    public void setUservet(User uservet) {
        this.uservet = uservet;
    }

    public int getIdConsultation() {
        return idConsultation;
    }

    public void setIdConsultation(int idConsultation) {
        this.idConsultation = idConsultation;
    }

    public LocalDate getConsultation_date() {
        return consultation_date;
    }

    public void setConsultation_date(LocalDate consultation_date) {
        this.consultation_date = consultation_date;
    }

    public LocalTime getStart_time() {
        return start_time;
    }

    public void setStart_time(LocalTime start_time) {
        this.start_time = start_time;
    }

    public LocalTime getEnd_time() {
        return end_time;
    }

    public void setEnd_time(LocalTime end_time) {
        this.end_time = end_time;
    }

    public consultation_type getConsultationT() {
        return consultationT;
    }

    public void setConsultationT(consultation_type consultationT) {
        this.consultationT = consultationT;
    }

    public Double getConsultation_price() {
        return consultation_price;
    }

    public void setConsultation_price(Double consultation_price) {
        this.consultation_price = consultation_price;
    }

    public status_type getStatusT() {
        return statusT;
    }

    public void setStatusT(status_type statusT) {
        this.statusT = statusT;
    }
}
