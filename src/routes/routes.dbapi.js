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

const { Router } = require("express");
const useDB = require('../DB');
const { requireAuth, loginWith } = require("../auth");
const router = new Router();

router.post('/set-user', async (req, res, next) => {
    /** 
     * format: 
     * name=string
     * username=string
     * password=string
     * actis-control=boolean 
     * assis-control=boolean 
     * users-control=boolean 
     **/
    try {
        if (await requireAuth(req, res, next)) {

            if (req.session.user.permissions.users_control) {
                const { name, username, password } = req.body;
                console.log('Setting user: ', name, username, password)

                const DB = await useDB;
                let me = req.session.user;
                let user = null;
                let alreadyExists = await DB.users.findUser('' + username);
                if (alreadyExists) {
                    user = alreadyExists;
                    if (user.isAdmin() && !me.isAdmin()) {
                        console.error('ERROR: Trying to set Admin user');
                        throw 403;
                    }
                } else {
                    if (password) {
                        user = await DB.users.add(username);
                    } else {
                        console.error('No password provided');
                        throw 400;
                    }
                }
                await user.modify({ name, password });
                for (let key of ['actis-control', 'assis-control', 'users-control']) {
                    if (req.body[key] === true) {
                        user.allow(key);
                    } else if (req.body[key] === false) {
                        user.disallow(key);
                    }
                }


            } else {
                console.error('ERROR: Trying to edit users without users_control permission.');
                throw 403;
            }

            // res.json(req.body)
            res.redirect('/users');
        }
    } catch (e) {
        if (e == 403) {
            res.status(403).send("You don't have permission to set this user.");
        } else if (e == 400) {
            res.status(400).send("Please provide a password when creating a new user.");
        } else {
            next(e)
        }
    }
})

router.post('/delete-user', async (req, res, next) => {
    /** 
     * format: 
     * username=string
     **/
    try {
        if (await requireAuth(req, res, next)) {

            if (req.session.user.permissions.users_control) {
                const { username } = req.body;
                console.log('Deleting user: ', username)

                const DB = await useDB;
                let me = req.session.user;
                let user = await DB.users.findUser('' + username);
                if (user) {
                    if (user.isAdmin() && !me.isAdmin()) {
                        console.error('ERROR: Trying to delete Admin user');
                        throw 403;
                    }
                    // deleting
                    await DB.users.delete(user.id);
                } else {
                    console.error('Trying to delete false username: ' + username)
                    throw 403;
                }


            } else {
                console.error('ERROR: Trying to delete users without users_control permission.');
                throw 403;
            }

            // res.json(req.body)
            res.redirect('/users');
        }
    } catch (e) {
        if (e == 403) {
            res.status(403).send("You don't have permission to delete this user.");
        } else {
            next(e)
        }
    }
})

module.exports = router;