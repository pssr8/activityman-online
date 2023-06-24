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

const logger = console;

function getPath(index = 2) {
    let error = new Error();
    let regex = /^(?!.*(node)).*at (.*) .*\/(.*\.js)/gm;
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
    require('console-stamp')(logger, {
        format: "\n:date().green :getPath().cyan :label().underline.bgWhite.black\n(->).yellow",
        tokens: {
            getPath: () => {
                let path = getPath(3)
                return `[${path.func}:${path.file}]`;
            }
        }
    });
}

/* ADD geoip T*T */

module.exports = init
module.exports.init = init;
module.exports.getPath = getPath;