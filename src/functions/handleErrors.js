/**
 * Handle status code
 * @param { {[c:string]: string} } messages an object containing error messages for each status code.
 * If there is no message found, default message is used.
 */
function handleResponseCode (e, res, next, messages = {}) {
    const defaultMessages = {
        403: "You don't have permission to acces this ressource.",
        400: "Bad request.",
        404: 'Ressource not found.'
    };

    if (e in defaultMessages) {
        res.status(e).send(messages[e] || defaultMessages[e]);
    } else {
        res.status(500).render(e.message);
        next(e);
    }
};

module.exports = { handleResponseCode };