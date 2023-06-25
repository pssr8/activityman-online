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

const useDB = require('./DB');
const session = require('express-session');
const { handleResponseCode } = require('./middlewares/errorHandler');


const auth = {
    middleware: function () {
        return session({
            secret: 'unarequetecontraseña',
            resave: true,
            saveUninitialized: true,
            cookie: {
                maxAge: 0x9a7ec800 // 1 month
            }
        });
    },
    setLogin: async function (username, password, req) {
        console.slog(req, username, password)

        const error = 401/* new Error('Incorrect Username or Password!') */;

        if (!username || !password) {
            console.serror(req, 'Not username or password provided')
            throw error;
        }

        const DB = await useDB;

        try {
            // Authenticate the user
            let user = await DB.AUTH.verifyLogin(username, password);
            req.session.loggedin = true;
            req.session.user = user;
        } catch (e) {
            console.serror(req, e);
            req.session.loggedin = false;
            req.session.user = null;
            throw error;
        }


    },
    logout: function (req) {
        req.session.loggedin = false;
        req.session.username = null;
    },
    requireAuth: async function (req) {
        // console.log(req.session);
        if (!req.session.loggedin) {
            req.session.lastPage = req.url || '/';
            throw 401;
        }

        const DB = await useDB;

        try {
            let { username, password } = req.session.user;
            let user = await DB.AUTH.verifyLogin(username, password);
            req.session.loggedin = true;
            req.session.user = user;
        } catch (e) {
            console.log(e);
            throw 401;
        }

        return true;
    }
}


module.exports = auth