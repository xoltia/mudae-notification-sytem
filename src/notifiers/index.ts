import {IWaifu, IMessage} from '../waifu';
import ConsoleNotifier from './console';
import DesktopNotifier from './desktop';
import SystemNotifier from './system';
import PushsaferNotifier from './pushsafer';
import WssNotifier from './wss';
import MultiNotifier from './multi';

export interface INotifier {
  notify(waifu: IWaifu, message: IMessage): void;
}

export {
  ConsoleNotifier,
  DesktopNotifier,
  PushsaferNotifier,
  SystemNotifier,
  WssNotifier,
  MultiNotifier,
};
