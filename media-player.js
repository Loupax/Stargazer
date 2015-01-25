// Supported audio formats
var audioFormats = ['wav', 'mp3', 'ogg'];
  // Supported video formats
var videoFormats = ['3gp', '3gpp', 'avi', 'flv', 'mov', 'mpeg', 'mpeg4', 'mp4', 'webm', 'wmv'];
// An object containing the supposedly mime type of each extension (there are libraries for that)
// but we do not need so much stuff yet
var mimeTypes = {mp3: 'audio/mpeg', mpeg:'video/mpeg', mp4: 'video/mp4', wav: 'audio/wav', ogg:'audio/ogg', flv: 'video/flv'};
var mediaFormats = audioFormats.concat(videoFormats);

// The username is used as a key in the database
var username = 'loupax';
// OMG! You can see my media files!
var mediaPaths = ['/Users/loupax/Movies', '/Users/loupax/Pictures', '/Users/loupax/Music'];


Router.route('/','mediaPlayer');
Router.route('/media/:full_path', {where: 'server'}).get(function(){
  
  var file = this.params.full_path;
  // Do not allow sending of no media files
  if(!isMediaFile(file)){
    this.response.writeHead(403, {'content-Type':'text/plain'});
    this.response.end('You shouldn\'t request a non-media file... Now I know where you live punk');
    return;
  }
  var fs = Npm.require('fs');
  var stat = fs.statSync(file);
  
  this.response.writeHead(200, {
        'Content-Type': mimeTypes[file.split('.').toLowerCase] || 'text/html',
        'Content-Length': stat.size
  });

  var readStream = fs.createReadStream(file);
  readStream.pipe(this.response);
});


var isMediaFile = function isMediaFile(path){
  return mediaFormats.indexOf(path.split('.').pop().toLowerCase()) > -1;
};

var FileCollection = new Meteor.Collection('FileCollection');
if (Meteor.isClient) {
  angular.module('stargazer',['angular-meteor','ngMaterial']).
  config(function($mdThemingProvider) {
  
  }).
  controller('MediaPlayerController', ['$scope', '$meteorCollection', function($scope, $meteorCollection){
    $scope.files = $meteorCollection(function(){return FileCollection.find({'username':username})});
    $scope.url;
    $scope.playerMode = 'audio';
    $scope.play = function(file){
      $scope.url = '/media/'+encodeURIComponent(file);
      $scope.playerMode = (audioFormats.indexOf(file) > -1)?'audio':'video';
    }
    $scope.closeMenu = function(){
      $scope.isClosed = true;
    }
    $scope.$watch('searchText', function(){
      $scope.isClosed = false;
    });
  }]).filter('filename', function(){
    return function(input){
      return input.split('/').pop();
    }
  }).filter('filenameFilter', function(){
    return function(input){
      console.log(arguments);
      return input;
    };
  }).directive('gotFocus', function(){
    return {
      link: function(scope, element){
        element.on('focus',function(){
          alert('Got focus!');
        });
      }
    }
  });
}

if(Meteor.isServer){
Meteor.startup(function () {
    var watcher = chokidar.watch(mediaPaths,{ignored: [/[\/\\]\./, function(a){ return !isMediaFile(a);}], persistent: true});
    var fs = Npm.require('fs');

    var fileSystem = [];

    var saveFileSystem = function saveFileSystem(){
        if(FileCollection.findOne({username: username})){
          FileCollection.update({username: username}, {$set:{ files: fileSystem}});
        }else{
          FileCollection.insert({username: username, files: fileSystem});
        }
    };

    var fileAdded   = function fileAdded(path){
        if(isMediaFile(path)){
          fileSystem.push(path);
          saveFileSystem();
        }
    };

    var fileChanged = function fileChanged(path){};
    var fileRemoved = function fileRemoved(path){ 
      var index = fileSystem.indexOf(path);
      if(index > -1){
        fileSystem.splice(index, 1);
        saveFileSystem();
      }
    };
    var fileWatchError = function fileWatchError(path){};
    
    watcher.on('add', Meteor.bindEnvironment(fileAdded))
    .on('change',     Meteor.bindEnvironment(fileChanged))
    .on('unlink',     Meteor.bindEnvironment(fileRemoved))
    .on('error',      Meteor.bindEnvironment(fileWatchError));
  });
}