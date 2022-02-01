/*
* (c) Copyright Ascensio System SIA 2022
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

const customFormat = winston.format.printf(({
  level, message, timestamp, ...metadata
}) => {
  let msg = `[${timestamp} (${level})] `;
  if (metadata) {
    msg += JSON.stringify(metadata);
  }
  return `${msg} : ${message}`;
});

const WinstonLogger = WinstonModule.createLogger({
  transports: [
    process.env.IS_DEBUG === '1' ? new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.prettyPrint(),
        customFormat,
      ),
    }) : new winston.transports.File({
      filename: 'server-error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        customFormat,
      ),
      maxFiles: 5,
      maxsize: 5242880,
    }),
  ],
});

export default WinstonLogger;
