const { requireAuth } = require("../auth");

/**
 * 
 * @param {string[]} perms 
 */
async function checkPermissionsFor(perms) {
    /* If not logged in */
    if (!await requireAuth(req, res, next)) {
        throw 403;
    }

    /* If has not enough permissions */
    for (const perm in perms) {
        if (!req.session.user.permissions[perm]) {
            console.error('ERROR: Trying to edit users without "' + perm + '" permission.');
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