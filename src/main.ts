// tslint:disable-next-line:no-var-requires
const tsConfig = require('../tsconfig.json');
// tslint:disable-next-line:no-var-requires no-implicit-dependencies
const tsConfigPaths = require('tsconfig-paths');
// tslint:disable-next-line:no-var-requires
const ConnectionString = require('connection-string');
// tslint:disable-next-line:no-var-requires
const chmod = require('chmod');
const NODE_ENV = process.env.NODE_ENV || 'develop';
if (NODE_ENV !== 'develop') {
  tsConfigPaths.register({
    baseUrl: __dirname,
    paths: tsConfig.compilerOptions.paths
  });
}

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import {
  appFilters,
  appPipes,
  CORE_CONFIG_TOKEN,
  defaultCoreConfig,
  ICoreConfig
} from '@l4g/core-nestjs';
import { AppModule } from './apps/l4g/app.module';

import { load } from 'dotenv';
import { accessSync, readFileSync } from 'fs';
import * as path from 'path';

async function bootstrap() {
  const packageBody = JSON.parse(readFileSync('./package.json').toString());

  Logger.log(NODE_ENV);

  const envFile = path.resolve(__dirname, '..', `${NODE_ENV}.env`);
  try {
    accessSync(envFile);
    load({ path: envFile });
    Logger.log(`env file: ${envFile}`, 'Main');
  } catch (error) {
    Logger.log(`error on get env file: ${envFile}`, 'Main');
    try {
      accessSync(`.env`);
      load();
      Logger.log(`env file: .env`, 'Main');
    } catch (error) {
      Logger.log(`error on get env file: .env`, 'Main');
    }
  }

  const connectionString = new ConnectionString(process.env.DATABASE_URL || '');
  if (connectionString.protocol === 'sqlite') {
    const dbFile =
      './' +
      (connectionString.hosts ? connectionString.hosts[0].name : '') +
      (connectionString.path ? '/' + connectionString.path[0] : '');
    try {
      chmod(dbFile, 777);
    } catch (error) {
      Logger.log(`error on set chmod 777 to database file ${dbFile}`, 'Main');
    }
  }

  const coreConfig: ICoreConfig = {
    ...defaultCoreConfig,
    debug: process.env.DEBUG === 'true',
    port: process.env.PORT ? +process.env.PORT : 3000
  };

  const app = await NestFactory.create(
    AppModule.forRoot({
      providers: [
        { provide: CORE_CONFIG_TOKEN, useValue: coreConfig },
        ...appFilters,
        ...appPipes
      ]
    }),
    { cors: true }
  );

  let documentBuilder = new DocumentBuilder()
    .setTitle(packageBody.name)
    .setDescription(packageBody.description)
    .setContactEmail(packageBody.author.email)
    .setExternalDoc('Project on Github', packageBody.homepage)
    .setLicense(packageBody.license, '')
    .setVersion(packageBody.version)
    .addBearerAuth('Authorization', 'header');

  documentBuilder = documentBuilder.setSchemes('http', 'https');

  const options = documentBuilder.build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('/swagger', app, document);

  await app.listen(3000);
}
bootstrap();
