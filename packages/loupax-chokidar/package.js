Package.describe({
  name: 'loupax:chokidar',
  version: '0.12.6',
  summary: "A chokidar wrapper for Meteor"
});

Npm.depends({
  'chokidar': '0.12.6'
});

Package.on_use(function (api) {
  api.add_files('chokidar.js', 'server');
  api.export('chokidar');
});