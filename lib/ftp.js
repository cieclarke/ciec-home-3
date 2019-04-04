const net = require('net');
const fs = require('fs');
const _ = require('lodash');

module.exports = (srcFilePath) => {
    const fileName = /\/?([^\/]+)$/i.exec(srcFilePath)[1];
    return new Promise((resolve) => {
        const s = net.createConnection(21, `${process.env.FTP_HOST}`);
        s.setKeepAlive(true);
        let port = null;
        let ip = null;
        s.write(`USER ${process.env.FTP_USER}\r\n`);
        s.write(`USER ${process.env.FTP_USER}\r\n`);

        s.on('ready', () => {
            console.log('ready');
        });
        s.on('connect', () => {
            s.write(`USER ${process.env.FTP_USER}\r\n`);

            console.log('connect');
        });
        s.on('end', () => {
            console.log('end');
        });
        s.on('data', (c) => {
            const data = c.toString().trim();
            const code = data.substring(0, 3);
            if (code === '150') {
                const ss = net.createConnection(port, ip);
                ss.setKeepAlive(true);
                ss.on('data', (cc) => {
                    console.log(cc);
                });

                fs.createReadStream(srcFilePath).pipe(ss);
                //ss.end();
                resolve(srcFilePath);
            }
            if (code === '227') {
                console.log(code);
                console.log(data);
                const numbers = /(\d*),(\d*),(\d*),(\d*),(\d*),(\d*)\)\.$/i.exec(data);
                const n1 = `${numbers[1]}.${numbers[2]}.${numbers[3]}.${numbers[4]}`;
                const n2 = numbers[5];
                const n3 = numbers[6];
                port = (parseInt(n2, 10) * 256) + parseInt(n3, 10);
                ip = n1;
            }
        });
        //s.write(`TYPE I\r\n`);

        //s.write(`PASS ${process.env.FTP_PASSWORD}\r\n`);
        //s.write(`CWD /web_dev/new.cieclarke.com\r\n`);
        //s.write(`DELE ${fileName}\r\n`);
        //s.write(`PASV\r\n`);
        //s.write(`STOR ${fileName}\r\n`);
        //s.end();
    });
};
