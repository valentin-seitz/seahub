var page = require('webpage').create(),
    system = require('system'),
    fs = require('fs');

page.paperSize = {
  format: 'A4',
  orientation: 'portrait',
  border: '2cm',
};

page.content = fs.read(system.args[1]);
var output = system.args[2];
var loadTimeout = setTimeout(render, 10000);

page.onLoadFinished = function() {
  clearTimeout(loadTimeout)
  render()
}

function render() {
  page.render(output, {format: 'pdf'});
  page.close()
  window.phantom.exit(0)
}
