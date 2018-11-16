var _ = require("lodash")
var rp = require('request-promise');

module.exports = (apiKey) => {

    var photoSetsOptions = {
        uri: 'https://api.flickr.com/services/rest',
        qs: {
            method: 'flickr.photosets.getList',
            primary_photo_extras : 'url_s',
            user_id : '67828456@N07',
            api_key: apiKey,
            per_page : 10,
            nojsoncallback : 1,
            format : 'json'
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    }

        return rp(photoSetsOptions)
            .then((data) => {
                return data.photosets.photoset.map((p) => { return p.id })
            })
            .then((ids) => {

                var a = _.map(ids, (id) => {
                    return rp(
                       {
                            uri: 'https://api.flickr.com/services/rest',
                            qs: {
                                method: 'flickr.photosets.getPhotos',
                                user_id : '67828456@N07',
                                api_key: apiKey,
                                photoset_id : id,
                                extras : 'url_m,url_s',
                                nojsoncallback : 1,
                                format : 'json'
                            },
                            headers: {
                                'User-Agent': 'Request-Promise'
                            },
                            json: true
                        } 
                    )
                })

                return Promise.all(a).then((p) => { return p })
            })
            .then((photos) => {
                
                var p = _.map(_.flatten(_.map(photos, 'photoset.photo')), (photo) => {
                    return {url_m : photo.url_m, title : photo.title, id : photo.id}
                })
                
                return p
                
            })
            .then((photos) => {
                
                var a = _.map(photos, (photo) => {
                   
                    return rp(
                        {
                            uri: 'https://api.flickr.com/services/rest',
                            qs: {
                                method: 'flickr.photos.getExif',
                                user_id : '67828456@N07',
                                api_key: apiKey,
                                photo_id : photo.id,
                                nojsoncallback : 1,
                                format : 'json'
                            },
                            headers: {
                                'User-Agent': 'Request-Promise'
                            },
                            json: true
                        }
                    ).then((p) => { 
                        var exifProperties = ['Make', 'Model', 'ISO', 'ExposureTime', 'FNumber', 'LensModel', 'Lens', 'FocalLength']
                        var v = _.map(exifProperties, (property) => {
                            var w = _.find(p.photo.exif, (e) => {
                                return e.tag == property
                            })
                            var exifProp = {}
                            exifProp[property] = ''
                            if(w !== undefined) {
                                exifProp[property] = w.raw._content
                            }
                            return exifProp
                            
                        })
                        
                        photo['exif'] = {}
                        _.forEach(v, (i) => {
                            for(var key in i) {
                                photo['exif'][key] = i[key]
                            }
                        })

                        return photo
                    })
                })
                
                return Promise.all(a).then((p) => { return p })

            })
            .then((photos) => {
                    var a = _.map(photos, (photo) => {
                        return rp(
                            {
                                uri: 'https://api.flickr.com/services/rest',
                                qs: {
                                    method: 'flickr.photos.getSizes',
                                    user_id : '67828456@N07',
                                    api_key: apiKey,
                                    photo_id : photo.id,
                                    nojsoncallback : 1,
                                    format : 'json'
                                },
                                headers: {
                                    'User-Agent': 'Request-Promise'
                                },
                                json: true
                            }
                        ).then((p) => {
                            photo['sizes'] = {}
                            _.forEach(p.sizes.size, (i) => {
                                photo['sizes'][i['label']] = i
                            }) 
                        
                            return photo
                        })

                    })

                    return Promise.all(a).then((p) => { return p })
                    
            })
}