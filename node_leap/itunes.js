var $ = require('NodObjC');
$.framework('Foundation');
$.framework('ScriptingBridge');

var itunes = $.SBApplication('applicationWithBundleIdentifier', $.NSString('stringWithUTF8String', 'com.apple.iTunes'));

var get_current_song = function(){
  var current_song = itunes('currentTrack');
  return [current_song('name'), current_song('artist'), current_song('album')];
}

var forward_song = function(){
 itunes('nextTrack');
 return get_current_song();
}

var play_pause = function(){
  itunes('playpause');
  return get_current_song();
}

var back_song = function(){
  itunes('previousTrack');
  return get_current_song();
}

var increase_volume = function(){      
  itunes('setSoundVolume', itunes('soundVolume') + 1);
  console.log(itunes('soundVolume'));
  return itunes('soundVolume');
}

var decrease_volume = function(){
  itunes('setSoundVolume', itunes('soundVolume') - 1);
  return itunes('soundVolume');
}

var volume = function(direction){
  if (direction > 0)
    return increase_volume();
  else if (direction < 0)
    return decrease_volume();
  else
    return [];
}

exports.forward = forward_song;
exports.play_pause = play_pause;
exports.previous_song = back_song;
exports.volume = volume;

