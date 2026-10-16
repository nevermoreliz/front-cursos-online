import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AlertService, AlertType } from '../../services/alert-service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [NgClass, MatIconModule, MatButtonModule],
  templateUrl: './alert.html',
  styles: `
    .alert-enter {
      animation: alertSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes alertSlideIn {
      0% {
        opacity: 0;
        transform: translateY(-16px) scale(0.96);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .alert-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      border-radius: 0 0 0.75rem 0.75rem;
      animation: alertShrink 4s linear forwards;
    }

    @keyframes alertShrink {
      from {
        width: 100%;
      }
      to {
        width: 0%;
      }
    }

    button.mat-mdc-icon-button.close-btn {
      --mat-icon-button-state-layer-size: 28px;
      width: 28px;
      height: 28px;
      padding: 0;
    }

    button.mat-mdc-icon-button.close-btn .mat-mdc-button-touch-target {
      width: 28px;
      height: 28px;
    }

    .mat-icon {
      font-family: 'Material Symbols Outlined', 'Material Icons' !important;
    }
  `,
})
export class Alert {
  alertService = inject(AlertService);

  getCardClasses(tipo: AlertType): string {
    switch (tipo) {
      case 'success':
        return 'border-emerald-200 dark:border-emerald-800/60 shadow-emerald-500/10';
      case 'warning':
        return 'border-amber-200 dark:border-amber-800/60 shadow-amber-500/10';
      case 'error':
        return 'border-rose-200 dark:border-rose-800/60 shadow-rose-500/10';
      case 'info':
        return 'border-sky-200 dark:border-sky-800/60 shadow-sky-500/10';
      default:
        return 'border-gray-200 dark:border-gray-800 shadow-gray-500/10';
    }
  }

  getIconBgClasses(tipo: AlertType): string {
    switch (tipo) {
      case 'success':
        return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50';
      case 'warning':
        return 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/50';
      case 'error':
        return 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/50';
      case 'info':
        return 'bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400 border border-sky-200/50 dark:border-sky-800/50';
      default:
        return 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700';
    }
  }

  getTitleClasses(tipo: AlertType): string {
    switch (tipo) {
      case 'success':
        return 'text-emerald-700 dark:text-emerald-400';
      case 'warning':
        return 'text-amber-700 dark:text-amber-400';
      case 'error':
        return 'text-rose-700 dark:text-rose-400';
      case 'info':
        return 'text-sky-700 dark:text-sky-400';
      default:
        return 'text-gray-700 dark:text-gray-400';
    }
  }

  getProgressColor(tipo: AlertType): string {
    switch (tipo) {
      case 'success':
        return 'bg-emerald-500 dark:bg-emerald-400';
      case 'warning':
        return 'bg-amber-500 dark:bg-amber-400';
      case 'error':
        return 'bg-rose-500 dark:bg-rose-400';
      case 'info':
        return 'bg-sky-500 dark:bg-sky-400';
      default:
        return 'bg-gray-500 dark:bg-gray-400';
    }
  }

  getIconName(tipo: AlertType): string {
    switch (tipo) {
      case 'success':
        return 'check_circle';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'info':
        return 'info';
      default:
        return 'notifications';
    }
  }

  getTitleText(tipo: AlertType): string {
    switch (tipo) {
      case 'success':
        return 'Éxito';
      case 'warning':
        return 'Advertencia';
      case 'error':
        return 'Error';
      case 'info':
        return 'Información';
      default:
        return 'Notificación';
    }
  }
}
