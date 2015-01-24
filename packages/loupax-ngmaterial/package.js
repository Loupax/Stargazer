Package.describe({
  name: 'loupax:ngmaterial',
  summary: ' A package to add Material Design to Angular ',
  version: '1.0.0'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  //JS Files
  api.addFiles('bower_components/angular-material/angular-material.css', 'client');
  api.addFiles('bower_components/hammerjs/hammer.js', 'client');
  api.addFiles('bower_components/angular-animate/angular-animate.js', 'client');
  api.addFiles('bower_components/angular-aria/angular-aria.js', 'client');
  api.addFiles('bower_components/angular-material/angular-material.js', 'client');



  //THEMES
  //api.addFiles('libs/themes/amber-theme.css','client');
  /*api.addFiles('libs/themes/blue-grey-theme.css','client');
  api.addFiles('libs/themes/blue-theme.css','client');
  api.addFiles('libs/themes/brown-theme.css','client');
  api.addFiles('libs/themes/cyan-theme.css','client');
  api.addFiles('libs/themes/deep-orange-theme.css','client');
  api.addFiles('libs/themes/deep-purple-theme.css','client');
  api.addFiles('libs/themes/green-theme.css','client');
  api.addFiles('libs/themes/grey-theme.css','client');
  api.addFiles('libs/themes/indigo-theme.css','client');
  api.addFiles('libs/themes/light-blue-dark-theme.css','client');
  api.addFiles('libs/themes/light-green-theme.css','client');
  api.addFiles('libs/themes/lime-theme.css','client');
  api.addFiles('libs/themes/orange-theme.css','client');
  api.addFiles('libs/themes/pink-theme.css','client');
  api.addFiles('libs/themes/purple-theme.css','client');
  api.addFiles('libs/themes/red-theme.css','client');
  api.addFiles('libs/themes/teal-theme.css','client');
  api.addFiles('libs/themes/yellow-theme.css','client');*/


});
