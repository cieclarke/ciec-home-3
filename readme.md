# Website Template

## Summary

This website uses Flickr and Tumblr as it's datastores. NodeJS accesses the APIs from these websites and creates HTML files from their data.

## Environment variables

- FLICKR_API
- FLICKR_USER
- FLICKR_URI="https://api.flickr.com/services/rest"
- TUMBLR_API
- FTP_USER
- FTP_PASSWORD
- FTP_HOST
- DEPLOYMENT_FOLDER
- DEPLOYMENT_TYPE="FOLDER|FTP"
- NODE_PATH="/usr/local/lib/node_modules"

## Building files

`npm run build`

## Development notes

This site is deployed to a Raspberry Pi development server. `node-sass` is running but it is a global `npm` install therefore NODE_PATH is needed to run the build.

## systemctl examples

### executable

                #!/bin/sh

                git clone user@server:/cieclarke.com stage.cieclarke.com
                cd cieclarke.com
                git fetch
                git checkout origin/stage
                npm install
                npm run build
                rsync /build/stage.cieclarke.com/*.* /www/stage.cieclarke.com

### serivce

                [Unit]
                Description=cieclarke.com deploy to live
                Wants=cieclarke.com.deploy-live.timer

                [Service]
                Environment=NODE_ENV="production"
                Environment=NODE_PATH=/usr/lib/node_modules
                Environment=FLICKR_API=""
                Environment=FLICKR_USER=""
                Environment=TUMBLR_API=""
                Environment=FTP_USER="dev"
                Environment=FTP_PASSWORD=""
                Environment=FTP_HOST="ftp.com"
                Environment=DEPLOYMENT_FOLDER="/live.cieclarke.com"
                Environment=DEPLOYMENT_TYPE="FOLDER"
                WorkingDirectory=/naboo/src
                User=cieclarke
                ExecStart=/naboo/bin/ciec-deploy

### service timer

                [Install]
                WantedBy=cieclarke.com.deploy-live.target

                [Unit]
                Description=deploy ciecclarke.com live Timer

                [Timer]
                OnCalendar=*-*-* 18:00:00
                Unit=cieclarke.com.deploy-live.service

                [Install]
                WantedBy=multi-user.target
