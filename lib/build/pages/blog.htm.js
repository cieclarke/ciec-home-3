const templater = require('../templater');
const tumblr = require('./../../tumblr');

module.exports = (folder) => {
    Promise.all([tumblr(process.env.TUMBLR_API).done((blogs) => {
        const blogData = {
            config: {
                title: 'cieclarke.com',
                subtitle: '| Blog'
            },
            items: blogs
        };
        templater('templates/blog.ejs', folder, blogData, { filename: 'blog.htm' });
    })
    ]);
};
