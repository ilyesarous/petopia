package tn.esprit.petopia_backend.controller.matching;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.matching.Preferences;
import tn.esprit.petopia_backend.services.matching.PreferencesService;

import java.util.List;

@RestController


@RequestMapping("/user/preferences")

public class PreferencesController {
    @Autowired
    private PreferencesService iPreferencesService;

    @PostMapping("/addPreferences")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public Preferences addPreferences (@RequestBody Preferences Preferences)
    {
        return iPreferencesService.addPreferences(Preferences);
    }

    @PutMapping("/updatePreferences")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    Preferences updatePreferences(@RequestBody Preferences Preferences){
        return iPreferencesService.updatePreferences(Preferences);
    }
    @DeleteMapping("/deletePreferences/{idPreferences}")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    void deleteChambre(@PathVariable int idPreferences){
        iPreferencesService.deletePreferences(idPreferences);
    }
    @GetMapping("/getAll")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    List<Preferences> getAll(){
        return iPreferencesService.getAllPreferences();
    }
    @GetMapping("/getByid/{idPreferences}")
    Preferences getById(@PathVariable int idPreferences){
        return   iPreferencesService.getPreferences(idPreferences) ;
    }

}
