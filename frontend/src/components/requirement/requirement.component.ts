import { Component } from '@angular/core';
import { Requirement } from '../../models/requirement.model';
import { RequirementService } from '../../services/requirement.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'requirement',
  imports: [CommonModule],
  templateUrl: './requirement.component.html',
  styleUrls: ['./requirement.component.css'],
})
export class RequirementComponent {
  isRecording = false;
  transcript = '';
  // recognition: SpeechRecognition | null = null;
  requirements: Requirement[] = [];
  loading = false;

  constructor(private requirementService: RequirementService) {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;
    console.log('SpeechRecognition:', SpeechRecognition);
    /* if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'hu-HU';
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        const result = event.results[0][0].transcript;
        this.transcript = result;
        this.sendTranscript();
      };

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event);
      };
    } else {
      console.warn('Speech recognition not supported in this browser.');
    }*/
  }

  startRecording() {
    /* if (this.recognition) {
      this.transcript = '';
      this.recognition.start();
      this.isRecording = true;
    }*/
  }

  stopRecording() {
    /*   if (this.recognition) {
      this.recognition.stop();
      this.isRecording = false;
    }*/
  }

  sendTranscript() {
    if (!this.transcript.trim()) return;

    this.loading = true;
    this.requirementService.submitTextForParsing(this.transcript).subscribe({
      next: (res) => {
        this.requirements = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Hiba történt a feldolgozás során', err);
        this.loading = false;
      },
    });
  }

  accept() {
    this.requirementService.submitToQueue(this.requirements).subscribe({
      next: () => {
        this.reset();
      },
      error: (err) => {
        console.error('Hiba a queue-ba küldés során', err);
      },
    });
  }

  reject() {
    this.reset();
  }

  reset() {
    this.transcript = '';
    this.requirements = [];
  }
}
