var injection = "var player = document.getElementById('movie_player');function play() {player.playVideo()}; function pause() {player.pauseVideo()};";
var script = document.createElement('script');
script.appendChild(document.createTextNode(injection));
document.head.appendChild(script);