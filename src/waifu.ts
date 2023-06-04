export interface IEmbed {
  author?: {
    name: string;
  };
  title?: string;
  description?: string;
  image?: {
    url: string;
    proxy_url?: string;
  };
  color?: number;
  timestamp?: string;
  footer?: {
    text: string;
    icon_url: string;
  };
}

export interface IAuthor {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  bot?: boolean;
}

export interface IMessage {
  id: string;
  channel_id: string;
  guild_id?: string;
  embeds: IEmbed[];
  content: string;
  author: IAuthor;
  timestamp: string;
}

export interface IWaifu {
  name: string;
  series: string;
  value: number;
  imgUrl: string;
  imgProxyUrl?: string;
  rolledAt: Date;
}

const VALUE_REGEX = /\*\*(?<value>[0-9]+)\*\*/;

export function arrayContainsStringPrefix(
  array: string[],
  prefix: string
): boolean {
  return array.some(item => item.startsWith(prefix));
}

export function tryParseWaifu(message: IMessage): IWaifu | null {
  const embeds = message.embeds;

  if (embeds.length !== 1) return null;

  const embed = embeds[0];
  const description = embed.description;

  if (!description) return null;
  if (!embed.author) return null;
  if (!VALUE_REGEX.test(description)) return null;
  if (!embed.image) return null;

  const lines = description.split('\n');

  if (lines.length < 2) return null;

  const name = embed.author.name;
  const series = lines[0];
  const valueStr = description.match(VALUE_REGEX)?.groups?.value;

  if (!valueStr) return null;

  const value = parseInt(valueStr);
  const imgUrl = embed.image.url;
  const imgProxyUrl = embed.image.proxy_url;
  const rolledAt = new Date(message.timestamp);

  return {
    series,
    value,
    name,
    imgUrl,
    imgProxyUrl,
    rolledAt,
  };
}

export default class Waifu implements IWaifu {
  name: string;
  series: string;
  value: number;
  imgUrl: string;
  imgProxyUrl?: string;
  rolledAt: Date;

  constructor(obj: IWaifu) {
    this.name = obj.name;
    this.series = obj.series;
    this.value = obj.value;
    this.imgUrl = obj.imgUrl;
    this.imgProxyUrl = obj.imgProxyUrl;
    this.rolledAt = obj.rolledAt;
  }

  checkName(names: string[]): boolean {
    return names.includes(this.name);
  }

  checkSeries(series: string[]): boolean {
    return arrayContainsStringPrefix(series, this.series);
  }

  static tryParse(message: IMessage): Waifu | null {
    const waifuInfo = tryParseWaifu(message);
    return waifuInfo ? new Waifu(waifuInfo) : null;
  }
}
