const ejs = require('ejs');
const fs = require('fs');

module.exports = (template, dest, data, options) => {
    const rfOptions = {};
    let fileName = /\/?([^\/]+)$/i.exec(template)[1];

    if (options !== undefined && options.length !== 0) {
        fileName = options.filename === undefined ? fileName : options.filename;
    }

    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);
    }

    ejs.renderFile(template, data, rfOptions, (renderErr, str) => {
        if (renderErr) throw renderErr;
        fs.writeFileSync(`${dest}/${fileName}`, str, (writeErr) => {
            if (writeErr) throw writeErr;
        });
    });
};
