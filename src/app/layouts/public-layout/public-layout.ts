import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css',
  encapsulation: ViewEncapsulation.None,
})
export class PublicLayout {}
