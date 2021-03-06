import { AccountState } from './Account/AcountState';
import { AppState } from './App/AppState';

export interface StoreState {
  app: AppState;
  account: AccountState;
}
