import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommunityEventsService {
  private refreshMenuSource = new Subject<void>();
  refreshMenu$ = this.refreshMenuSource.asObservable();

  notifyMenuRefresh() {
    this.refreshMenuSource.next();
  }
}