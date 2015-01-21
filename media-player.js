var FileCollection = new Meteor.Collection('FileCollection');
if (Meteor.isClient) {
  Template.hello.helpers({
    files: function(){
      var files = FileCollection.find({'username': 'loupax'}).fetch();
      if(files.files){files.files.sort(function(a,b){ return a.localeCompare(b);});}
      return files;
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    var watcher = chokidar.watch('/Users/loupax/media-player',{ignored: /^\./, persistent: true});
    var fs = Npm.require('fs');
    var username = process.env.USER;

    var fileSystem = [];

    var saveFileSystem = function saveFileSystem(){
        if(FileCollection.findOne({username: username})){
          FileCollection.update({username: username}, {$set:{ files: fileSystem}});
        }else{
          FileCollection.insert({username: username, files: fileSystem});
        }
    };

    var fileAdded   = function fileAdded(path){
        fileSystem.push(path);
        saveFileSystem();
    };

    var fileChanged = function fileChanged(path){};
    var fileRemoved = function fileRemoved(path){ 
      fileSystem.splice(fileSystem.indexOf(path), 1);
      saveFileSystem();
    };
    var fileWatchError = function fileWatchError(path){};
    
    watcher.on('add', Meteor.bindEnvironment(fileAdded))
    .on('change',     Meteor.bindEnvironment(fileChanged))
    .on('unlink',     Meteor.bindEnvironment(fileRemoved))
    .on('error',      Meteor.bindEnvironment(fileWatchError));
  });
}
