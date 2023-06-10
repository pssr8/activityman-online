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


const auth = {
    useMiddleware: function (app) {
        app.use(session({
            secret: 'unarequetecontraseña',
            resave: true,
            saveUninitialized: true
        }));
    },
    loginWith: async function (req) {
        try {
            let { username, password } = req.session;
            if (username && password) {
                const DB = await useDB;
                let user;
                try {
                    user = await DB.AUTH.verifyLogin(username, password);
                } catch (e) {
                    throw new Error('Incorrect Username or Password!');
                }
                // If the account exists
                // Authenticate the user
                req.session.loggedin = true;
                req.session.username = user.username;
            } else {
                throw new Error('Incorrect Username or Password!');
            }
        } catch (e) {
            throw e;
        }
    },
    logout: function (req) {
        req.session.loggedin = false;
        req.session.username = null;
    }
}


module.exports = auth