module.exports = {
    events: 'onPreHandler',
    method: (request, h) => {
        if (!request.payload) request.payload = {};
        return h.continue;
    }
}