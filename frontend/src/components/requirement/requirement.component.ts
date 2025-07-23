import { inject, Inject, signal } from '@angular/core';
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
  isRecording = signal(false);
  transcript = signal('');
  requirements = signal<Requirement[]>([]);
  loading = signal(false);

  private voiceRecognitionService = inject(VoiceRecognitionService);
  private requirementService = inject(RequirementService);

  constructor() {
    this.voiceRecognitionService.init();
  }

  startRecording() {
    this.voiceRecognitionService.start();
    this.isRecording.set(true)
  }

  stopRecording() {
    this.voiceRecognitionService.stop();
    this.isRecording.set(false);

    const recognized = this.voiceRecognitionService.text;
    this.transcript.update((prev) => prev + ' ' + recognized);
    this.voiceRecognitionService.text = '';

    this.sendTranscript();
  }

  sendTranscript() {
    if (!this.transcript().trim()) return;

    this.loading.set(true)
    this.requirementService.submitTextForParsing(this.transcript()).subscribe({
      next: (res) => {
        this.requirements.set(res)
      },
      error: (err) => {
        console.error('Hiba történt a feldolgozás során', err);        
      },
      complete: () => {
        this.transcript.set('')
        this.loading.set(false)
      }
    });
  }

  accept() {
    this.requirementService.submitToQueue(this.requirements()).subscribe({
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
    this.transcript.set('')
    this.requirements.set([])
  }

  trackByProduct = (index: number, item: Requirement) => item.product;

}
