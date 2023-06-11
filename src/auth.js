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
            saveUninitialized: true,
            cookie: {
                maxAge: 0x9a7ec800 // 1 month
            }
        }));
    },
    loginWith: async function (req) {
        try {
            let { username, password } = req.body;
            console.log(username, password)
            if (username && password) {
                const DB = await useDB;
                try {
                    // Authenticate the user
                    let user = await DB.AUTH.verifyLogin(username, password);
                    req.session.loggedin = true;
                    req.session.user = user;
                } catch (e) {
                    console.log(e)
                    throw new Error('Incorrect Username or Password!');
                }
            } else {
                console.log('Not username or password provided')
                throw new Error('Incorrect Username or Password!');
            }
        } catch (e) {
            throw e;
        }
    },
    logout: function (req) {
        req.session.loggedin = false;
        req.session.username = null;
    },
    requireAuth: async function (req, res, next) {
        // console.log(req.session);
        if (!req.session.loggedin) {
            req.session.lastPage = req.url || '/';
            res.status(401).render('auth/login', { title: 'Log in', addText: 'You have to log in first...' });
            console.log('Not logged in')
            return false;
        } else {
            const DB = await useDB;
            try {
                let { username, password } = req.session.user;
                let user = await DB.AUTH.verifyLogin(username, password);
                req.session.loggedin = true;
                req.session.user = user;
            } catch (e) {
                res.status(401).render('auth/login', { title: 'Log in', addText: 'You have to log in first...' });
                console.log('Not logged in')
                return false;
            }
            return true;
        }
    }
}


module.exports = auth