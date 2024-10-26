import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ColorsService {
  colors = [
    'blue',
    'red',
    'green',
    'yellow',
    'cyan',
    'indigo',
    'pink',
    'teal',
    'orange',
    'purple',
  ];

  getColor(i: number): string {
    // to 140
    const documentStyle = getComputedStyle(document.documentElement);
    const j = i%10;
    const f = Math.floor(i/10);

    return documentStyle.getPropertyValue(`--${this.colors[j]}-${f<5 ? f+5 : f-4}00`);
  }

  getRGDAColor(i: number, opacity: number): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.getColor(i));

    return result
      ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity})`
      : '';
  }
}
