const NodeCache = require('node-cache');

const cache = new NodeCache();

module.exports = duration => (req, res, next) => {
    const key = req.originalUrl;
    const cachedResponse = cache.get(key);
    if (cachedResponse) {
        console.log(`Cache hit for ${key}`);
        res.send(cachedResponse);
    }
    else {
        res.sendResponse = res.send;
        res.send = body => {
            cache.set(key, body, duration * 60);
            res.sendResponse(body);
        }
        next();

    }
}