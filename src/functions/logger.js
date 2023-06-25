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

const { __express } = require('pug');

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

let logger = console;

function getPath(index = 2) {
    let error = new Error();
    let regex = /^(?!.*(node|logger)).*at (.*) .*\/(.*\.js)/gm;
    let res;
    for (let i = 0; i < index; i++) {
        let newRes = regex.exec(error.stack);
        if (newRes == null) {
            break;
        }
        res = newRes;
        regex.lastIndex++;
    }
    return {
        func: res[2],
        file: res[3]
    };
}

const init = () => {
    
    logger.server_log = function (msg) {
        logger.log(...msg);
        logger.org.log(req.ipInfo);
    }
    
    logger.slog = function (req, ...msg) {
        logger.server_log(msg);
    }

    logger.server_error = function (msg) {
        logger.log(...msg);
        logger.org.log(req);
    }
    
    logger.serror = function (req, ...msg) {
        logger.server_log(msg);
    }

    /* Default logger */
    consoleStamp(logger, {
        format: ":label().underline.bgWhite.black :getPath().yellow :date().gray\n:msg",
        tokens: {
            getPath: () => {
                let path = getPath(3);
                return `[${path.file}:${path.func}]`;
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

    logger.debug = logger.org.debug;

}

/* ADD geoip T*T */

module.exports = init
module.exports.init = init;
module.exports.getPath = getPath;