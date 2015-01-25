<div layout="column" layout-fill ng-controller="MediaPlayerController">
  <md-toolbar md-scroll-shrink>
    <div class="md-toolbar-tools">
      <md-input-container flex="100" class="search-bar">
	  		<input placeholder="What do you want to watch right now?" tabindex="1" ng-model="searchText" required type="search">
	  </md-input-container>
    </div>
  </md-toolbar>
  
  <md-content style="height: 600px;">
    <div md-list ng-if="searchText && !isClosed" class="slide-down-if">
		<md-item ng-repeat="file in files[0].files|filter:searchText" tabindex="{{$index + 2}}" ng-click="play(file); closeMenu();">
			<md-content>{{file|filename}}</md-content>
			<md-divider inset></md-divider>
		</md-item>
	</div>
    <md-card class="media-player">
		<md-content flex="100" layout="column" layout-align="top end">
			<video src="{{url}}" ng-class="playerMode" autoplay controls></video>
		</md-content>
	</md-card>
  </md-content>
</div>

