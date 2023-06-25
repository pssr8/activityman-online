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
const { checkPermissionsFor } = require("../../functions/dbapi");
const router = new Router();


router.get('/', async (req, res, next) => {
    try {
        await checkPermissionsFor(['assis_control'], req);

        const DB = await useDB;

        let assis = await DB.assis.getAll();

        res.render('dashboard/assis', { chassis: res.chassis, assis });

    } catch (e) {
        next(e);
    }
})

router.get('/edit/:oid', async (req, res, next) => {
    try {
        await requireAuth(req, res, next);

        let { user } = req.session;
        if (!user.permissions['assis_control']) {
            throw 403;
        }

        const DB = await useDB;
        let { oid } = req.params;

        let assi = await DB.assis.get(oid);

        if (!assi) {
            throw 404;
        }

        res.render('dashboard/edit/assi', { chassis: res.chassis, assi });


    } catch (e) {
        handleResponseCode(e, res, next, {
            404: function (res, e) {
                res.status(404).send("Couldn't find the assistant you are looking for. If you think it is an error, communicate it to the administrator.")
                console.serror(`Couldn't find assi with OID ${oid}`)
            }
        });
    }
})

module.exports = router;
