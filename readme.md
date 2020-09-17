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