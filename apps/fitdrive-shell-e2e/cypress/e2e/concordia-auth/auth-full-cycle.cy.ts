import { testAuthContent } from './auth.spec';
import { testLanguageSwitcher } from './language-switcher.spec';
// import { testResetContent } from './reset.spec';

describe('Auth full cycle', () => {
  // context('Reset context', testResetContent());

  context('Language switcher context', testLanguageSwitcher());

  context('Login context', testAuthContent());
});
