import {INotifier} from '.';
import {IMessage, IWaifu} from '../waifu';
import {WebSocketServer, WebSocket} from 'ws';

interface ISyncEvent {
  evt: 'sync';
  data: IWaifu[];
}

interface IWaifuEvent {
  evt: 'waifu';
  data: {
    waifu: IWaifu;
    message: IMessage;
  };
}

type IWssEvent = ISyncEvent | IWaifuEvent;

export default class WssNotifier implements INotifier {
  private readonly _data!: IWaifu[];
  private readonly _wss!: WebSocketServer;

  constructor(port: number) {
    this._data = [];
    this._wss = new WebSocketServer({port});
    this._wss.on('connection', this._onConnection.bind(this));

    console.log(`WSS server listening on port ${port}`);
  }

  private _onConnection(client: WebSocket) {
    client.send(JSON.stringify(<IWssEvent>{evt: 'sync', data: this._data}));
  }

  notify(waifu: IWaifu, IMessage: IMessage) {
    this._data.unshift(waifu);
    this._wss.clients.forEach(client => {
      client.send(
        JSON.stringify(<IWssEvent>{
          evt: 'waifu',
          data: {waifu: waifu, message: IMessage},
        })
      );
    });
  }
}
