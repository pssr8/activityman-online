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
const useDB = require('../../DB');
const { requireAuth } = require("../../auth");
const router = new Router();


router.get('/', async (req, res, next) => {
    try {

        await requireAuth(req, res, next)

        let { user } = req.session;
        if (!user.permissions['users_control']) {
            throw 403;
        }

        const DB = await useDB;
        let users = await DB.users.getAll();
        res.render('dashboard/users', { title: 'Users', appChassis: res.appChassis, user, users });
    } catch (e) {
        next(e);
    }
})

module.exports = router;