package tn.esprit.petopia_backend.controller.matching;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.matching.Matches;
import tn.esprit.petopia_backend.services.matching.MatchesService;

import java.util.List;


@RestController
@RequestMapping("/user/matches")
public class MatchesController {
    @Autowired
    private MatchesService iMatchesService;

    @PostMapping("/addMatches")
    public Matches addMatches (@RequestBody Matches matches)
    {
        return iMatchesService.addMatches(matches);
    }
    @PutMapping("/updateMatches")
    Matches updateMatches(@RequestBody Matches matches){
        return iMatchesService.updateMatches(matches);
    }
    @DeleteMapping("/deleteMatches/{idMatches}")
    void deleteChambre(@PathVariable int idMatches){
        iMatchesService.deleteMatches(idMatches);
    }
    @GetMapping("/getAll")
    List<Matches> getAll(){
        return iMatchesService.getAllMatches();
    }
    @GetMapping("/getByid/{idMatches}")
    Matches getById(@PathVariable int idMatches){
        return   iMatchesService.getMatches(idMatches) ;
    }

}
