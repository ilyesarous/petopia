package tn.esprit.petopia_backend.services.matching;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.dto.StatisticsDTOmatch;
import tn.esprit.petopia_backend.entities.matching.MatchStatus;
import tn.esprit.petopia_backend.entities.matching.Matches;
import tn.esprit.petopia_backend.entities.pet.Pet;
import tn.esprit.petopia_backend.repositories.matching.MatchesRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Service
public class StatisticsMatchService {
    @Autowired
    private MatchesRepository matchesRepository;

    public StatisticsDTOmatch getMatchStatistics() {
        List<Matches> acceptedMatches = matchesRepository.findByStatus(MatchStatus.ACCEPTED);
        StatisticsDTOmatch stats = new StatisticsDTOmatch();

        // Breed Statistics
        Map<String, Long> breedStats = new HashMap<>();
        for (Matches match : acceptedMatches) {
            Pet pet1 = match.getPet_1();
            Pet pet2 = match.getPet_2();
            breedStats.merge(pet1.getBreed(), 1L, Long::sum);
            breedStats.merge(pet2.getBreed(), 1L, Long::sum);
        }
        stats.setBreedStatistics(breedStats);

        // Species Statistics
        Map<String, Long> speciesStats = new HashMap<>();
        for (Matches match : acceptedMatches) {
            Pet pet1 = match.getPet_1();
            Pet pet2 = match.getPet_2();
            speciesStats.merge(pet1.getSpecies().toString(), 1L, Long::sum);
            speciesStats.merge(pet2.getSpecies().toString(), 1L, Long::sum);
        }
        stats.setSpeciesStatistics(speciesStats);

        // Age Group Statistics
        Map<String, Long> ageGroupStats = new HashMap<>();
        for (Matches match : acceptedMatches) {
            Pet pet1 = match.getPet_1();
            Pet pet2 = match.getPet_2();
            String ageGroup1 = categorizeAge(pet1.getPetAge());
            String ageGroup2 = categorizeAge(pet2.getPetAge());
            ageGroupStats.merge(ageGroup1, 1L, Long::sum);
            ageGroupStats.merge(ageGroup2, 1L, Long::sum);
        }
        stats.setAgeGroupStatistics(ageGroupStats);

        return stats;
    }

    private String categorizeAge(int age) {
        if (age <= 1) return "Puppy/Kitten (0-1 year)";
        if (age <= 3) return "Young (1-3 years)";
        if (age <= 7) return "Adult (3-7 years)";
        return "Senior (7+ years)";
    }
}
