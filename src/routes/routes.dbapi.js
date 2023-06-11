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
const router = new Router();

router.post('/set-user', async (req, res) => {
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
    if (await requireAuth(req, res)) {
        if (req.session.user.permissions.users_control) {
            const { name, username, password } = req.body;

            if (username & password) {
                const DB = await useDB;
                let alreadyExists = await DB.users.findUser('' + username);
                if (alreadyExists) {
                    let user = alreadyExists;
                    console.log(name, username, password)
                    if (user.isAdmin() && !req.session.user.isAdmin()) {
                        throw 403;
                    }

                    user.modify({ name, username, password });

                    /* for (let key of ['actis-control', 'assis-control', 'users-control']) {
                        if (req.body[key] === true) {
                            user.allow(key);
                        } else if (req.body[key] === false) {
                            user.disallow(key);
                        }
                    } */


                }

            }
        } else {
            throw 403;
        }
    }
} catch (e) {
    if (e == 403) {
        console.error('ERROR: Trying to set Admin user');
        res.status(403).send("You don't have permission to set this user.");
    } else {
        throw e;
    }
}
})

module.exports = router;