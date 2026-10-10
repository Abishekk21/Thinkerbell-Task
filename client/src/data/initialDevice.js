/**
 * Initial device state for demonstration
 */

export const initialDevice = {
  deviceId: 'D01',
  siteId: 'S01',
  version: 3,
  settings: {
    language: 'en',
    volume: 2
  }
};

export const demoActor = {
  siteId: 'S01',
  role: 'editor'
};

export const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिन्दी (Hindi)' },
  { value: 'kn', label: 'ಕನ್ನಡ (Kannada)' }
];
