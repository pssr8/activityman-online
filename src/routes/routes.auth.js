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
const auth = require("../auth");
const router = new Router();

router.get('/login', (req, res) => {
    if (req.session.loggedin) {
        res.redirect(req.session.lastPage || '/');
    } else {
        res.render('auth/login', { title: 'Log in' })
    }
})

router.get('/logout', (req, res) => {
    auth.logout(req);
    res.send('Logged out!')
})

router.post('/login', async (req, res) => {
    try {
        await auth.loginWith(req);
        res.redirect(req.session.lastPage || '/');
    } catch (e) {
        res.status(404).render('auth/login', { title: 'Log in', addText: 'Incorrect username or password!' })
    }

})

module.exports = router;