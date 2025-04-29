package tn.esprit.petopia_backend.dto;

import java.util.Map;

public class StatisticsDTOmatch {
    private Map<String, Long> breedStatistics;
    private Map<String, Long> speciesStatistics;
    private Map<String, Long> ageGroupStatistics;

    // Getters and Setters
    public Map<String, Long> getBreedStatistics() {
        return breedStatistics;
    }

    public void setBreedStatistics(Map<String, Long> breedStatistics) {
        this.breedStatistics = breedStatistics;
    }

    public Map<String, Long> getSpeciesStatistics() {
        return speciesStatistics;
    }

    public void setSpeciesStatistics(Map<String, Long> speciesStatistics) {
        this.speciesStatistics = speciesStatistics;
    }

    public Map<String, Long> getAgeGroupStatistics() {
        return ageGroupStatistics;
    }

    public void setAgeGroupStatistics(Map<String, Long> ageGroupStatistics) {
        this.ageGroupStatistics = ageGroupStatistics;
    }
}
