import { Component, inject } from '@angular/core';
import { QueueStatus } from '../../types/queue.status.type';
import { QueueItem } from '../../models/queue.item.model';
import { RequirementService } from '../../services/requirement.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-queue-viewer',
  imports: [CommonModule, FormsModule],
  templateUrl: './queue-viewer.component.html',
  styleUrls: ['./queue-viewer.component.css'],
})
export class QueueViewerComponent {
  queue: QueueItem[] = [];
  selectedStatus: QueueStatus = 'completed'; // default status

  private requirementService = inject(RequirementService);

  constructor() {
    this.loadQueue();
  }

  loadQueue() {
    this.requirementService
      .getQueueByStatus(this.selectedStatus)
      .subscribe((queue) => {
        this.queue = queue;
      });
  }

  onStatusChange(status: QueueStatus) {
    this.selectedStatus = status;
    this.loadQueue();
  }
}
