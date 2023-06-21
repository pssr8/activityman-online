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
        if (await requireAuth(req, res, next)) {
            res.render('dashboard/home', { title: 'Home', appChassis: res.appChassis, user: req.session.user });
        }
    } catch (e) {
        next(e);
    }
})

router.get('/actis', async (req, res, next) => {
    try {
        if (await requireAuth(req, res, next)) {

            const DB = await useDB;
            let actis = await DB.actis.getAll();
            res.render('dashboard/actis', { title: 'Activities', appChassis: res.appChassis, user: req.session.user, actis });
        }
    } catch (e) {
        next(e);
    }
})

router.get('/assis', async (req, res, next) => {
    try {
        if (await requireAuth(req, res, next)) {

            const DB = await useDB;
            let assis = await DB.assis.getAll();
            res.render('dashboard/assis', { title: 'Assistants', appChassis: res.appChassis, user: req.session.user, assis });
        }
    } catch (e) {
        next(e);
    }
})

router.get('/users', async (req, res, next) => {
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
});

router.get('/langs', async (req, res, next) => {
    try {
        if (await requireAuth(req, res, next)) {

            const DB = await useDB;
            let langs = await DB.langs.list();
            res.render('dashboard/langs', { title: 'Languages', appChassis: res.appChassis, user: req.session.user, langs });
        }
    } catch (e) {
        next(e);
    }
})

// EDIT
router.get('/assi-edit/:oid', async (req, res, next) => {
    try {
        await requireAuth(req, res, next)

        const DB = await useDB;
        let { oid } = req.params;
        let assi = await DB.assis.get(oid);

        if (!assi) {
            res.status(404).send("Couldn't find assistant with id #" + oid + "")
            console.log("Couldn't find assi with oid '" + oid + "'. IP-", req.socket.remoteAddress)
            throw 404;
        }
        
        res.render('dashboard/edit/assi', { title: 'Assistant editor', appChassis: res.appChassis, user: req.session.user, assi });


    } catch (e) {
        next(e);
    }
})

router.get('/acti-edit/:oid', async (req, res, next) => {
    try {
        await requireAuth(req, res, next);

        const DB = await useDB;
        let { oid } = req.params;

        let acti = await DB.actis.get(oid);

        if (!acti) {
            res.status(404).send("Couldn't find activity with id #" + oid + "")
            console.log("Couldn't find acti with oid '" + oid + "'. IP-", req.socket.remoteAddress)
            throw 404;
        }

        res.render('dashboard/edit/acti', { title: 'Activity editor', appChassis: res.appChassis, user: req.session.user, acti });


    } catch (e) {
        next(e);
    }
})

module.exports = router;