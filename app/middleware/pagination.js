const { get, parseInt } = require('lodash');

exports.parseReqQueryParam = (req, res, next) => {
    const search = get(req, 'query.search', '');
    const status = get(req, 'query.status', '');
    const reqPage = parseInt(get(req, 'query.page', 0));
    const page = (reqPage >= 0) ? reqPage : 0;
    let limit = parseInt(get(req, 'query.limit', 10));
    let sortBy = get(req, 'query.sortBy', '');
    const sortOrder = get(req, 'query.sortOrder', 'asc');
    let skip = 0;

    if (![5, 10, 25, 50].includes(limit)) {
        limit = 10;
    }
    skip = (page) * limit;
    const query = {
        ...req.query,
        skip,
        limit,
        sortBy,
        sortOrder,
        page,
        search,
        status
    }
    req.query = query;
    next();
}