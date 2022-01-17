import {Trello} from 'types/trello';

type SettingsOptions = {
  context: {
    permissions: {
      organization: string;
    };
  };
};

export function getSettings(
  t: Trello.PowerUp.IFrame,
  options: SettingsOptions,
): PromiseLike<void> | undefined {
  if (options.context.permissions?.organization === 'write') {
    return t.popup({
      title: 'ONLYOFFICE',
      url: './show-settings',
      height: 240,
    });
  }
}
