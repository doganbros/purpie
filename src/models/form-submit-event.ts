import { FormExtendedEvent } from 'grommet';

export interface FormSubmitEvent<T> {
  (event: FormExtendedEvent<T, Element>): void;
}
