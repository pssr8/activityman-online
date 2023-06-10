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


router.get('/', async (req, res) => {
    requireAuth(req, res);
    res.render('dashboard/home', { title: 'Home', appChassis: res.appChassis, user: req.session.user });
})

router.get('/actis', async (req, res) => {
    requireAuth(req, res);
    const DB = await useDB;
    let actis = await DB.actis.getAll();
    res.render('dashboard/actis', { title: 'Activities', appChassis: res.appChassis, user: req.session.user, actis });
})

router.get('/assis', async (req, res) => {
    requireAuth(req, res);
    const DB = await useDB;
    let assis = await DB.assis.getAll();
    res.render('dashboard/assis', { title: 'Assistants', appChassis: res.appChassis, user: req.session.user, assis });
})

router.get('/users', async (req, res) => {
    requireAuth(req, res);
    const DB = await useDB;
    let users = await DB.users.getAll();
    res.render('dashboard/users', { title: 'Users', appChassis: res.appChassis, user: req.session.user, users });
})

router.get('/langs', async (req, res) => {
    requireAuth(req, res);
    const DB = await useDB;
    let langs = await DB.langs.list();
    res.render('dashboard/langs', { title: 'Languages', appChassis: res.appChassis, user: req.session.user, langs });
})

// EDIT
router.get('/assi-edit/:oid', async (req, res) => {
    requireAuth(req, res);
    const DB = await useDB;
    let {oid} = req.params;
    let assi = await DB.assis.get(oid);
    if (assi) {
        res.render('dashboard/edit/assi', { title: 'Assistant editor', appChassis: res.appChassis, user: req.session.user, assi });
    } else {
        res.status(404).send("Couldn't find assistant with id #" + oid + "")
        console.log("Couldn't find assi with oid '" + oid + "'. IP-", req.socket.remoteAddress)
    }
})

router.get('/acti-edit/:oid', async (req, res) => {
    requireAuth(req, res);
    const DB = await useDB;
    let {oid} = req.params;
    let acti = await DB.actis.get(oid);
    if (acti) {
        res.render('dashboard/edit/acti', { title: 'Activity editor', appChassis: res.appChassis, user: req.session.user, acti });
    } else {
        res.status(404).send("Couldn't find activity with id #" + oid + "")
        console.log("Couldn't find acti with oid '" + oid + "'. IP-", req.socket.remoteAddress)
    }
})

module.exports = router;