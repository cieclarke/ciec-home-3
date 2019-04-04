const templater = require('../templater');

module.exports = (folder) => {
    const workData = {
        config: {
            title: 'cieclarke.com',
            subtitle: '| Work'
        }
    };

    return templater('templates/work.ejs', folder, workData, { filename: 'work.htm' });
};
