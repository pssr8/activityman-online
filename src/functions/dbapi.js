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

const { requireAuth } = require("../auth");

/**
 * 
 * @param {string[]} perms 
 */
async function checkPermissionsFor(perms, req) {
    if (!req) {
        throw new Error("Please provide a 'req' parameter.")
    }
    /* If not logged in */
    await requireAuth(req);

    /* If doesn't have enough permissions */
    for (const perm in perms) {
        if (req.session.user.permissions[perm] === false) {
            console.serror(req, 'ERROR: Missing required permission: "' + perm + '".');
            throw 403;
        }
    }


}

function ifIsAdmin (user, me) {
    /* If user is admin */
    if (user.isAdmin() && !me.isAdmin()) {
        console.error('ERROR: Trying to set Admin user');
        throw 403;
    }
}

module.exports = {checkPermissionsFor, ifIsAdmin};