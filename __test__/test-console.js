const exConsole = require('../dist')

exConsole.info('info text')
exConsole.warn('warning text')
exConsole.error('error text')
exConsole.success('success text')

const stopLoading = exConsole.loading('loading....')
setTimeout(() => {
  stopLoading('loading done.', 'ERROR')
  exConsole.info('all done.')
}, 1000)
