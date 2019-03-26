const templater = require('../templater');

module.exports = (folder) => {
    const indexData = {
        config: {
            title: 'cieclarke.com',
            subtitle: '| Home',
            navigation: { p: '' }
        }
    };

    templater('templates/index.ejs', folder, indexData, { filename: 'index.htm' });
};
