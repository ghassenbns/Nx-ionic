/**
 * Represents a column object
 * @interface Column
 */
import { ActionEnum, ModeEnum } from '../../enum';

export interface Column {
  /**
   * Column's name
   * @type {string}
   * @memberof Column
   */
  field: string;

  /**
   * colspan attribute defines the number of columns a cell
   * @type {number}
   * @memberof Column
   */
  colspan?: number;

  /**
   * add Label
   * @type {string}
   * @memberof Column
   */
  addLabel?: string;

  /**
   * frozen column
   * @type {boolean}
   * @memberof Column
   */
  frozen?: boolean;

  /**
   * The search method used in the column
   * @type {('text' | 'select' | 'selectSearch' | 'multiSelect' | 'multiSelectSearch' | 'date' | 'number' | 'hidden')}
   * @memberof Column
   */
  searchType: 'text' | 'select' | 'selectSearch' | 'multiSelect' | 'multiSelectSearch' | 'date' | 'number' | 'hidden';

  /**
   * The search selector
   * @type {('string')}
   * @memberof Column
   */
  searchSelector?: string;

  /**
   * The type of input used in the add/edit form
   * @type {('text' | 'number' | 'select' | 'selectSearch' | 'date' | 'switch' | 'hidden')}
   * 'text' - input of type text
   * 'number' - input of type number
   * 'select' - select
   * 'selectSearch' - select with search
   * 'date' - datepicker element
   * 'switch' - two state toggle switch
   * 'hidden' - hidden input type
   * @memberof Column
   */
  editType?: 'text' | 'number' | 'select' | 'selectSearch' | 'date' | 'switch' | 'hidden';

  /**
   * The way the data is displayed in the columng
   * @type {('string' | 'enum' | 'number' | 'boolean' | 'button' | 'date' | 'switch' | 'array')}
   * 'string' : text
   * 'enum' : chip
   * 'number' : number
   * 'boolean' : color coded value
   * 'button' : clickable button (ex. an entity public flag)
   * 'date' : date formatted according to user format options
   * 'switch' : two state switch
   * 'array' : joined array values
   * 'hidden' : hidden field
   *  @memberof Column
   */
  contentType: 'string' | 'enum' | 'number' | 'boolean' | 'button' | 'date' | 'switch' | 'array' | 'hidden';

  /**
   * The actions type of the column
   * @type {(string)}
   * @memberof Column
   */
  actions?: {
    value: boolean,
    icon: string,
    fill: 'clear' | 'outline' | 'solid',
    background: 'success' | 'light',
    color: 'light' | 'dark',
    name: string,
    type: ActionEnum,
  }[];

  /**
   * The addFilter of the column - additional Filter
   * @type {(boolean)}
   * @memberof Column
   */
  addFilter?: boolean;

  /**
   * The id of the column
   * @type {(string | number)}
   * @memberof Column
   */
  id?: string | number;

  /**
   * The 'fixed' of the column
   * @type {(true | false)}
   * @memberof Column
   */
  fixed?: true | false;

  /**
   * The filter type of the column
   * @type {('string' | 'int' | 'numeric' | 'boolean' | 'date' | 'object-id' | 'double')}
   * @memberof Column
   */
  filterType: 'string' | 'int' | 'numeric' | 'boolean' | 'date' | 'object-id' | 'double' | 'id' | 'array';

  /**
   * Filter range
   * @type {string}
   * @memberof Column
   */
  filterRange?: boolean;

  /**
   * hide Seconds
   * @type {boolean}
   * @memberof Column
   */
  hideSeconds?: boolean;

  /**
   * The row's key path in the data object
   * @type {string}
   * @memberof Column
   */
  rowSelector: string;

  /**
   * The row's key path in the data object
   * @type {string}
   * @memberof Column
   */
  rowEditSelector?: string;

  /**
   * Validation required for edit mode
   * @type {boolean}
   * @memberof Column
   */
  required?: boolean;

  /**
   * disabled for edit mode
   * @type {boolean}
   * @memberof Column
   */
  disabled?: boolean;

  /**
   * Default Value for edit mode
   * @type {any}
   * @memberof Column
   */
  defaultValue?: any;

  /**
   * Select options in case of column of searchType === 'select'
   * @type {SelectOption[]}
   * @memberof Column
   */
  options: any[];

  /**
   * Value options
   * @type {string}
   * @memberof Column
   */
  optionsValue?: string;

  /**
   * options Field default name
   * @type {string}
   * @memberof Column
   */
  optionsField?: string;

  /**
   * options Translate
   * @type {string}
   * @memberof Column
   */
  optionsTranslate?: boolean;

  /**
   * Value options
   * @type {string[]}
   * @memberof Column
   */
  optionsFilter?: string[];

  /**
   * minDate
   * @type {number}
   * @memberof Column
   */
  minDateFull?: any;

  /**
   * maxDate
   * @type {number}
   * @memberof Column
   */
  maxDateFull?: any;

  /**
   * date default Offset
   * @type {number}
   * @memberof Column
   */
  minDateOffset?: number;

  /**
   * date default Offset
   * @type {number}
   * @memberof Column
   */
  dateOffset?: number;

  /**
   * Value Group options
   * @type {string}
   * @memberof Column
   */
  optionsGroup?: string;

  /**
   * Hidden for mode
   * @type [ModeEnum]
   * @memberof Column
   */
  hidden?: ModeEnum[];

  /**
   *  Function that gets executed when row is clicked
   * @memberof Column
   */
  fn?: (...args: any[]) => any;

  /**
   * Column's link
   * @param { field: string, pref: string, sfx: string}
   * @memberof Column
   */
  link?: {
    field: string;
    pref: string;
    sfx: string;
  };

  /**
   * Validations for edit mode
   * @type []
   * @memberof Column
   */
  validators?: any[];

  /**
   * Min number value for number
   * @type []
   * @memberof Column
   */
  min?: number;

  /**
   * Max number value  for number
   * @type []
   * @memberof Column
   */
  max?: number;

  /**
   * Step number value for number
   * @type []
   * @memberof Column
   */
  step?: number;

  /**
   * CSS class to apply custom styles to the column
   * @type string
   * @memberof Column
   */
  cssClass?: string;

  /**
   * Timezone to be used to format date
   * columns value
   * @type string | null
   * @memberof Column
   */
  timezone?: string | null;

  /**
   * Optional prefix to identify the translation
   */
  translationPrefix?: string;

}

export interface SelectOption {
  _id?: string | number | boolean | null;
  name: string | boolean | null;
  hidden?: boolean;
  selected?: boolean;

  [key: string | number]: any;
}

/**
 * Enum type schema
 * key : represents the original value
 * value : represents value to be displayed
 * color : represents the color of ion-chip
 * @export
 * @interface EnumOptions
 */
export interface EnumOptions {
  [key: string | number]: { value: string, color: string };
}
