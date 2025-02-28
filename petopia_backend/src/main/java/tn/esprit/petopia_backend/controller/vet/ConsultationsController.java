package tn.esprit.petopia_backend.controller.vet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.vet.Consultations;
import tn.esprit.petopia_backend.services.vet.IConsultationsService;

import java.util.List;

@RestController
@RequestMapping("/Consultations")
public class ConsultationsController {

    @Autowired
    IConsultationsService consultationsService;

    @PostMapping("/addConsultations")
    Consultations addConsultations(@RequestBody Consultations consultations){
        return consultationsService.addConsultations(consultations);
    }

    @PutMapping("/updateConsultations")
    Consultations updateConsultations(@RequestBody Consultations consultations){
        return consultationsService.updateConsultations(consultations);
    }

    @DeleteMapping("/deleteConsultations/{idConsultations}")
    void deleteConsultations(@PathVariable int idConsultations){
        consultationsService.deleteConsultations(idConsultations);
    }

    @GetMapping("/retriveAllConsultations")
    List<Consultations> retriveAllBloc(){
        return consultationsService.retriveAllConsultations();
    }

    @GetMapping("/retriveConsultations/{idConsultations}")
    Consultations retriveConsultations(@PathVariable int idConsultations){
        return consultationsService.retriveConsultations(idConsultations);
    }
}
