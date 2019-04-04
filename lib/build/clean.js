const fs = require('fs');

module.exports = (folder) => {
    return new Promise((resolve, reject) => {
        const fileList = [];
        fs.readdirSync(folder).forEach((file) => {
            const curPath = `${folder}/${file}`;
            if (fs.lstatSync(curPath).isDirectory()) {
                reject(new Error(`${curPath}: isDirectory()`));
            }
            fileList.push(file);
            fs.unlinkSync(curPath);
        });
        resolve(folder);
    });
};
