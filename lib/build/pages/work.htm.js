const templater = require('../templater');

module.exports = (folder) => {
    const workData = {
        config: {
            title: 'cieclarke.com',
            subtitle: '| Work'
        }
    };

    templater('templates/work.ejs', folder, workData, { filename: 'work.htm' });
};
