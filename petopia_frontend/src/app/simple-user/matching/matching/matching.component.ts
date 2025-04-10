import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PetService } from 'src/app/services/matchingService/pet.service';
import { MatchsService } from 'src/app/services/matchingService/matchs.service';
import { Match } from 'src/app/models/matching/match';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FriendWithPets } from 'src/app/models/matching/friend-with-pets';
import { MessagingService } from 'src/app/services/matchingService/messaging.service';
import { ChatWebSocketService } from 'src/app/services/matchingService/chat-web-socket.service';
import { WebSocketService } from 'src/app/services/user/web-socket-service.service';
import { Pet } from 'src/app/models/pet/Pet';
@Component({
  selector: 'app-matching',
  templateUrl: './matching.component.html',
  styleUrls: ['./matching.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0, transform: 'translateY(-20px)' })),
      transition(':enter', [
        animate('300ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class MatchingComponent implements OnInit {
  isLoading: boolean = true;
  petList: any[] = [];
  selectedPet: any = null;
  showPetDropdown: boolean = false;
  matchingPets: any[] = [];
  showPreferencesForm: boolean = false;
  newPreferences: any = {
    preferred_breed: '',
    min_age: 0,
    max_age: 0,
    preferred_gender: '',
    preferred_location: ''
  };
  currentPreferences: any = null;
  pendingMatches: Match[] = [];
  showPendingMatches: boolean = false;
  notificationCount: number = 0;
  ownerId: number | null;
  showMatchConfirmation: boolean = false;
  matchedPet1: any = null;
  matchedPet2: any = null;
  matchedFriends: any[] = []; // Placeholder for matched friends
  showChat: boolean = false;
  selectedFriend: any = null;
  chatMessages: any[] = []; // Placeholder for chat messages
  newMessage: string = '';
  showFriendsList: boolean = false; // Toggle for friends list

  constructor(
    private petService: PetService,
    private matchsService: MatchsService,
    private messagingService: MessagingService,
  //  private chatWebSocketService: ChatWebSocketService,
  //  private WebSocketService: WebSocketService,

    private router: Router
  ) {
    const userId = localStorage.getItem('userId');
    this.ownerId = userId ? parseInt(userId, 10) : null;
    if (!this.ownerId || !localStorage.getItem('token')) {
      console.error('No userId or token found in localStorage');
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    this.loadUserPets();
    this.loadAllAvailablePets();
    this.checkPendingMatches();
    this.loadMatchedFriends(); // Load placeholder data
  }

  toggleFriendsList() {
    this.showFriendsList = !this.showFriendsList;
  }

  loadUserPets() {
    if (!this.ownerId) {
      console.error('No ownerId available');
      this.isLoading = false;
      return;
    }
    this.petService.getPetsByOwnerId(this.ownerId).subscribe({
      next: (data) => {
        this.petList = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading user pets:', err);
        this.isLoading = false;
        if (err.status === 403) {
          alert('Accès refusé : veuillez vous reconnecter.');
          this.router.navigate(['/login']);
        }
      }
    });
  }

  loadAllAvailablePets() {
    this.petService.getPetsByStatus('AVAILABLE').subscribe({
      next: (data) => {
        this.matchingPets = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading all available pets:', err);
        this.matchingPets = [];
        this.isLoading = false;
        if (err.status === 403) {
          alert('Accès refusé : veuillez vous reconnecter.');
          this.router.navigate(['/login']);
        }
      }
    });
  }

  togglePetDropdown() {
    this.showPetDropdown = !this.showPetDropdown;
  }

  selectPet(pet: any) {
    this.selectedPet = pet;
    this.showPetDropdown = false;
    this.showPreferencesForm = false;
    this.resetPreferencesForm();
    this.checkPreferences(pet.idPet);
  }

  resetPreferencesForm() {
    this.newPreferences = {
      preferred_breed: '',
      min_age: 0,
      max_age: 0,
      preferred_gender: '',
      preferred_location: ''
    };
    this.currentPreferences = null;
  }

  togglePreferencesForm() {
    this.showPreferencesForm = !this.showPreferencesForm;
    if (this.showPreferencesForm && this.currentPreferences) {
      this.newPreferences = { ...this.currentPreferences };
    } else {
      this.resetPreferencesForm();
    }
  }

  checkPreferences(petId: number) {
    this.petService.checkPetPreferences(petId).subscribe({
      next: (response) => {
        if (response.hasPreferences) {
          this.matchingPets = response.matchingPets || [];
          this.currentPreferences = response.preferences;
        } else {
          this.matchingPets = [];
          this.currentPreferences = null;
        }
      },
      error: (err) => {
        console.error('Erreur lors de la vérification des préférences:', err);
        this.matchingPets = [];
        this.currentPreferences = null;
        if (err.status === 403) {
          alert('Accès refusé : veuillez vous reconnecter.');
          this.router.navigate(['/login']);
        }
      }
    });
  }

  savePreferences() {
    if (!this.selectedPet) {
      alert('Veuillez sélectionner un animal avant d’enregistrer les préférences.');
      return;
    }
    const preferencesToSave = { ...this.newPreferences, pet: { idPet: this.selectedPet.idPet } };
    this.petService.addPreferences(preferencesToSave).subscribe({
      next: (response) => {
        this.showPreferencesForm = false;
        this.checkPreferences(this.selectedPet.idPet);
      },
      error: (err) => {
        console.error('Erreur lors de l’enregistrement des préférences:', err);
        if (err.status === 403) {
          this.router.navigate(['/login']);
        } else {
          alert('Erreur lors de l’enregistrement des préférences.');
        }
      }
    });
  }

  showPreferences() {
    if (this.currentPreferences) {
      this.showPreferencesForm = false;
    } else if (this.selectedPet) {
      this.petService.getPreferencesByPetId(this.selectedPet.idPet).subscribe({
        next: (preferences) => {
          this.currentPreferences = preferences;
          this.showPreferencesForm = false;
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des préférences:', err);
          if (err.status === 403) {
            this.router.navigate(['/login']);
          }
        }
      });
    }
  }

  editPreferences() {
    if (this.currentPreferences) {
      this.newPreferences = { ...this.currentPreferences };
      this.showPreferencesForm = true;
    }
  }

  deletePreferences() {
    if (!this.currentPreferences || !this.currentPreferences.id_preference) {
      alert('Aucune préférence sélectionnée à supprimer');
      return;
    }
    if (confirm('Voulez-vous vraiment supprimer ces préférences ?')) {
      this.petService.deletePreferences(this.currentPreferences.id_preference).subscribe({
        next: () => {
          this.currentPreferences = null;
          this.showPreferencesForm = false;
          this.matchingPets = [];
          this.checkPreferences(this.selectedPet.idPet);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression des préférences:', err);
          if (err.status === 403) {
            this.router.navigate(['/login']);
          }
        }
      });
    }
  }

  matchPet(match: any) {
    if (!this.selectedPet) {
      alert('Please select a pet before matching.');
      return;
    }
    this.matchsService.createMatch(this.selectedPet.idPet, match.idPet).subscribe({
      next: (response) => {
        alert(`You have matched ${this.selectedPet.petName} with ${match.petName}!`);
        this.checkPreferences(this.selectedPet.idPet);
        this.checkPendingMatches();
      },
      error: (err) => {
        console.error('Error creating match:', err);
        if (err.status === 400) {
          alert('Matching already exists with ' + match.petName + '!');
        } else if (err.status === 403) {
          this.router.navigate(['/login']);
        } else {
          alert('An error occurred while matching.');
        }
      }
    });
  }

  checkPendingMatches() {
    this.matchsService.getPendingMatches().subscribe({
      next: (matches) => {
        this.pendingMatches = matches;
        this.notificationCount = matches.length;
      },
      error: (err) => {
        console.error('Error loading pending matches:', err);
        if (err.status === 403) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  togglePendingMatches() {
    this.showPendingMatches = !this.showPendingMatches;
  }

  acceptMatch(matchId: number) {
    this.matchsService.acceptMatch(matchId).subscribe({
      next: (response) => {
        const acceptedMatch = this.pendingMatches.find(match => match.id_match === matchId);
        if (acceptedMatch) {
          this.matchedPet1 = acceptedMatch.pet_1;
          this.matchedPet2 = acceptedMatch.pet_2;
          this.showMatchConfirmation = true;
        }
        this.checkPendingMatches();
        this.loadMatchedFriends(); // Refresh placeholder data
      },
      error: (err) => {
        console.error('Error accepting match:', err);
        if (err.status === 403) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  deleteMatch(matchId: number) {
    if (confirm('Are you sure you want to delete this match?')) {
      this.matchsService.deleteMatch(matchId).subscribe({
        next: () => {
          this.checkPendingMatches();
          this.loadMatchedFriends(); // Refresh placeholder data
        },
        error: (err) => {
          console.error('Error deleting match:', err);
          if (err.status === 403) {
            this.router.navigate(['/login']);
          }
        }
      });
    }
  }

  viewPetDetails(match: any) {
    if (match && match.idPet) {
      this.router.navigate(['/pet-details', match.idPet]);
    }
  }

  viewPendingPetDetails(match: any, petType: 'pet_1' | 'pet_2') {
    const pet = match[petType];
    if (pet && pet.idPet) {
      this.router.navigate(['/pet-details', pet.idPet]);
    }
  }

  closeMatchConfirmation() {
    this.showMatchConfirmation = false;
    this.matchedPet1 = null;
    this.matchedPet2 = null;
  }

  sendMessage() {
    if (this.matchedPet1 && this.matchedPet2) {
      // Déterminer quel pet appartient à l'autre utilisateur
      const friendPet = this.matchedPet1.user?.id_user === this.ownerId ? this.matchedPet2 : this.matchedPet1;
      const friend: FriendWithPets = {
        user: friendPet.user,
        matchedPets: [friendPet]
      };
      this.openChat(friend, friendPet);
      this.closeMatchConfirmation();
    }
  }

  loadMatchedFriends() {
    this.matchsService.getAcceptedFriends().subscribe(
      (friends: FriendWithPets[]) => {
        this.matchedFriends = friends.map(friend => ({
          user: friend.user,
          matchedPets: friend.matchedPets.map(pet => ({
            idPet: pet.idPet,
            petName: pet.petName,
            breed: pet.breed || 'Not specified',
            petImage: pet.petImage || '../../../../assets/images/pet/11416.jpg'
          }))
        }));
        console.log('Amis chargés avec tous leurs pets:', this.matchedFriends);
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des amis:', error);
        this.matchedFriends = [];
      }
    );
  }

  openChat(friend: FriendWithPets, pet: Pet) {
    // Sélectionner le premier pet par défaut (ou implémenter une logique pour choisir un pet spécifique)
    this.selectedFriend = {
      user: friend.user,
      petName: pet.petName, // Prendre le nom du premier pet
      matchedPets: friend.matchedPets
    };
    this.showChat = true;
    this.showFriendsList = true;
    this.loadChatMessages(friend);
  }

  closeChat() {
    this.showChat = false;
    this.selectedFriend = null;
    this.chatMessages = [];
  }

  loadChatMessages(friend: FriendWithPets) {
    // Simuler des messages pour le moment (à remplacer par un appel API si nécessaire)
    this.chatMessages = [
      { content: `Hey, ${friend.matchedPets[0]?.petName} et mon pet sont amis maintenant !`, isSent: false, timestamp: new Date() },
      { content: 'Oui, trop cool !', isSent: true, timestamp: new Date() }
    ];
  }

  sendChatMessage() {
    if (this.newMessage.trim()) {
      this.chatMessages.push({
        content: this.newMessage,
        isSent: true,
        timestamp: new Date()
      });
      this.newMessage = '';
    }
  }
}
