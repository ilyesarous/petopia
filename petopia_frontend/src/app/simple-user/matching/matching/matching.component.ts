import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { PetService } from 'src/app/services/matchingService/pet.service';
import { MatchsService } from 'src/app/services/matchingService/matchs.service';
import { MessagingService } from 'src/app/services/matchingService/messaging.service';
import { ChatWebSocketService } from 'src/app/services/matchingService/chat-web-socket.service';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { Subscription } from 'rxjs';
import { ChatMessage } from 'src/app/models/matching/chat-message';
import { FriendWithPets } from 'src/app/models/matching/friend-with-pets';
import { Pet } from 'src/app/models/pet/Pet';
import { Notification } from 'src/app/models/matching/notification';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';

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
    ]),
    trigger('pickerAnimation', [
      state('void', style({ opacity: 0, transform: 'scale(0.8) translateY(10px)' })),
      transition(':enter', [
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.8) translateY(10px)' }))
      ])
    ]),
    trigger('reactionAnimation', [
      transition(':enter', [
        animate('300ms ease-out', keyframes([
          style({ transform: 'scale(0.5)', opacity: 0, offset: 0 }),
          style({ transform: 'scale(1.2)', opacity: 1, offset: 0.7 }),
          style({ transform: 'scale(1)', opacity: 1, offset: 1 })
        ]))
      ])
    ])
  ]
})
export class MatchingComponent implements OnInit, OnDestroy, AfterViewInit {
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
  notifications: Notification[] = [];
  notificationCount: number = 0;
  ownerId: number | null;
  showMatchConfirmation: boolean = false;
  matchedPet1: any = null;
  matchedPet2: any = null;
  matchedFriends: any[] = [];
  showChat: boolean = false;
  selectedFriend: any = null;
  chatMessages: ChatMessage[] = [];
  newMessage: string = '';
  showFriendsList: boolean = false;
  showNotifications: boolean = false;
  private previousPendingMatches: any[] = [];
  private messagesSubscription: Subscription | null = null;
  private currentMatchId: number | null = null;
  map!: L.Map;
  isMapInitialized: boolean = false;
  private currentMarker: L.Marker | null = null;
  private coords: { lat: number; lng: number } | null = null;

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  constructor(
    private petService: PetService,
    private matchsService: MatchsService,
    private messagingService: MessagingService,
    private chatWebSocketService: ChatWebSocketService,
    private router: Router,
    private http: HttpClient
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
    this.checkNotifications();
    this.loadMatchedFriends();
    setInterval(() => this.checkNotifications(), 30000);
    this.messagesSubscription = this.chatWebSocketService.getMessages().subscribe(messages => {
      console.log('Chat messages updated:', messages);
      this.chatMessages = messages;
      this.scrollToBottom();
    });
  }

  ngAfterViewInit(): void {
    // Map initialization handled in togglePreferencesForm
  }

  ngOnDestroy() {
    this.chatWebSocketService.disconnect();
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
    if (this.map) {
      this.map.remove();
    }
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
    this.coords = null;
  }

  togglePreferencesForm() {
    this.showPreferencesForm = !this.showPreferencesForm;
    if (this.showPreferencesForm) {
      setTimeout(() => {
        console.log('Toggling preferences form, map initialized:', this.isMapInitialized);
        if (!this.isMapInitialized) {
          this.initializeMap();
          this.isMapInitialized = true;
        } else {
          this.map.invalidateSize();
          if (this.coords) {
            this.map.setView([this.coords.lat, this.coords.lng], 13);
            if (this.currentMarker) {
              this.map.removeLayer(this.currentMarker);
            }
            const customIcon = L.icon({
              iconUrl: 'assets/leaflet/images/marker-icon.png',
              shadowUrl: 'assets/leaflet/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            });
            this.currentMarker = L.marker([this.coords.lat, this.coords.lng], { icon: customIcon })
              .addTo(this.map)
              .bindPopup('Selected Location')
              .openPopup();
          }
        }
      }, 100);
    }
  }

  initializeMap(): void {
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      console.error('Map container not found');
      return;
    }

    console.log('Initializing map');
    this.map = L.map('map').setView([48.8566, 2.3522], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(this.map);

    const customIcon = L.icon({
      iconUrl: 'assets/leaflet/images/marker-icon.png',
      shadowUrl: 'assets/leaflet/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const coords = e.latlng;
      this.coords = { lat: coords.lat, lng: coords.lng };
      console.log('Map clicked, coords:', JSON.stringify(this.coords));
      this.reverseGeocode(coords.lat, coords.lng);

      if (this.currentMarker) {
        this.map.removeLayer(this.currentMarker);
      }

      this.currentMarker = L.marker([coords.lat, coords.lng], { icon: customIcon })
        .addTo(this.map)
        .bindPopup('Selected Location')
        .openPopup();
    });
  }

  reverseGeocode(lat: number, lng: number): void {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`;
    this.http.get(url).subscribe({
      next: (response: any) => {
        const address = response.display_name || 'Unknown location';
        this.newPreferences.preferred_location = address;
        console.log('Geocoded location:', address);
      },
      error: (err) => {
        console.error('Error during reverse geocoding:', err);
        this.newPreferences.preferred_location = `Lat: ${lat}, Lng: ${lng}`;
      }
    });
  }

  checkPreferences(petId: number) {
    this.petService.checkPetPreferences(petId).subscribe({
      next: (response) => {
        console.log('Preferences checked:', JSON.stringify(response));
        if (response.hasPreferences) {
          this.matchingPets = response.matchingPets || [];
          this.currentPreferences = response.preferences;
        } else {
          this.matchingPets = [];
          this.currentPreferences = null;
        }
      },
      error: (err) => {
        console.error('Error checking preferences:', err);
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
    const preferencesToSave = {
      id_preference: this.currentPreferences?.id_preference || null,
      preferred_breed: this.newPreferences.preferred_breed,
      min_age: this.newPreferences.min_age,
      max_age: this.newPreferences.max_age,
      preferred_gender: this.newPreferences.preferred_gender,
      preferred_location: this.newPreferences.preferred_location,
      pet: { idPet: this.selectedPet.idPet }
    };
    console.log('Saving preferences:', JSON.stringify(preferencesToSave));
    this.petService.addPreferences(preferencesToSave).subscribe({
      next: (response) => {
        console.log('Preferences saved:', JSON.stringify(response));
        this.showPreferencesForm = false;
        this.checkPreferences(this.selectedPet.idPet);
      },
      error: (err) => {
        console.error('Error saving preferences:', err);
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
          console.log('Preferences retrieved:', JSON.stringify(preferences));
          this.currentPreferences = preferences;
          this.showPreferencesForm = false;
        },
        error: (err) => {
          console.error('Error retrieving preferences:', err);
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
      if (this.currentPreferences.preferred_location && this.currentPreferences.preferred_location.includes('Lat:')) {
        const [lat, lng] = this.currentPreferences.preferred_location
          .replace('Lat: ', '')
          .replace('Lng: ', '')
          .split(', ')
          .map((val: string) => parseFloat(val));
        this.coords = { lat, lng };
      } else {
        this.coords = null;
      }
      this.showPreferencesForm = true;
      setTimeout(() => {
        console.log('Editing preferences, map initialized:', this.isMapInitialized, 'coords:', this.coords);
        if (!this.isMapInitialized) {
          this.initializeMap();
          this.isMapInitialized = true;
        }
        this.map.invalidateSize();
        if (this.coords) {
          this.map.setView([this.coords.lat, this.coords.lng], 13);
          if (this.currentMarker) {
            this.map.removeLayer(this.currentMarker);
          }
          const customIcon = L.icon({
            iconUrl: 'assets/leaflet/images/marker-icon.png',
            shadowUrl: 'assets/leaflet/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
          this.currentMarker = L.marker([this.coords.lat, this.coords.lng], { icon: customIcon })
            .addTo(this.map)
            .bindPopup('Selected Location')
            .openPopup();
        } else {
          this.map.setView([48.8566, 2.3522], 13);
        }
      }, 100);
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
          console.log('Preferences deleted');
          this.currentPreferences = null;
          this.showPreferencesForm = false;
          this.matchingPets = [];
          this.checkPreferences(this.selectedPet.idPet);
        },
        error: (err) => {
          console.error('Error deleting preferences:', err);
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
        this.checkNotifications();
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

  checkNotifications() {
    this.matchsService.getPendingMatches().subscribe({
      next: (matches) => {
        const pendingNotifications: Notification[] = matches.map((match) => ({
          id: match.id_match,
          type: 'pending',
          message: `${match.pet_1.petName} wants to match with ${match.pet_2.petName}`,
          match: match,
          timestamp: new Date(),
        }));

        const acceptedNotifications: Notification[] = [];
        this.previousPendingMatches.forEach((prevMatch) => {
          if (!matches.find((m) => m.id_match === prevMatch.id_match)) {
            const wasPendingForUser =
              prevMatch.pet_1.user?.id_user === this.ownerId ||
              prevMatch.pet_2.user?.id_user === this.ownerId;
            if (wasPendingForUser) {
              const otherPet =
                prevMatch.pet_1.user?.id_user === this.ownerId
                  ? prevMatch.pet_2
                  : prevMatch.pet_1;
              if (
                !this.notifications.some(
                  (n) =>
                    n.type === 'accepted' &&
                    n.match?.id_match === prevMatch.id_match
                )
              ) {
                acceptedNotifications.push({
                  id: `accepted_${prevMatch.id_match}_${Date.now()}`,
                  type: 'accepted',
                  message: `Your match with ${otherPet.petName} was accepted!`,
                  match: prevMatch,
                  timestamp: new Date(),
                });
              }
            }
          }
        });

        this.notifications = [
          ...pendingNotifications,
          ...this.notifications.filter(
            (n) => n.type === 'accepted' && !acceptedNotifications.some((an) => an.match?.id_match === n.match?.id_match)
          ),
          ...acceptedNotifications,
        ];
        this.notificationCount = this.notifications.length;
        this.previousPendingMatches = matches;
      },
      error: (err) => {
        console.error('Error loading notifications:', err);
        if (err.status === 403) {
          alert('Accès refusé : veuillez vous reconnecter.');
          this.router.navigate(['/login']);
        }
      },
    });
  }

  togglePendingMatches() {
    this.showNotifications = !this.showNotifications;
  }

  acceptMatch(matchId: number) {
    this.matchsService.acceptMatch(matchId).subscribe({
      next: (response) => {
        const acceptedMatch = this.notifications.find(
          (n) => n.match && n.match.id_match === matchId
        )?.match;
        if (acceptedMatch) {
          const otherPet =
            acceptedMatch.pet_1.user?.id_user === this.ownerId
              ? acceptedMatch.pet_2
              : acceptedMatch.pet_1;
          const newNotification: Notification = {
            id: `accepted_${matchId}_${Date.now()}`,
            type: 'accepted',
            message: `Your match with ${otherPet.petName} was accepted!`,
            match: acceptedMatch,
            timestamp: new Date(),
          };
          this.notifications = [
            ...this.notifications.filter((n) => n.id !== matchId),
            newNotification,
          ];
          this.notificationCount = this.notifications.length;

          this.matchedPet1 = acceptedMatch.pet_1;
          this.matchedPet2 = acceptedMatch.pet_2;
          this.showMatchConfirmation = true;
        }
        this.loadMatchedFriends();
      },
      error: (err) => {
        console.error('Error accepting match:', err);
        if (err.status === 403) {
          this.router.navigate(['/login']);
        }
      },
    });
  }

  deleteMatch(matchId: number) {
    if (confirm('Are you sure you want to delete this match?')) {
      this.matchsService.deleteMatch(matchId).subscribe({
        next: () => {
          this.notifications = this.notifications.filter(
            (n) => n.match?.id_match !== matchId
          );
          this.notificationCount = this.notifications.length;
          this.loadMatchedFriends();
        },
        error: (err) => {
          console.error('Error deleting match:', err);
          if (err.status === 403) {
            this.router.navigate(['/login']);
          }
        },
      });
    }
  }

  dismissNotification(notificationId: number | string) {
    this.notifications = this.notifications.filter((n) => n.id !== notificationId);
    this.notificationCount = this.notifications.length;
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
    if (!this.matchedPet1 || !this.matchedPet2) {
      console.warn('Cannot send message: matched pets not set');
      return;
    }
    try {
      const friendPet = this.matchedPet1.user?.id_user === this.ownerId ? this.matchedPet2 : this.matchedPet1;
      if (!friendPet || !friendPet.user) {
        console.warn('Invalid friend pet or user data');
        return;
      }
      const friend: FriendWithPets = {
        user: friendPet.user,
        matchedPets: [friendPet]
      };
      this.openChat(friend, friendPet);
      this.closeMatchConfirmation();
    } catch (error) {
      console.error('Error in sendMessage:', error);
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
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des amis:', error);
        this.matchedFriends = [];
      }
    );
  }

  openChat(friend: FriendWithPets, pet: Pet) {
    this.selectedFriend = {
      user: friend.user,
      petName: pet.petName,
      matchedPets: friend.matchedPets
    };
    this.showChat = true;
    this.showFriendsList = true;

    this.matchsService.getAllMatches().subscribe({
      next: (matches) => {
        const match = matches.find(m =>
          m.pet_1?.user && m.pet_2?.user &&
          (
            (m.pet_1.idPet === pet.idPet && m.pet_2.user.id_user === this.ownerId) ||
            (m.pet_2.idPet === pet.idPet && m.pet_1.user.id_user === this.ownerId)
          )
        );
        if (match) {
          this.currentMatchId = match.id_match;
          console.log('Opening chat for match ID:', this.currentMatchId);
          this.loadChatMessages(match.id_match);
          this.chatWebSocketService.subscribeToMatch(match.id_match);
        } else {
          console.error('No matching match found for pet:', pet.idPet);
          this.showChat = false;
        }
      },
      error: (err) => {
        console.error('Error fetching matches:', err);
        this.showChat = false;
      }
    });
  }

  closeChat() {
    this.showChat = false;
    this.selectedFriend = null;
    this.chatMessages = [];
    this.currentMatchId = null;
  }

  loadChatMessages(matchId: number) {
    this.messagingService.getMessagesForMatch(matchId).subscribe({
      next: (messages) => {
        console.log('Loaded messages for match', matchId, ':', messages);
        this.chatWebSocketService.loadMessages(messages.map(msg => ({
          ...msg,
          showReactionPicker: false
        })));
      },
      error: (err) => {
        console.error('Error loading chat messages:', err);
        this.chatMessages = [];
      }
    });
  }

  sendChatMessage() {
    if (this.newMessage.trim() && this.currentMatchId && this.ownerId && this.selectedFriend) {
      const message: ChatMessage = {
        matchId: this.currentMatchId,
        senderId: this.ownerId,
        receiverId: this.selectedFriend.user.id_user,
        content: this.newMessage,
        type: 'CHAT',
        timestamp: new Date().toISOString(),
        sender: localStorage.getItem('username') || 'unknown',
        recipient: this.selectedFriend.user.username || ''
      };
      this.chatWebSocketService.sendChatMessage(message);
      this.newMessage = '';
    } else {
      console.warn('Cannot send chat message: missing data', {
        newMessage: this.newMessage,
        currentMatchId: this.currentMatchId,
        ownerId: this.ownerId,
        selectedFriend: this.selectedFriend
      });
    }
  }

  sendReaction(message: ChatMessage, reaction: string) {
    if (message.id && this.currentMatchId) {
      this.chatWebSocketService.sendReaction(message.id, this.currentMatchId, reaction);
      message.showReactionPicker = false; // Cacher le sélecteur après sélection
    } else {
      console.warn('Cannot send reaction: missing message ID or match ID', {
        messageId: message.id,
        currentMatchId: this.currentMatchId
      });
    }
  }

  showReactionPicker(message: ChatMessage) {
    message.showReactionPicker = true;
  }

  hideReactionPicker(message: ChatMessage) {
    message.showReactionPicker = false;
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }
}