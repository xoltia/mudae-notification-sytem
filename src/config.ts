/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  validateOrReject,
  MinLength,
  ArrayMinSize,
  IsString,
  IsNumberString,
  IsNumber,
  IsOptional,
  IsPort,
} from 'class-validator';

export interface IConfigSetter {
  get<T>(key: string): T;
  has(key: string): boolean;
}

export default class Config {
  @MinLength(1)
  clientId!: string;

  @MinLength(1)
  clientSecret!: string;

  @ArrayMinSize(1)
  @MinLength(1, {each: true})
  series!: string[];

  @ArrayMinSize(1)
  @MinLength(1, {each: true})
  waifus!: string[];

  @ArrayMinSize(1)
  @IsNumberString({no_symbols: true}, {each: true})
  @MinLength(1, {each: true})
  channels!: string[];

  @IsNumberString({no_symbols: true})
  @MinLength(1)
  mudae!: string;

  @IsNumber()
  @IsOptional()
  minKakera?: number;

  @IsString()
  @IsOptional()
  pushsaferKey?: string;

  @IsString()
  @IsOptional()
  pushsaferDevice?: string;

  @IsString()
  @IsOptional()
  alertCommand?: string;

  @IsPort()
  wssPort?: number;

  static from(setter: IConfigSetter): Config {
    const c = new Config();

    if (setter.has('clientId')) c.clientId = setter.get('clientId');
    if (setter.has('clientSecret')) c.clientSecret = setter.get('clientSecret');
    if (setter.has('series')) c.series = setter.get('series');
    if (setter.has('waifus')) c.waifus = setter.get('waifus');
    if (setter.has('channels')) c.channels = setter.get('channels');
    if (setter.has('mudae')) c.mudae = setter.get('mudae');
    if (setter.has('minKakera')) c.minKakera = setter.get('minKakera');
    if (setter.has('pushsaferKey')) c.pushsaferKey = setter.get('pushsaferKey');
    if (setter.has('pushsaferDevice'))
      c.pushsaferDevice = setter.get('pushsaferDevice');
    if (setter.has('alertCommand')) c.alertCommand = setter.get('alertCommand');
    if (setter.has('wssPort')) c.wssPort = setter.get('wssPort');

    return c;
  }

  async validate(): Promise<void> {
    await validateOrReject(this);
  }
}
