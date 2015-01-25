<div layout="column" ng-controller="MediaPlayerController" ng-click="isClosed = true;">
  <md-toolbar md-scroll-shrink>
    <div class="md-toolbar-tools">
      <md-input-container flex="100" class="search-bar">
	  		<input placeholder="What do you want to watch right now?" tabindex="1" ng-click="$event.stopPropagation()" ng-model="searchText" ng-focus="isClosed = false" type="search">
	  </md-input-container>
    </div>
  </md-toolbar>
  
  <md-content>
    <div md-list ng-if="!isClosed" class="slide-down-if">
		<md-item ng-repeat="file in files[0].files|filter:searchText" tabindex="{{$index + 2}}" ng-click="$event.stopPropagation(); play(file); closeMenu($event);">
			<md-content class="search-result-content">{{file|filename}}</md-content>
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

