package tn.esprit.petopia_backend.entities.vet;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    private Double consultation_price;
    @Enumerated(EnumType.STRING)
    private status_type statusT;

    //relation * consultation * to 1 pet
//    @ManyToOne(cascade = CascadeType.ALL)
//    private Pet pet;

    //relation consultation * to 1 user
//    @ManyToOne(cascade = CascadeType.ALL)
//    private User user;

    //classe pet
    //    @OneToMany(cascade = CascadeType.ALL, mappedBy = "pet")
    //    private Set<Pet> PetList;

    //classe user
    //    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user")
    //    private Set<User> UserList;


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
