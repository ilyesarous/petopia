package tn.esprit.petopia_backend.services.event;

import tn.esprit.petopia_backend.entities.event.Event;
import tn.esprit.petopia_backend.entities.event.ServiceAnimal;

import java.util.List;
import java.util.Optional;

public interface IServiceAnimalService {
    public List<ServiceAnimal> getAllServiceAnimals();
    public Optional<ServiceAnimal> getServiceAnimalById(Long id);
    public ServiceAnimal createServiceAnimal(ServiceAnimal serviceAnimal);
    public ServiceAnimal updateServiceAnimal(Long id, ServiceAnimal updatedServiceAnimal);
    public void deleteServiceAnimal(Long id);
}
