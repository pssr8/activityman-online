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
const { handleResponseCode } = require("../middlewares/errorHandler");
const { checkPermissionsFor, ifIsAdmin } = require('../functions/dbapi');
const router = new Router();

/**
 * This entyr should
 * - allow the client to change admin if is admin
 */
router.post('/set-user', async (req, res, next) => {
    /** 
     * format: 
     * name?=string
     * username=string
     * password?=string
     * actis_control?=boolean 
     * assis_control?=boolean 
     * users_control?=boolean 
     **/
    try {
        /* Check logged in and permissions */
        await checkPermissionsFor(['users_control'], req);

        const { username, name, password } = req.body;

        /* If no username provided */
        if (!username) {
            console.error(`Wrong params. username: '${username}'`);
            throw 400;
        }

        // console.log(`Setting user:\n\tusername: ${username}\n\tname: ${name}\n\tpassword: ${password}\n\tactis_control: ${req.body['actis_control']}\n\tassis_control: ${req.body['assis_control']}\n\tusers_control: ${req.body['users_control']}\n--------------------\n`);

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
            user.permissions['actis_control'] = true;

        }

        /* If user is not admin */
        ifIsAdmin(user, me);

        if (name) {
            user.name = name;
        }
        if (password) {
            user.password = password;
        }

        for (const perm of Object.keys(me.permissions)) {
            let permValue = req.body[perm];
            // console.log(perm, permValue)
            /* if will allow */
            if (permValue === 'true') {
                console.log(`allow ${perm} for ${user.username}`)
                user.permissions[perm] = true;
                /* if will disallow */
            } else if (permValue === 'false') {
                console.log(`disallow ${perm} for ${user.username}`)
                user.permissions[perm] = false;
            }

        }

        await user.save();

        res.redirect('/users');

    } catch (e) {
        handleResponseCode(e, res, next, {
            403: "ERROR: You don't have permission to edit this user.",
            400: "Bad request.\nIf you are trying to create a new user provide an username and a password at least.\nIf you are trying to edit an already existing user, provide an username at least."
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
        await checkPermissionsFor(['control-assis'], req);

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

router.get('/set-user', (req, res) => {
    res.redirect('/users');
})
router.get('/delete-user', (req, res) => {
    res.redirect('/users');
})

module.exports = router;