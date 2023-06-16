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
const { requireAuth } = require("../auth");
const { handleResponseCode } = require("../functions/handleErrors");
const { checkPermissionsFor, ifIsAdmin } = require('../functions/dbapi');
const router = new Router();

router.post('/set-user', async (req, res, next) => {
    /** 
     * format: 
     * name?=string
     * username=string
     * password?=string
     * actis-control?=boolean 
     * assis-control?=boolean 
     * users-control?=boolean 
     **/
    try {
        /* Check logged in and permissions */
        checkPermissionsFor(['control-assis']);

        const { username, name, password } = req.body;

        /* If no username provided */
        if (!username) {
            console.error(`Wrong params. username: '${username}'`);
            throw 400;
        }

        console.log('Setting user: ', username, name, password);

        const DB = await useDB;
        let me = req.session.user;
        let user = await DB.users.findUser('' + username);

        /* If user not found. Create a new user */
        if (!user) {
            /* If no password provided */
            if (!password) {
                throw 400;
            }

            user = await DB.users.add(username, password);

        }

        /* If user is admin */
        ifIsAdmin(user, me);

        if (name) {
            user.name = name;
        }
        if (password) {
            user.password = password;
        }

        await user.save();

        res.redirect('/users');

    } catch (e) {
        handleResponseCode(e, res, next, {
            403: "ERROR: Trying to edit users without users_control permission.",
            400: "Bad request. If you are trying to create a new user provide an username and a password at least, if you are trying to edit an already existing user, provide an username at least."
        })
    }
})


router.post('/allow-the-user', async (req, res, next) => {
    /** 
     * format: 
     * username=string
     * to=string
     **/
    try {
        /* Check logged in and permissions */
        checkPermissionsFor(['control-assis']);

        const { username, to } = req.body;

        /* If no username provided */
        if (!username || !to) {
            console.error(`Wrong params. username: '${username}' | to: '${to}' `);
            throw 400;
        }

        console.log('Setting user: ', username, to)

        const DB = await useDB;
        let me = req.session.user;
        let user = await DB.users.findUser('' + username);

        /* If user not found */
        if (!user) {
            throw 404;
        }

        /* If user is admin */
        ifIsAdmin(user, me);

        // console.log(user);

        await user.save();

        // res.json(req.body)
        res.redirect('/users');
    } catch (e) {
        handleResponseCode(e, res, next, {
            403: "You don't have permission to change user permissions.",
            400: `Bad request. You should provide a user name (to whom you are going to change permissions) and the permission you are going to change in the "to" parameter.\nFollowing the following body format: "username=string&to=string".\n"to" param can be either "control-actis", "control-assis", "control-users".`,
            404: `User not found.`,
        })
    }
})

router.post('/delete-user', async (req, res, next) => {
    /** 
     * format: 
     * username=string
     **/
    try {
        /* Check logged in and permissions */
        checkPermissionsFor(['control-assis']);

        const { username } = req.body;

        /* If no username provided */
        if (!username) {
            console.error(`Wrong params. username: '${username}'`);
            throw 400;
        }

        console.log('Deleting user: ', username)

        const DB = await useDB;
        let me = req.session.user;
        let user = await DB.users.findUser('' + username);

        /* If user not found */
        if (!user) {
            throw 404;
        }

        /* If user is admin */
        ifIsAdmin(user, me);


        /* Delete it */
        await DB.users.delete(user.id);


        // res.json(req.body)
        res.redirect('/users');

    } catch (e) {
        handleResponseCode(e, res, next, {
            403: "You don't have permission to delete this user.",
            400: `Bad request. you should provide a username that you are going to delete.`,
            404: `User not found.`,
        })
    }
});

module.exports = router;