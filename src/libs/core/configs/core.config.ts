import { ICoreConfig } from '../interfaces/core-config.interface';

export const defaultCoreConfig: ICoreConfig = {
  debug: false,
  port: 3000
};
export const CORE_CONFIG_TOKEN: string = 'CoreConfigToken';
