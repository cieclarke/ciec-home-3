/* eslint-disable import/no-extraneous-dependencies */
const sass = require('node-sass');
const fs = require('fs');

module.exports = (folder) => {
    const a = new Promise((resolve, reject) => {
        sass.render({ file: 'css/main.scss' },
            (err, result) => {
                fs.writeFileSync(`${folder}/main.css`, result.css, (writeErr) => {
                    if (writeErr) { reject(new Error(writeErr)); }
                });
                resolve(`${folder}/main.css`);
            });
    });

    return Promise.all([a]).then((p) => { return p; });
};
