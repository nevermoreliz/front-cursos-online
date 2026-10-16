import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ConfirmService } from '../../services/confirm-service';

@Component({
  imports: [NgClass],
  selector: 'app-confirm-dialog',
  styleUrl: './confirm-dialog.css',
  templateUrl: './confirm-dialog.html',
})
export class ConfirmDialog {
  public confirmService = inject(ConfirmService);

  get btnClass() {
    const color = this.confirmService.options()?.confirmButtonColor;
    switch (color) {
      case 'error': return 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500';
      case 'success': return 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500';
      case 'warning': return 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500';
      case 'info': return 'bg-sky-600 hover:bg-sky-700 text-white focus:ring-sky-500';
      default: return 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500';
    }
  }

  get iconBgClass() {
    const color = this.confirmService.options()?.confirmButtonColor;
    switch (color) {
      case 'error': return 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400';
      case 'success': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'warning': return 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400';
      case 'info': return 'bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400';
      default: return 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400';
    }
  }

  responder(valor: boolean) {
    this.confirmService.respond(valor);
  }
}
