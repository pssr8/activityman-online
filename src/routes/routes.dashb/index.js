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


/* middlewares */
router.use(require('../../middlewares/app-chassis'));

/* routers */

router.get('/', async (req, res, next) => {
    try {
        await requireAuth(req, res, next)

        res.render('dashboard/home', { title: 'Home', chassis: res.chassis });

    } catch (e) {
        next(e);
    }
})

router.use('/actis', require('./actis'));
router.use('/assis', require('./assis'));
router.use('/users', require('./users'));


router.get('/langs', async (req, res, next) => {
    try {
        if (await requireAuth(req, res, next)) {

            const DB = await useDB;
            let langs = await DB.langs.list();
            res.render('dashboard/langs', { chassis: res.chassis, langs });
        }
    } catch (e) {
        next(e);
    }
})


module.exports = router;