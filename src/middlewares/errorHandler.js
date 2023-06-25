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

const errorHandler = function (err, req, res, next) {
    try {
        /* default error handlers */
        const defaultMessages = {
            400: "Bad request.",
            401: (res, err) => res.status(err).render('auth/login', { title: 'Log in', addText: 'You have to log in first...' }),
            403: "You don't have permission to acces this ressource.",
            404: 'Ressource not found.',
        };

        /* if err has a handler */
        if (err in defaultMessages) {
            const message = defaultMessages[err];
            console.serror(req, 'thrown err: ' + err);

            /* if handler is a function */
            if (typeof message == 'function') {
                message(res, err);
                return;
            }

            /* else: send message */
            res.status(err).send(message);
            return;

        /* else if err is a status code without handler */
        } else if (typeof err == 'number') { 
            res.status(err).send(err);
        }

        /* else if err is just an Error */
        console.serror(req, err.stack);
        res.status(500).send('Something went wrong.');
    } catch (err2) {
        console.error(req, err2.stack);
        res.status(500).send('Something went wrong.');
    }
};

function handleResponseCode(e, res, next, messages = {}) {
    if (e in messages) {
        const message = messages[e];
        /* if handler is a function */
        if (typeof message == 'function') {
            message(res, e);
            return;
        }

        /* else: send message */
        res.status(e).send(message);
        return;
    }
    next(e);
};


module.exports = errorHandler;
module.exports.handleResponseCode = handleResponseCode;