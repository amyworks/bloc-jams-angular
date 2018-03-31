(function() {
	function SongPlayer() {
		var SongPlayer = {};

		/**
		* @desc clears the currently playing song on page load or reload
		* @type {Object}
		**/
		var currentSong = null;
		/**
		* @desc clears the audio object file on page load or reload
		* @type {Object}
		**/
     	var currentBuzzObject = null;

     	/**
		* @function setSong (private)
		* @desc Stops currently playing song and loads new audio file as currentBuzzObject
		* @param {Object} song 
		**/
     	var setSong = function(song) {
		    if (currentBuzzObject) {
		        currentBuzzObject.stop();
		        currentSong.playing = null;
		    }
		 	
		 	/**
			* @desc Buzz object audio file
			* @type {Object}
			**/
		    currentBuzzObject = new buzz.sound(song.audioUrl, {
		        formats: ['mp3'],
		        preload: true
		    });
		 	
		 	/**
			* @desc currently playing album song title
			* @type {Object}
			**/
		    currentSong = song;
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
			if (currentSong !== song) {
            	setSong(song);		 
		        playSong(song);

	        }else if (currentSong === song) {
		        if (currentBuzzObject.isPaused()) {
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
		    currentBuzzObject.pause();
		    song.playing = false;
		};

		/**
		* @return Returns the SongPlayer service
		**/
		return SongPlayer;
	}
 
	angular
		.module('blocJams')
		.factory('SongPlayer', SongPlayer);
 })();