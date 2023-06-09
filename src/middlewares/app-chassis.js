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
    res.appChassis = {
        bar: {
            list: [
                {
                    name: 'Home',
                    pathname: '/',
                },
                {
                    name: 'Activities',
                    pathname: '/actis',
                },
                {
                    name: 'Assistants',
                    pathname: '/assis',
                },
                {
                    name: 'Users',
                    pathname: '/users',
                },
                {
                    name: 'Languages',
                    pathname: '/langs',
                }
            ]
        },
        top: {
            virtualPath: req.path.split('/').filter(Boolean).join('/')
        }
    }

    next();
}