(function() {
	function SongPlayer($rootScope, Fixtures) {
		var SongPlayer = {};

		var getSongIndex = function(song) {
            return currentAlbum.songs.indexOf(song);
        };

		var currentAlbum = Fixtures.getAlbum();

		/**
		* @desc clears the currently playing song on page load or reload
		* @type {Object}
		**/
		SongPlayer.currentSong = null;
		/**
		* @desc Current playback time (in seconds) of currently playing song
		* @type {Number}
		*/
		SongPlayer.currentTime = null;
		SongPlayer.volume = 80;
		/**
		* @desc clears the audio object file on page load or reload
		* @type {Object}
		**/
     	var currentBuzzObject = null;

     	var stopSong = function(song) {
			currentBuzzObject.stop();			
            SongPlayer.currentSong.playing = null;
		}

     	/**
		* @function setSong (private)
		* @desc Stops currently playing song and loads new audio file as currentBuzzObject
		* @param {Object} song 
		**/
     	var setSong = function(song) {
		    if (currentBuzzObject) {
		        stopSong(song);
		    }
		 	
		 	/**
			* @desc Buzz object audio file
			* @type {Object}
			**/
		    if (currentBuzzObject === null) {
		    	song = currentAlbum.songs[0];
		    	song.playing = true;
		    	currentBuzzObject = new buzz.sound(song.audioUrl, {
			        formats: ['mp3'],
			        preload: true
			    });
		    }else if (currentBuzzObject !== null) {
			    currentBuzzObject = new buzz.sound(song.audioUrl, {
			        formats: ['mp3'],
			        preload: true
			    });
			}

			currentBuzzObject.bind('timeupdate', function() {
		        $rootScope.$apply(function() {
		            SongPlayer.currentTime = currentBuzzObject.getTime();
		        });
		    });
		 	
		 	/**
			* @desc currently playing album song title
			* @type {Object}
			**/
		    SongPlayer.currentSong = song;
		};

		/**
		* @function playSong (private)
		* @desc Plays the the song object called in setSong
		* @param {Object} song
		**/
		var playSong = function(song) {
			currentBuzzObject.play();
            song.playing = true;
		}

		/**
		* @function SongPlayer.play (public)
		* @desc Plays the song object called in setSong from the beginning, otherwise resumes playSong if the currentBuzzObject is paused
		* @param {Object} song
		**/
		SongPlayer.play = function(song) {
            song = song || SongPlayer.currentSong;
            if (SongPlayer.currentSong !== song) {
                setSong(song);
                playSong(song);
            } else if (SongPlayer.currentSong === song) {
                if (currentBuzzObject === null) {
                	setSong(song);
                	playSong(song);
                }else if (currentBuzzObject.isPaused()) {
                    playSong(song);
                }
            }
        };

	    /**
		* @function SongPlayer.pause (public)
		* @desc Pauses the currently playing song
		* @param {Object} song
		**/
	    SongPlayer.pause = function(song) {
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
        };

		SongPlayer.previous = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;

            if (currentSongIndex < 0) {
                stopSong(song);
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };

        SongPlayer.next = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;
            console.log(currentAlbum.songs.length);

            if (currentSongIndex > currentAlbum.songs.length) {
                stopSong(song);
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };

        /**
		* @function setCurrentTime
		* @desc Set current time (in seconds) of currently playing song
		* @param {Number} time
		*/
		SongPlayer.setCurrentTime = function(time) {
		    if (currentBuzzObject) {
		        currentBuzzObject.setTime(time);
		    }
		};

		SongPlayer.setVolume = function(volume) {
            if (currentBuzzObject) {
                currentBuzzObject.setVolume(volume);
            }
        };

		/**
		* @return Returns the SongPlayer service
		**/
		return SongPlayer;
	}
 
	angular
		.module('blocJams')
		.factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
 })();