<md-card layout="row" class="media-player" ng-controller="MediaPlayerController">
	<md-content flex="30">
		<md-list layout="column" class="media-list">
			<md-item class="media-list-item" ng-repeat="file in files[0].files">
				<md-button title="{{file|filename}}" ng-click="play(file)">{{file|filename}}</md-button>
			</md-item>
		</md-list>
	</md-content>
	<md-content flex="70" layout="column" layout-align="top end">
		<video src="{{url}}" controls></video>
	</md-content>
</md-card>