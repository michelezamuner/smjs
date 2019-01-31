module.exports = process.env.SM_ENV === 'test'
    ? require('./config-test')
    : require('./config-app');
