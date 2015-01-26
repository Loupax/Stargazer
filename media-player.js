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
  controller('MediaPlayerController', ['$scope', '$meteorCollection','$timeout', function($scope, $meteorCollection, $timeout){
    $scope.files = $meteorCollection(function(){return FileCollection.find({'username':username})});
    $scope.url;
    $scope.file;
    $scope.playerMode = 'audio';
    $scope.isClosed = true;
    $scope.focused = 0;

    $scope.playlist = [];
    
    $scope.startPlaying = function(file){
      // If are not playing a playlist, start playing the file right away
      if($scope.playlist.length === 0){
        $scope.play(file);
        return;
      }

      var fileIndex = $scope.playlist.indexOf(file);
      // If the file already exists, move it at the top of the playlist
      if(fileIndex > -1){
        $scope.playlist.unshift($scope.playlist.splice(fileIndex, 1)[0]);
        $scope.play(file);
        return;
      }

      $scope.playlist.unshift(file);
      $scope.play(file);

    };

    $scope.play = function(file){
      $scope.url  = '/media/'+encodeURIComponent(file);
      $scope.file = file;
      $scope.playerMode = (audioFormats.indexOf(file) > -1)?'audio':'video';
    };
    
    $scope.closeMenu = function($event){
      $event.preventDefault();
      $event.stopPropagation();
      $scope.isClosed = true;
    };

    $scope.isInPlaylist  = function(file){
      return $scope.playlist.indexOf(file) > -1;
    };

    $scope.toggleInPlaylist = function($event, file){
      $event.stopPropagation();
      $event.preventDefault();

      if($scope.playlist.indexOf(file) === -1){
        $scope.playlist.push(file);
      }else{
        $scope.playlist.splice($scope.playlist.indexOf(file), 1);
      }
    };
  }])
  .directive('video', [function(){
    return {
      restrict: 'E',
      controller:'MediaPlayerController',
      link: function link(scope, element, attrs, controller){
        element.get(0).onended = function(){
          // If there is a playlist, play the next media
          if(scope.playlist.length > 0){
            var index = scope.playlist.indexOf(scope.file);
            if(index === scope.playlist.length - 1){
              // The playlist is done playing. Nothing to do
              return;
            }else{
              // Play the next song on the playlist
              scope.play(scope.playlist[index+1]);
            }
          }
        }
      }
    }
  }])
  .filter('filename', function(){
    return function(input){
      return input.split('/').pop();
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