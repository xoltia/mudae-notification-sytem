import * as notifier from 'node-notifier';
import {IWaifu} from '../waifu';
import {INotifier} from '.';

export default class DesktopNotifier implements INotifier {
  notify(waifu: IWaifu): void {
    const notification: notifier.Notification = {
      title: 'Waifu Detected',
      message: `${waifu.name} from ${waifu.series} worth ${waifu.value} kakera`,
    };

    notifier.notify(notification);
  }
}
