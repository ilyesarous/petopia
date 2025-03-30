import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chatbot',
  template: '<div id="chatbot-container"></div>',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  ngOnInit() {
    const script1 = document.createElement('script');
    script1.src = 'https://cdn.botpress.cloud/webchat/v2.2/inject.js';
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://files.bpcontent.cloud/2025/03/06/23/20250306231403-UST3CGWK.js';
    document.body.appendChild(script2);
  }
}
