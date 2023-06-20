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

/**
 * Handle status code
 * @param { {[c:string]: string} } messages an object containing error messages for each status code.
 * If there is no message found, default message is used.
 */
function handleResponseCode(e, res, next, messages = {}) {
    const defaultMessages = {
        400: "Bad request.",
        401: (res, e) => res.status(e).render('auth/login', { title: 'Log in', addText: 'You have to log in first...' }),
        403: "You don't have permission to acces this ressource.",
        404: 'Ressource not found.',
    };

    if (e == null) {
        return;
    }
    if (e in defaultMessages) {
        const message = defaultMessages[e];
        if (typeof message == 'function') {
            message(res, e);
            return;
        }
        res.status(e).send(messages[e] || defaultMessages[e]);
        return;
    }

    res.status(500).render(e.message);
    next(e);
};



module.exports = { handleResponseCode };