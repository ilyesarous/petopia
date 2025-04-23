import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'relativeTime' })
export class RelativeTimePipe implements PipeTransform {
  transform(value: string | Date): string {
    const date = new Date(value);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMs < 1000 * 60 * 60) { // less than 1 hour
      return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    } else if (diffMs < 1000 * 60 * 60 * 24) { // less than 24 hours
      return `${hours} hr${hours > 1 ? 's' : ''} ago`;
    } else if (diffMs < 1000 * 60 * 60 * 24 * 7) { // less than 7 days
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      // Otherwise, return a full date string (you can customize the format)
      return date.toLocaleDateString();
    }
  }
}
