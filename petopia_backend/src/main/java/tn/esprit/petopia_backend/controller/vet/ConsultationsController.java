package tn.esprit.petopia_backend.controller.vet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.entities.vet.Consultations;
import tn.esprit.petopia_backend.entities.vet.status_type;
import tn.esprit.petopia_backend.services.vet.IConsultationsService;

import java.util.List;
import java.util.Map;

@RestController
//@RequestMapping("/user/Consultations") //njidd kelmett auth
@CrossOrigin(origins = "http://localhost:4200")
public class ConsultationsController {

    @Autowired
    IConsultationsService consultationsService;

    @PostMapping("/auth/Consultations/addConsultations")//user
    public Consultations addConsultations(@RequestBody Consultations consultations){
        System.out.println("***********controller***********");
        System.out.println(consultations.toString());
        return consultationsService.addConsultations(consultations);
    }


//    @PostMapping("/vet/addConsultations")
//    Consultations addConsultationsvet(@RequestBody Consultations consultations){
//        return consultationsService.addConsultations(consultations);
//    }
//    @PostMapping("/user/Consultations/addConsultations")
//    Consultations addConsultationsuser(@RequestBody Consultations consultations){
//        return consultationsService.addConsultations(consultations);
//    }
    //nestagnaa ala hediiii
//@RequestMapping("/Consultations") //njidd kelmett auth


    @PutMapping("/auth/Consultations/updateConsultations")
    Consultations updateConsultations(@RequestBody Consultations consultations){
        return consultationsService.updateConsultations(consultations);
    }


    @PatchMapping("/auth/Consultations/updateConsultationsStatus/{id}")
    @ResponseBody
    public ResponseEntity<Consultations> updateConsultationStatus(
            @PathVariable int id,
            @RequestBody Map<String, String> statusUpdate) {

        // Log pour vérification
        System.out.println("Received PATCH request for consultation " + id + " with status: " + statusUpdate);

        Consultations consultation = consultationsService.retriveConsultations(id);
        if (consultation == null) {
            return ResponseEntity.notFound().build();
        }

        String newStatus = statusUpdate.get("statusT");
        if (newStatus != null) {
            try {
                consultation.setStatusT(status_type.valueOf(newStatus));
                Consultations updated = consultationsService.updateConsultations(consultation);
                System.out.println("Successfully updated consultation: " + updated);
                return ResponseEntity.ok(updated);
            } catch (IllegalArgumentException e) {
                System.out.println("Invalid status value: " + newStatus);
                return ResponseEntity.badRequest().build();
            }
        }

        return ResponseEntity.badRequest().build();
    }



    @DeleteMapping("/auth/Consultations/deleteConsultations/{idConsultations}")//vet
    void deleteConsultations(@PathVariable int idConsultations){
        consultationsService.deleteConsultations(idConsultations);
    }

    @GetMapping("/auth/Consultations/retriveAllConsultations")
    List<Consultations> retriveAllConsultations(){
        return consultationsService.retriveAllConsultations();
    }

    @GetMapping("/auth/Consultations/retriveConsultations/{idConsultations}")
    Consultations retriveConsultations(@PathVariable int idConsultations){
        return consultationsService.retriveConsultations(idConsultations);
    }
}
