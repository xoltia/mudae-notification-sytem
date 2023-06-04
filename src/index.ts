import * as RPC from 'discord-rpc';
import Config from './config';
import * as configSetter from 'config';
import Waifu, {IMessage} from './waifu';
import {
  MultiNotifier,
  ConsoleNotifier,
  DesktopNotifier,
  PushsaferNotifier,
  SystemNotifier,
  WssNotifier,
} from './notifiers';

const scopes = ['rpc', 'messages.read'];
const client = new RPC.Client({transport: 'ipc'});
const config = Config.from(configSetter);

const LogNotifier = new MultiNotifier([new ConsoleNotifier()]);
const AlertNotifier = new MultiNotifier([new DesktopNotifier()]);

if (config.pushsaferKey) {
  AlertNotifier.append(
    new PushsaferNotifier(config.pushsaferKey, config.pushsaferDevice)
  );
}

if (config.alertCommand) {
  AlertNotifier.append(new SystemNotifier(config.alertCommand));
}

if (config.wssPort) {
  LogNotifier.append(new WssNotifier(config.wssPort));
}

(async () => {
  try {
    await config.validate();
  } catch (errors) {
    console.error(errors);
    return;
  }

  client.on('ready', async () => {
    if (client.application && client.user) {
      console.log('Logged in as', client.application.name);
      console.log('Authed for user', client.user.username);
    }

    await Promise.all(
      config.channels.map(channel_id =>
        client.subscribe('MESSAGE_CREATE', {channel_id})
      )
    );

    client.on('MESSAGE_CREATE', ({message}: {message: IMessage}) => {
      if (message.author?.id === config.mudae) {
        const waifu = Waifu.tryParse(message);

        if (!waifu) return;

        const isSpecificInterest = waifu.checkName(config.waifus);
        const isGeneralInterest = waifu.checkSeries(config.series);
        const isValuable =
          config.minKakera === undefined || waifu.value >= config.minKakera;
        const isImportant =
          isSpecificInterest || isGeneralInterest || isValuable;

        LogNotifier.notify(waifu, message);

        if (isImportant) {
          AlertNotifier.notify(waifu, message);
        }
      }
    });
  });

  const {clientId, clientSecret} = config;

  // Log in to RPC with client id
  client.login({
    clientId,
    clientSecret,
    scopes,
    redirectUri: 'http://localhost',
  });
})();
