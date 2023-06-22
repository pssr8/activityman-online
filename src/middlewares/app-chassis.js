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


module.exports = (req, res, next) => {
    if (req.session.loggedin) {

        res.chassis = {};

        let nav = [
            {
                name: 'Home',
                pathname: '/',
            }
        ];

        let { user } = req.session;
        let perms = user.permissions;

        if (perms['actis_control']) {
            nav.push({
                name: 'Activities',
                pathname: '/actis',
            });
        }
        if (perms['assis_control']) {
            nav.push({
                name: 'Assistants',
                pathname: '/assis',
            });
        }
        if (perms['users_control']) {
            nav.push({
                name: 'Users',
                pathname: '/users',
            });
        }
        if (user.admin) {
            nav.push({
                name: 'Languages',
                pathname: '/langs',
            });
        }

        nav.push({
            name: 'Logout',
            pathname: '/logout',
        });

        res.chassis.nav = nav;
        res.chassis.sessionUser = user;
        res.chassis.virtualPath = req.path.split('/').filter(Boolean).join('/');

    }
    next();
}