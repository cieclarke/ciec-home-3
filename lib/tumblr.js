/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-underscore-dangle */
// const _ = require('lodash');
const rp = require('request-promise');

module.exports = (apiKey) => {
    const tumblrOptions = {
        uri: 'https://api.tumblr.com/v2/blog/mendipsnow.tumblr.com/posts',
        qs: {
            api_key: apiKey,
            notes_info: true,
            filter: 'text'
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    };

    return rp(tumblrOptions)
        .then((data) => {
            return data;
        });
};
