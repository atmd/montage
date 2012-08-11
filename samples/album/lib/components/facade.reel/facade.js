/* <copyright>
Copyright (c) 2012, Motorola Mobility LLC.
All Rights Reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice,
  this list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of Motorola Mobility LLC nor the names of its
  contributors may be used to endorse or promote products derived from this
  software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
</copyright> */
var Montage     = require("montage/core/core").Montage,
    Component   = require("montage/ui/component").Component;

exports.Facade = Montage.create( Component, {

    iTunes: {
        value: false,
        serializable: true
    },

    appData: {
        value: null,
        serializable: true
    },

    audioLoop: {
        value: null,
        serializable: true
    },

    slot: {
        value: null,
        serializable: true
    },

    homeContent: {
        value: null,
        serializable: true
    },

    galleryContent: {
        value: null,
        serializable: true
    },

    songlistContent: {
        value: null,
        serializable: true
    },

    songContent: {
        value: null,
        serializable: true
    },

    creditsContent: {
        value: null,
        serializable: true
    },

    player: {
        value: null,
        serializable: true
    },

    playList: {
        value: false,
        serializable: true
    },

    currentSong: {
        value: null,
        serializable: true
    },

    currentSection: {
        value: null,
        serializable: true
    },

    templateDidLoad: {
        value: function() {
            this.application.facade = this;
        }
    },


    prepareForDraw: {
        value: function(){

            if( window.iTunes )
            {
                this.iTunes = true;
                window.addEventListener( "play", this, false);
            }

            this.currentSong = this.appData.songs[0].src;

            // this is just a temporary hack to prevent overflow scrolling on iPad
            document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

            this.startApp();

        }
    },


    startApp: {
        value: function(event){

            this.switchView( "home" );

        }
    },

    playerStopped: {
        value: function(event){

            this.playNextSong();

        }
    },

    playSong: {
        value: function(song){


            this.currentSong = song;

            if( this.iTunes )
            {
                window.iTunes.play( this.currentSong  );
            }
            else
            {
                this.songContent.switchVisualizer();
                this.player.playSong( this.currentSong );

            }


        }
    },

    playNextSong: {
        value: function(event){

           var song = this.getNextSong( this.currentSong  );

            this.playSong( song );

        }
    },

    getNextSong: {
        value: function(song){


            var nextSong = null;

            var songsArray = this.appData.songs;

            for( var i=0, length = songsArray.length; i<length; i++ )
            {

                if( songsArray[i].src == song )
                {

                    if( songsArray[i+1] )
                    {
                        nextSong = songsArray[i+1].src;
                    }
                    else
                    {
                        nextSong = songsArray[0].src;
                    }

                    break;

                }


            }

            return nextSong;

        }
    },

    playPrevSong: {
        value: function(event){

            var song = this.getPrevSong( this.currentSong  );

            this.playSong( song );

        }
    },

    getPrevSong: {
        value: function(song){


            var prevSong = null;

            var songsArray = this.appData.songs;

            for( var i=0, length = songsArray.length; i<length; i++ )
            {

                if( songsArray[i].src == song )
                {

                    if( songsArray[i-1] )
                    {
                        prevSong = songsArray[i-1].src;
                    }
                    else
                    {
                        prevSong = songsArray[length-1].src;
                    }

                    break;

                }
            }

            return prevSong;

        }
    },


    buildNonLibraryPlayList: {
        value: function(tracks){

            var tracklistObj = iTunes.createTempPlaylist();
            var tracklist = [];

            for (var i = 0; i < tracks.length; i++){
                var track       = {};
                track.url       = tracks[i].src;
                track.title     = tracks[i].title;
                track.artist    = this.appData.feature.artist;
                track.album     = this.appData.feature.title;
                console.log("adding: " + track.title + " (" + track.url + ")");
                tracklist.push(track);
          }

                console.log("pushing to tracklistOb");
                tracklistObj.addURLs(tracklist);
                return tracklistObj;

        }
    },

    playSonglistSong: {
        value: function( song ){

            this.songContent.backParameter = "songlist";

            this.switchView( "song" );



            this.playSong( song );

        }
    },



    playAlbum: {
        value: function(){

            this.songContent.backParameter = "home";

            this.switchView( "song" );



            if( this.iTunes )
            {
                var playlist = this.buildNonLibraryPlayList( this.appData.songs );
                playlist.play();
            }
            else
            {
                this.playSong( this.appData.songs[0].src );
            }

        }
    },

    switchView: {
        value: function( detail ){

            this.currentSection = this[ detail + "Content" ];

            console.log( "switching view method", this[ detail + "Content" ], this.slot.content, this.currentSection );

        }
    },

    goBackFrom: {

        value: function( section )
        {

            this.switchView( "home" );

        }
    }


});




