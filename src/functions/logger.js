/*
 * ActivityMan-online | An online activity manager
 * Copyright (C) 2023  pssr8
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// const fs = require('fs');
// const output = fs.createWriteStream('./stdout.log');
// const errorOutput = fs.createWriteStream('./stderr.log');
// const logger = new console.Console(output, errorOutput);

// require('console-stamp')(logger, {
//     stdout: output,
//     stderr: errorOutput
// });

/* T*T add logger to all console.logs */

const consoleStamp = require('console-stamp');
const chalk = require('chalk');

let logger = console;

function getPath(index = 2) {
    let error = new Error();
    let regex = /^(?!.*(node)).*at (.*) .*\/(.*\.js)/gm;
    let res = null;
    for (let i = 0; i < index; i++) {
        let newRes = regex.exec(error.stack);
        if (newRes == null) {
            break;
        }
        res = newRes;
        regex.lastIndex++;
    }
    return res? {
        func: res[2],
        file: res[3]
    }: null;
}

function parseServerLog(req) {
    let { ipInfo, url, session } = req;

    if (!ipInfo || !url || !session) {
        throw new Error(`Parameter 'req is missing required properties.`)
    }

    return `${chalk.bgBlue(`[${
        (ipInfo.error)? `${ipInfo.ip}|${ipInfo.error}`
        : `${ipInfo.ip}`
    }]`)} ${chalk.magenta.underline(`[${
        session.loggedin? session.user.username
        : `ø`
    }]`)} ${chalk.gray(`[${
        url
    }]`)}`;
}

const init = () => {

    logger.server_log = function (msg) {
        logger.log(...msg);
    }

    logger.slog = function (req, ...msg) {
        let serverLog = parseServerLog(req);
        logger.org.log(serverLog);
        logger.server_log(msg);
    }

    logger.server_error = function (...msg) {
        logger.org.error(...msg);
    }

    logger.serror = function (req, ...msg) {
        let serverLog = parseServerLog(req);
        logger.org.log(serverLog);
        logger.server_error(...msg);
    }

    /* Default logger */
    consoleStamp(logger, {
        format: ":label().underline.bgWhite.black :getPath().yellow :date().gray\n:msg",
        tokens: {
            getPath: () => {
                let path = getPath(3);
                if (path.file == 'logger.js') {
                    path = getPath(4);
                }
                return path? `[${path.file}:${path.func}]` : '[null]';
            }
        },
        extend: {
            error: 1,
            warn: 2,
            info: 3,
            log: 4,
            debug: 5,
            server_log: 4,
            server_error: 1,
        },
    });

    logger.debug = (...msgs) => logger.org.debug('>', ...msgs);
    console.slog = logger.slog;
    console.serror = logger.serror;

}

/* ADD geoip T*T */

module.exports = init
module.exports.init = init;
module.exports.getPath = getPath;