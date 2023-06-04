import {INotifier} from '.';
import {IMessage, IWaifu} from '../waifu';

export default class MultiNotifier implements INotifier {
  constructor(private readonly notifiers: INotifier[]) {}

  notify(waifu: IWaifu, message: IMessage) {
    this.notifiers.forEach(notifier => notifier.notify(waifu, message));
  }

  append(notifier: INotifier) {
    this.notifiers.push(notifier);
  }
}
