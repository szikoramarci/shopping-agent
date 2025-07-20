import { Component } from '@angular/core';
import { Requirement } from '../../models/requirement.model';
import { RequirementService } from '../../services/requirement.service';
import { CommonModule } from '@angular/common';
import { VoiceRecognitionService } from '../../services/voice-recognition.service';

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
  requirements: Requirement[] = [];
  loading = false;

  constructor(
    public voiceRecognitionService: VoiceRecognitionService,
    private requirementService: RequirementService
  ) {
    this.voiceRecognitionService.init();
  }

  startRecording() {
    this.voiceRecognitionService.start();
    this.isRecording
  }

  stopRecording() {
    this.voiceRecognitionService.stop();
    this.isRecording = false;
    this.transcript += this.voiceRecognitionService.text;
    this.voiceRecognitionService.text = '';
    this.sendTranscript();
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
