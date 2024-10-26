export interface CardConfigInterface {
  /**
   * Card html selector id (also used to handle card editing)
   * @type {string}
   * @memberof CardInputInterface
   */
  selector: string;
  /**
   *  Card title
   * @type {string}
   * @memberof CardInputInterface
   */
  title: string | undefined;
  /**
   *  Shows the edit button at the end of the card title
   *  Displays and enables edit logic when state is set to true
   *  Modal mode prevents close and submit buttons from showing
   *  Form mode allows submit and close buttons to show
   * @type {boolean}
   * @memberof CardInputInterface
   */
  editable: { state : boolean, mode?: 'form' | 'modal' };
}
