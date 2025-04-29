import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { PetService } from 'src/app/services/matchingService/pet.service';
import { MatchsService } from 'src/app/services/matchingService/matchs.service';
import { MessagingService } from 'src/app/services/matchingService/messaging.service';
import { ChatWebSocketService } from 'src/app/services/matchingService/chat-web-socket.service';
import { BlockedUserService } from 'src/app/services/matchingService/BlockedUserService';
import { NotificationMatchService } from 'src/app/services/matchingService/NotificationMatchService';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { Subscription } from 'rxjs';
import { ChatMessage } from 'src/app/models/matching/chat-message';
import { FriendWithPets } from 'src/app/models/matching/friend-with-pets';
import { Pet } from 'src/app/models/pet/Pet';
import { Notification } from 'src/app/models/matching/notification';
import { ReqRes } from 'src/app/models/matching/ReqRes';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  currentPreferences: any = null;
  notifications: Notification[] = [];
  notificationCount: number = 0;
  ownerId: number | null = null;
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
  showBlockedUsers: boolean = false;
  blockedUsers: { id: number; username: string; email?: string }[] = [];
  private previousPendingMatches: any[] = [];
  private messagesSubscription: Subscription | null = null;
  private notificationsSubscription: Subscription | null = null;
  private currentMatchId: number | null = null;
  map!: L.Map;
  isMapInitialized: boolean = false;
  private currentMarker: L.Marker | null = null;
  private coords: { lat: number; lng: number } | null = null;
  preferencesForm: FormGroup;

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  constructor(
    private petService: PetService,
    private matchsService: MatchsService,
    private messagingService: MessagingService,
    private chatWebSocketService: ChatWebSocketService,
    private notificationMatchService: NotificationMatchService,
    private router: Router,
    private http: HttpClient,
    private blockedUserService: BlockedUserService,
    private fb: FormBuilder
  ) {
    const userId = localStorage.getItem('userId');
    this.ownerId = userId ? parseInt(userId, 10) : null;
    if (!this.ownerId || !localStorage.getItem('token')) {
      console.error('No userId or token found in localStorage');
      this.router.navigate(['/login']);
    }
    this.preferencesForm = this.fb.group({
      preferred_breed: ['', Validators.required],
      min_age: [null, [Validators.required, Validators.min(0)]],
      max_age: [null, [Validators.required, Validators.min(0)]],
      preferred_gender: ['', Validators.required],
      preferred_location: ['', Validators.required]
    }, { validators: this.ageValidator });
  }

  ngOnInit() {
    this.loadUserPets();
    this.loadFilteredPets();
    this.checkNotifications();
    this.loadMatchedFriends();
    this.loadBlockedUsers();
    setInterval(() => this.checkNotifications(), 30000);
    this.messagesSubscription = this.chatWebSocketService.getMessages().subscribe(messages => {
      console.log('Chat messages updated:', messages);
      this.chatMessages = messages;
      this.scrollToBottom();
    });
    this.notificationsSubscription = this.notificationMatchService.getNotifications().subscribe((notifications: Notification[]) => {
      console.log('Received notifications from NotificationMatchService:', notifications);
      notifications.forEach((notification: Notification) => {
        this.handleWebSocketNotification(notification);
      });
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
    if (this.notificationsSubscription) {
      this.notificationsSubscription.unsubscribe();
    }
    if (this.map) {
      this.map.remove();
    }
  }

  ageValidator(form: FormGroup) {
    const minAge = form.get('min_age')?.value;
    const maxAge = form.get('max_age')?.value;
    if (minAge !== null && maxAge !== null && minAge >= maxAge) {
      return { ageInvalid: true };
    }
    return null;
  }

  loadBlockedUsers() {
    if (!this.ownerId) {
      console.error('No ownerId available for fetching blocked users');
      return;
    }
    this.blockedUserService.getBlockedUsers(this.ownerId).subscribe({
      next: (response: ReqRes) => {
        if (response.statusCode === 200 && response.ourUsersList) {
          this.blockedUsers = response.ourUsersList.map(user => ({
            id: user.id_user,
            username: user.name,
            email: user.email || undefined
          }));
          console.log('Blocked users loaded:', this.blockedUsers);
        } else {
          this.blockedUsers = [];
          console.warn('No blocked users found or invalid response:', response);
        }
      },
      error: (err: any) => {
        console.error('Error loading blocked users:', err);
        this.blockedUsers = [];
        if (err.status === 403) {
          alert('Accès refusé : veuillez vous reconnecter.');
          this.router.navigate(['/login']);
        }
      }
    });
  }

  toggleFriendsList() {
    this.showFriendsList = !this.showFriendsList;
  }

  toggleBlockedUsers() {
    this.showBlockedUsers = !this.showBlockedUsers;
  }

  private handleWebSocketNotification(notification: Notification): void {
    console.log('Processing notification:', notification);
    if (notification.type === 'ACCEPTED') {
      if (this.blockedUsers.some(user => user.id === notification.senderId)) {
        console.log('Ignoring notification from blocked user:', notification.senderId);
        return;
      }
      const acceptedNotification: Notification = {
        id: notification.id || `match-accept-${notification.matchId}`,
        type: 'accepted',
        message: notification.message,
        match: null,
        matchId: notification.matchId,
        timestamp: new Date(notification.timestamp),
        senderId: notification.senderId
      };
      this.notifications.unshift(acceptedNotification);
      this.notificationCount = this.notifications.length;
      console.log('Added accepted notification:', acceptedNotification);
      this.showNotifications = true;
      alert(`Nouveau match accepté ! ${notification.message}`);
    } else {
      console.log('Unhandled notification type:', notification.type);
    }
  }

  blockUser(friend: any) {
    if (!this.ownerId || !friend.user.id_user) {
      console.error('Cannot block user: missing ownerId or friend user ID');
      return;
    }
    if (this.blockedUsers.some(user => user.id === friend.user.id_user)) {
      console.log('User is already blocked:', friend.user.id_user);
      return;
    }

    this.blockedUserService.blockUser(this.ownerId, friend.user.id_user).subscribe({
      next: (response: ReqRes) => {
        if (response.statusCode === 200) {
          this.blockedUsers.push({
            id: friend.user.id_user,
            username: friend.user.username || 'Unknown',
            email: friend.user.email || undefined
          });
          console.log('User blocked:', friend.user.id_user);
          if (this.selectedFriend && this.selectedFriend.user.id_user === friend.user.id_user) {
            this.closeChat();
          }
          this.loadFilteredPets();
          this.checkNotifications();
          this.loadMatchedFriends();
          if (this.showMatchConfirmation && (this.matchedPet1?.user?.id_user === friend.user.id_user || this.matchedPet2?.user?.id_user === friend.user.id_user)) {
            this.closeMatchConfirmation();
          }
        } else {
          console.error('Failed to block user:', response.message);
          alert('Erreur lors du blocage de l’utilisateur.');
        }
      },
      error: (err: any) => {
        console.error('Error blocking user:', err);
        if (err.status === 403) {
          alert('Accès refusé : veuillez vous reconnect grandes lignes reconnecter.');
          this.router.navigate(['/login']);
        } else {
          alert('Erreur lors du blocage de l’utilisateur.');
        }
      }
    });
  }

  unblockUser(userId: number) {
    if (!this.ownerId) {
      console.error('Cannot unblock user: missing ownerId');
      return;
    }
    this.blockedUserService.unblockUser(this.ownerId, userId).subscribe({
      next: (response: ReqRes) => {
        if (response.statusCode === 200) {
          const user = this.blockedUsers.find(u => u.id === userId);
          this.blockedUsers = this.blockedUsers.filter(u => u.id !== userId);
          console.log('User unblocked:', userId, user?.username, user?.email);
          this.loadFilteredPets();
          this.checkNotifications();
          this.loadMatchedFriends();
        } else {
          console.error('Failed to unblock user:', response.message);
          alert('Erreur lors du déblocage de l’utilisateur.');
        }
      },
      error: (err: any) => {
        console.error('Error unblocking user:', err);
        if (err.status === 403) {
          alert('Accès refusé : veuillez vous reconnecter.');
          this.router.navigate(['/login']);
        } else {
          alert('Erreur lors du déblocage de l’utilisateur.');
        }
      }
    });
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
      error: (err: any) => {
        console.error('Error loading user pets:', err);
        this.isLoading = false;
        if (err.status === 403) {
          alert('Accès refusé : veuillez vous reconnecter.');
          this.router.navigate(['/login']);
        }
      }
    });
  }

  loadFilteredPets() {
    this.isLoading = true;
    if (!this.ownerId) {
      console.error('No ownerId available');
      this.isLoading = false;
      return;
    }
    this.petService.getPetsByStatusWithBlockFilter('AVAILABLE', this.ownerId).subscribe({
      next: (data) => {
        if (this.selectedPet) {
          this.matchingPets = data.filter((pet: { species: string; gender: string; ownerId: number | null }) =>
            pet.species?.toLowerCase() === this.selectedPet.species?.toLowerCase() &&
            pet.gender?.toLowerCase() !== this.selectedPet.gender?.toLowerCase() &&
            pet.ownerId !== this.ownerId &&
            !this.blockedUsers.some(user => user.id === pet.ownerId)
          );
        } else {
          this.matchingPets = data.filter((pet: { ownerId: number | null }) =>
            pet.ownerId !== this.ownerId &&
            !this.blockedUsers.some(user => user.id === pet.ownerId)
          );
        }
        console.log('Filtered pets:', this.matchingPets);
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading filtered pets:', err);
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
    this.loadFilteredPets();
  }

  resetPreferencesForm() {
    this.preferencesForm.reset({
      preferred_breed: '',
      min_age: null,
      max_age: null,
      preferred_gender: '',
      preferred_location: ''
    });
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

      this.reverseGeocode(coords.lat, coords.lng, (address) => {
        this.preferencesForm.patchValue({ preferred_location: address });
        console.log('Geocoded address:', address);
      });

      if (this.currentMarker) {
        this.map.removeLayer(this.currentMarker);
      }

      this.currentMarker = L.marker([coords.lat, coords.lng], { icon: customIcon })
        .addTo(this.map)
        .bindPopup(`Selected Location: ${this.preferencesForm.get('preferred_location')?.value || 'Loading address...'}`)
        .openPopup();
    });
  }

  reverseGeocode(lat: number, lng: number, callback: (address: string) => void): void {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`;
    this.http.get(url).subscribe({
      next: (response: any) => {
        const address = response.display_name || `Lat: ${lat}, Lng: ${lng}`;
        callback(address);
      },
      error: (err: any) => {
        console.error('Error during reverse geocoding:', err);
        callback(`Lat: ${lat}, Lng: ${lng}`);
      }
    });
  }

  checkPreferences(petId: number) {
    this.petService.checkPetPreferences(petId).subscribe({
      next: (response) => {
        console.log('Preferences checked:', JSON.stringify(response));
        if (response.hasPreferences) {
          this.matchingPets = response.matchingPets?.filter((pet: any) =>
            !this.blockedUsers.some(user => user.id === pet.ownerId)
          ) || [];
          this.currentPreferences = response.preferences;
          this.preferencesForm.patchValue({
            preferred_breed: this.currentPreferences.preferred_breed,
            min_age: this.currentPreferences.min_age,
            max_age: this.currentPreferences.max_age,
            preferred_gender: this.currentPreferences.preferred_gender,
            preferred_location: this.currentPreferences.preferred_location
          });
          if (this.currentPreferences.preferred_location && this.currentPreferences.preferred_location.includes('Lat:')) {
            const [lat, lng] = this.currentPreferences.preferred_location
              .replace('Lat: ', '')
              .replace('Lng: ', '')
              .split(', ')
              .map((val: string) => parseFloat(val));
            this.coords = { lat, lng };
          }
        } else {
          this.currentPreferences = null;
          this.loadFilteredPets();
        }
      },
      error: (err: any) => {
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
    if (this.preferencesForm.invalid) {
      this.preferencesForm.markAllAsTouched();
      return;
    }
    const preferencesToSave = {
      id_preference: this.currentPreferences?.id_preference || null,
      preferred_breed: this.preferencesForm.get('preferred_breed')?.value,
      min_age: this.preferencesForm.get('min_age')?.value,
      max_age: this.preferencesForm.get('max_age')?.value,
      preferred_gender: this.preferencesForm.get('preferred_gender')?.value,
      preferred_location: this.preferencesForm.get('preferred_location')?.value,
      pet: { idPet: this.selectedPet.idPet }
    };
    console.log('Saving preferences:', JSON.stringify(preferencesToSave));
    this.petService.addPreferences(preferencesToSave).subscribe({
      next: (response) => {
        console.log('Preferences saved:', JSON.stringify(response));
        this.showPreferencesForm = false;
        this.checkPreferences(this.selectedPet.idPet);
      },
      error: (err: any) => {
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
          this.preferencesForm.patchValue({
            preferred_breed: preferences.preferred_breed,
            min_age: preferences.min_age,
            max_age: preferences.max_age,
            preferred_gender: preferences.preferred_gender,
            preferred_location: preferences.preferred_location
          });
          if (preferences.preferred_location && preferences.preferred_location.includes('Lat:')) {
            const [lat, lng] = preferences.preferred_location
              .replace('Lat: ', '')
              .replace('Lng: ', '')
              .split(', ')
              .map((val: string) => parseFloat(val));
            this.coords = { lat, lng };
          }
          this.showPreferencesForm = false;
        },
        error: (err: any) => {
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
      this.preferencesForm.patchValue({
        preferred_breed: this.currentPreferences.preferred_breed,
        min_age: this.currentPreferences.min_age,
        max_age: this.currentPreferences.max_age,
        preferred_gender: this.currentPreferences.preferred_gender,
        preferred_location: this.currentPreferences.preferred_location
      });
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
        error: (err: any) => {
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
    if (this.blockedUsers.some(user => user.id === match.ownerId)) {
      alert('Vous ne pouvez pas matcher avec un utilisateur bloqué.');
      return;
    }
    this.matchsService.createMatch(this.selectedPet.idPet, match.idPet).subscribe({
      next: (response) => {
        alert(`You have matched ${this.selectedPet.petName} with ${match.petName}!`);
        this.checkPreferences(this.selectedPet.idPet);
        this.checkNotifications();
      },
      error: (err: any) => {
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
        const pendingNotifications: Notification[] = matches
          .filter(match =>
            !this.blockedUsers.some(user => user.id === match.pet_1?.user?.id_user) &&
            !this.blockedUsers.some(user => user.id === match.pet_2?.user?.id_user)
          )
          .map((match) => ({
            id: match.id_match,
            type: 'pending',
            message: `${match.pet_1.petName} wants to match with ${match.pet_2.petName}`,
            match: match,
            timestamp: new Date()
          }));
        this.notifications = [...pendingNotifications];
        this.notificationCount = this.notifications.length;
        this.previousPendingMatches = matches;
      },
      error: (err: any) => {
        console.error('Error loading notifications:', err);
        // if (err.status === 403) {
        //   alert('Accès refusé : veuillez vous reconnecter.');
        //   this.router.navigate(['/login']);
        // }
      }
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
          if (this.blockedUsers.some(user => user.id === acceptedMatch.pet_1?.user?.id_user) ||
              this.blockedUsers.some(user => user.id === acceptedMatch.pet_2?.user?.id_user)) {
            this.notifications = this.notifications.filter((n) => n.id !== matchId);
            this.notificationCount = this.notifications.length;
            return;
          }
          this.notifications = this.notifications.filter((n) => n.id !== matchId);
          this.notificationCount = this.notifications.length;
          this.matchedPet1 = acceptedMatch.pet_1;
          this.matchedPet2 = acceptedMatch.pet_2;
          this.showMatchConfirmation = true;
        }
        this.loadMatchedFriends();
      },
      error: (err: any) => {
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
          this.notifications = this.notifications.filter(
            (n) => n.match?.id_match !== matchId
          );
          this.notificationCount = this.notifications.length;
          this.loadMatchedFriends();
        },
        error: (err: any) => {
          console.error('Error deleting match:', err);
          if (err.status === 403) {
            this.router.navigate(['/login']);
          }
        }
      });
    }
  }

  dismissNotification(notificationId: number | string) {
    this.notifications = this.notifications.filter((n) => n.id !== notificationId);
    this.notificationCount = this.notifications.length;
  }

  viewPetDetails(match: any) {
    if (match && match.idPet && !this.blockedUsers.some(user => user.id === match.ownerId)) {
      this.router.navigate(['/pet-details', match.idPet]);
    }
  }

  viewPendingPetDetails(match: any, petType: 'pet_1' | 'pet_2') {
    const pet = match[petType];
    if (pet && pet.idPet && !this.blockedUsers.some(user => user.id === pet.user?.id_user)) {
      this.router.navigate(['/pet-details', pet.idPet]);
    }
  }

  closeMatchConfirmation() {
    this.showMatchConfirmation = false;
    this.matchedPet1 = null;
    this.matchedPet2 = null;
  }

  generateBabyPhoto() {
    if (this.matchedPet1 && this.matchedPet2) {
      if (this.blockedUsers.some(user => user.id === this.matchedPet1.user?.id_user) ||
          this.blockedUsers.some(user => user.id === this.matchedPet2.user?.id_user)) {
        this.closeMatchConfirmation();
        return;
      }
      this.router.navigate(['/bbypet'], {
        queryParams: {
          petId1: this.matchedPet1.idPet,
          petId2: this.matchedPet2.idPet
        }
      });
    } else {
      console.error('Cannot navigate to baby pet: matched pets not set');
      alert('Erreur : impossible de générer l’image du bébé pet. Veuillez réessayer.');
    }
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
      if (this.blockedUsers.some(user => user.id === friendPet.user.id_user)) {
        this.closeMatchConfirmation();
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
        this.matchedFriends = friends
          .filter(friend => !this.blockedUsers.some(user => user.id === friend.user.id_user))
          .map(friend => ({
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
    if (this.blockedUsers.some(user => user.id === friend.user.id_user)) {
      alert('Vous ne pouvez pas discuter avec un utilisateur bloqué.');
      return;
    }
    this.chatMessages = [];
    this.currentMatchId = null;
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
      error: (err: any) => {
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
    this.chatWebSocketService.disconnect();
  }

  loadChatMessages(matchId: number) {
    this.chatMessages = [];
    this.messagingService.getMessagesForMatch(matchId).subscribe({
      next: (messages) => {
        console.log('Loaded messages for match', matchId, ':', messages);
        const sortedMessages = messages.sort((a, b) =>
          new Date(a.timestamp!).getTime() - new Date(b.timestamp!).getTime()
        );
        this.chatWebSocketService.loadMessages(sortedMessages.map(msg => ({
          ...msg,
          showReactionPicker: false
        })));
      },
      error: (err: any) => {
        console.error('Error loading chat messages:', err);
        this.chatMessages = [];
      }
    });
  }

  sendChatMessage() {
    if (this.newMessage.trim() && this.currentMatchId && this.ownerId && this.selectedFriend) {
      if (this.blockedUsers.some(user => user.id === this.selectedFriend.user.id_user)) {
        alert('Vous ne pouvez pas envoyer de message à un utilisateur bloqué.');
        this.closeChat();
        return;
      }
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

  sendLocation() {
    if (!this.currentMatchId || !this.ownerId || !this.selectedFriend) {
      console.warn('Cannot send location: missing matchId, ownerId, or selectedFriend');
      alert('Erreur : impossible d\'envoyer la localisation. Assurez-vous qu\'une conversation est ouverte.');
      return;
    }
    if (this.blockedUsers.some(user => user.id === this.selectedFriend.user.id_user)) {
      alert('Vous ne pouvez pas envoyer de localisation à un utilisateur bloqué.');
      this.closeChat();
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationMessage = `Ma localisation : ${latitude}, ${longitude}`;

          this.reverseGeocode(latitude, longitude, (address) => {
            const message: ChatMessage = {
              matchId: this.currentMatchId!,
              senderId: this.ownerId!,
              receiverId: this.selectedFriend.user.id_user,
              content: locationMessage,
              type: 'CHAT',
              timestamp: new Date().toISOString(),
              sender: localStorage.getItem('username') || 'unknown',
              recipient: this.selectedFriend.user.username || '',
              address: address
            };

            this.chatWebSocketService.sendChatMessage(message);
            console.log('Location sent:', locationMessage, 'Address:', address);
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Impossible de récupérer votre localisation. Veuillez activer la géolocalisation ou entrer votre position manuellement.');
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      alert('La géolocalisation n\'est pas prise en charge par votre navigateur.');
    }
  }

  sendReaction(message: ChatMessage, reaction: string) {
    if (message.id && this.currentMatchId) {
      if (this.blockedUsers.some(user => user.id === this.selectedFriend?.user.id_user)) {
        alert('Vous ne pouvez pas réagir à un message d\'un utilisateur bloqué.');
        this.closeChat();
        return;
      }
      this.chatWebSocketService.sendReaction(message.id, this.currentMatchId, reaction);
      message.showReactionPicker = false;
    } else {
      console.warn('Cannot send reaction: missing message ID or match ID', {
        messageId: message.id,
        currentMatchId: this.currentMatchId
      });
    }
  }

  showReactionPicker(message: ChatMessage) {
    if (this.blockedUsers.some(user => user.id === this.selectedFriend?.user.id_user)) {
      return;
    }
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

  getGoogleMapsLink(content: string): string {
    const match = content.match(/Ma localisation : (-?\d+\.\d+), (-?\d+\.\d+)/);
    if (match) {
      const lat = match[1];
      const lng = match[2];
      return `https://www.google.com/maps?q=${lat},${lng}`;
    }
    return '#';
  }

  getBlockedUserName(userId: number): string {
    const user = this.blockedUsers.find(u => u.id === userId);
    return user ? (user.username !== 'Unknown' ? user.username : user.email || 'Utilisateur inconnu') : 'Utilisateur inconnu';
  }
}