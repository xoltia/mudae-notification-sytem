import {INotifier} from '.';
import {IMessage, IWaifu} from '../waifu';
import * as request from 'request';
import {URLSearchParams} from 'url';

type PushsaferNotification = {
  k: string;
  m: string;
  d?: string;
  t?: string;
  s?: `${number}`;
  v?: `${number}`;
  i?: `${number}`;
  c?: string;
  u?: string;
  ut?: string;
  p?: string;
  is?: string;
  l?: `${number}`;
  pr?: `${number}`;
  re?: `${number}`;
  ex?: `${number}`;
  a?: `${number}`;
  ao?: string;
  af?: '0' | '1';
  cr?: string;
  g?: string;
};

export default class PushsaferNotifier implements INotifier {
  private static readonly _API_URL = 'https://pushsafer.com/api';

  constructor(
    private readonly key: string,
    private readonly device?: string,
    private readonly debug: boolean = false
  ) {}

  notify(waifu: IWaifu, message: IMessage): void {
    PushsaferNotifier._downloadImageAsBase64(waifu.imgUrl, (error, imgData) => {
      if (error) return console.error(error);
      const payload: PushsaferNotification = {
        k: this.key,
        t: 'Waifu Detected',
        m: `${waifu.name} from ${waifu.series} worth ${waifu.value} kakera`,
        p: imgData ? imgData : undefined,
        u: `https://discord.com/channels/${message.guild_id}/${message.channel_id}/${message.id}`,
        d: this.device,
      };

      request.post(
        PushsaferNotifier._API_URL,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(payload).toString(),
          encoding: 'utf8',
        },
        (error, response, body) => {
          if (error) return console.error(error);
          if (response.statusCode !== 200)
            return console.error('Invalid status code', response.statusCode);
          if (this.debug) console.log(body);
        }
      );
    });
  }

  private static _downloadImageAsBase64(
    url: string,
    cb: (error: Error | null, imgData: string | null) => void
  ): void {
    request.get(url, {encoding: null}, (error, response, body) => {
      if (error) return cb(error, null);
      if (response.statusCode !== 200)
        return cb(new Error('Invalid status code'), null);

      const imgData = Buffer.from(body).toString('base64');
      const dataString =
        'data:' + response.headers['content-type'] + ';base64,' + imgData;
      return cb(null, dataString);
    });
  }
}
