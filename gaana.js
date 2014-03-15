// the following 2 functions make sure the extension is updated 
// when the Gaana.com web app is controlled from the web page

$('.spritePlayer.playPause.pause').on('click', function () {
    // send message to extension saying it is paused
    chrome.runtime.sendMessage({message: "paused"});
});

$('.spritePlayer.playPause.play').on('click', function () {
    // send message to extension saying it is playing
    chrome.runtime.sendMessage({message: "playing"});
});

// DOM Events Listed Below:
//
// DOMNodeInserted
// DOMNodeRemoved
// DOMSubtreeModified

// var songTitle = null, 
//     songArtist = null, 
//     songAlbum = null, 
//     songArt = null;

// $('.playerBarSong').bind("DOMNodeInserted", function () {
//     songTitle = $(this).text();
//     checkIfReadyToSend();
// });

// $('.playerBarArtist').bind("DOMNodeInserted", function () {
//     songArtist = $(this).text();
//     checkIfReadyToSend();
// });

// $('.playerBarAlbum').bind("DOMNodeInserted",function () {
//     songAlbum = $(this).text();
//     checkIfReadyToSend();
// });

// $('.albumArt').bind("DOMNodeInserted", function () {
//     var imgs = $(this).find('img');
//     if (imgs.length > 1) {
//         songArt = $(imgs[1]).attr('src');
//     } else {
//         songArt = $(imgs[0]).attr('src');
//     }
//     checkIfReadyToSend();
// });

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.greeting == "hello") {
            sendResponse({message: "hi"});
            // getSongInfo();
        }
 });

// function getSongInfo() {
//     songTitle = $('.playerBarSong').text();
//     songArtist = $('.playerBarArtist').text();
//     songAlbum = $('.playerBarAlbum').text();
//     var imgs = $('.albumArt').find('img');
//     if (imgs.length > 1) {
//         songArt = $(imgs[1]).attr('src');
//     } else {
//         songArt = $(imgs[0]).attr('src');
//     }
//     checkIfReadyToSend();
// }

// function checkIfReadyToSend() {
//     if ( songTitle != null && 
//          songArtist != null &&
//          songAlbum != null &&
//          songArt != null ) {
//         sendSongChanged();
//     }
    
// }

// function sendSongChanged() {
//     chrome.runtime.sendMessage({ message: "songChanged", 
//                                  songTitle: songTitle, 
//                                  songArtist: songArtist, 
//                                  songArt: songArt,
//                                  songAlbum: songAlbum });

//     // clear all variables for next check
//     songTitle = null;
//     songArtist = null; 
//     songAlbum = null;
//     songArt = null;
// }