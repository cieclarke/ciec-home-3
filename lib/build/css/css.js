const sass = require('node-sass');
const fs = require('fs');

module.exports = (folder) => {
    sass.render({ file: 'css/main.scss' },
        (err, result) => {
            fs.writeFileSync(`${folder}/main.css`, result.css, (writeErr) => {
                if (writeErr) throw writeErr;
            });
        });
};
