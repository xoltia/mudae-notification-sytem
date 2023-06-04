import {INotifier} from './index';
import {IWaifu} from '../waifu';

export default class ConsoleNotifier implements INotifier {
  notify(waifu: IWaifu) {
    console.log(waifu);
  }
}
