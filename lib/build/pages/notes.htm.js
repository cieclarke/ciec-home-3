const templater = require('../templater');
const tumblr = require('../../tumblr');

module.exports = (folder) => {
    return tumblr(process.env.TUMBLR_API).then((notes) => {
        return {
            config: {
                title: 'cieclarke.com',
                subtitle: '| Notes'
            },
            items: notes
        };
    }).then((data) => {
        return templater('templates/notes.ejs', folder, data, { filename: 'notes.htm' });
    });
};
