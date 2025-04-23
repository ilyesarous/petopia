import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

declare var JitsiMeetExternalAPI: any;


@Component({
  selector: 'app-video-consultation',
  templateUrl: './video-consultation.component.html',
  styleUrls: ['./video-consultation.component.css']
})
export class VideoConsultationComponent implements OnInit, OnDestroy {
  meetingId!: string;
  private api: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.meetingId = params['meetingId'];
      this.initializeJitsi();
    });
  }

  ngOnDestroy(): void {
    if (this.api) {
      this.api.dispose();
    }
  }

  initializeJitsi(): void {
    // Charger le script Jitsi
    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.onload = () => this.loadJitsi();
    document.body.appendChild(script);
  }

  loadJitsi(): void {
    const options = {
      roomName: this.meetingId,
      width: '100%',
      height: '100%',
      parentNode: document.querySelector('#jitsi-container'),
      configOverwrite: {
        startWithAudioMuted: true,
        startWithVideoMuted: false,
        toolbarButtons: [
          'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
          'hangup', 'profile', 'chat', 'settings', 'raisehand'
        ],
        colors: {
          activeSpeaker: '#F83182', // Rose
          toolbarBackground: '#FF617C', // Orange
          toolbarButton: '#FE9A7A' // Jaune
        }
      },
      interfaceConfigOverwrite: {
        APP_NAME: 'VetMeet',
        SHOW_CHROME_EXTENSION_BANNER: false,
        MOBILE_APP_PROMO: false
      },
      userInfo: {
        displayName: 'Utilisateur'
      }
    };

    this.api = new JitsiMeetExternalAPI('meet.jit.si', options);
  }
}
 