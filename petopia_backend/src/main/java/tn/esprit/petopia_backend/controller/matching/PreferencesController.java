package tn.esprit.petopia_backend.controller.matching;

import org.springframework.beans.factory.annotation.Autowired;
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
    public Preferences addPreferences (@RequestBody Preferences Preferences)
    {
        return iPreferencesService.addPreferences(Preferences);
    }
    @PutMapping("/updatePreferences")
    Preferences updatePreferences(@RequestBody Preferences Preferences){
        return iPreferencesService.updatePreferences(Preferences);
    }
    @DeleteMapping("/deletePreferences/{idPreferences}")
    void deleteChambre(@PathVariable int idPreferences){
        iPreferencesService.deletePreferences(idPreferences);
    }
    @GetMapping("/getAll")
    List<Preferences> getAll(){
        return iPreferencesService.getAllPreferences();
    }
    @GetMapping("/getByid/{idPreferences}")
    Preferences getById(@PathVariable int idPreferences){
        return   iPreferencesService.getPreferences(idPreferences) ;
    }

}
