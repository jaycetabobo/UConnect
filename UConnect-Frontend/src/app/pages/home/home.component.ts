import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AnnouncementsApiService } from '../../core/services/announcements/announcements-api.service';
import type { Announcement } from '../../core/models/announcements/announcement.models';

@Component({
  selector: 'app-home',
  imports: [CommonModule, DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly announcementsApi = inject(AnnouncementsApiService);

  protected readonly announcements = signal<Announcement[]>([]);
  protected readonly loading = signal(false);

  protected readonly highPriorityCount = computed(
    () =>
      this.announcements().filter((item) => item.priority === 'HIGH' || item.priority === 'URGENT')
        .length,
  );

  async ngOnInit() {
    this.loading.set(true);
    try {
      const items = await this.announcementsApi.getAnnouncements(false);
      this.announcements.set(items);
    } finally {
      this.loading.set(false);
    }
  }
}
