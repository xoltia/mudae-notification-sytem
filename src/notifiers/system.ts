import {INotifier} from './index';
import {exec} from 'child_process';

export default class SystemNotifier implements INotifier {
  constructor(private readonly command: string) {}

  notify() {
    exec(this.command, error => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
    });
  }
}
