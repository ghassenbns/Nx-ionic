import { Injectable } from '@angular/core';
import { AlertButton, AlertController, AlertOptions } from '@ionic/angular';
import { AlertInput } from '@ionic/core/dist/types/components/alert/alert-interface';
import { TranslocoService } from '@ngneat/transloco';

@Injectable()
export class AlertService {
  constructor(private alertController: AlertController, private translocoService: TranslocoService) {}

  /**
   * Displays an ion alert modal
   * This method is used to display an alert with customizable options.
   * It supports translation of the alert text if the `translate` parameter is set to `true`.
   * When translate is set to true, all the string parameters should refer to their translation selector.
   * @param {AlertOptions} params
   * @param {boolean} [translate=false]
   * @param {AlertTranslationParams} [translationParams]
   * @return {*}  {Promise<void>}
   * @memberof AlertService
   */
  async show(
    params: AlertOptions,
    translate = false,
    translationParams?: AlertTranslationParams,
    showConfirmation = false,
  ): Promise<void> {
    const translateText = (text: string | undefined, key = ''): string | undefined => {
      const skipTranslation = translationParams?.[key]?.skipTranslation;
      return translate && text && !skipTranslation
        ? (key ? this.translocoService.translate(text, translationParams?.[key]) : this.translocoService.translate(text))
        : text;
    };

    const { header, subHeader, message } = params;

    const alertInputs: AlertInput[] = [
      {
        type: 'checkbox',
        label: translateText('errors.notShowDialog'),
        value: true,
        name: 'notShowDialog',
      },
    ];

    const alert = await this.alertController.create({
      ...params,
      header: translateText(header, 'header'),
      subHeader: translateText(subHeader, 'subHeader'),
      message: translateText(message as string, 'message'),
      buttons: translate && params.buttons ? this.translateButtonsText(params.buttons) : params.buttons,
      ...showConfirmation && {
        inputs: alertInputs,
      },
      htmlAttributes: {
        class: 'custom-alert',
      },
    });

    await alert.present();
  }

  async showDefault(): Promise<void> {
    return await this.show({
      header: 'Error',
      message: this.translocoService.translate('errors.somethingWentWrong'),
      buttons: [{ text: 'ok', role: 'cancel' }],
    });
  }

  private translateButtonsText(buttons: (string | AlertButton)[]): (string | AlertButton)[] {
    return buttons.map(button =>
      typeof button === 'string'
        ? this.translocoService.translate(button)
        : { ...button, text: this.translocoService.translate(button.text) },
    );
  }
}

interface AlertTranslationParams {
  [key: string]: { skipTranslation?: boolean; [key: string]: any };
}
