// Create a vocabulary of gestures and ignore the gestures given? or use those gestures as well? 
var Leap = require("leapjs");
var itunes = require("./itunes")
var motions = require("./motions")

var swipe = {
  start: false,
  start_pos : null,
  start_dir : null,
};

var precise_hands = {
  start : false,
  hands: [],
  main_hand: null,
  still_hand: null,
  start_pos: null,
  start_dir: null,
  current_frame : null
  
};

/* GESTURES */

/*  this should move the servo in a clockwise or counter
    clockwise direction */
var circle_gesture = function(gesture){
  console.log('circle');
}

/*  this should do nothing? */
var key_tap_gesture = function(gesture){
  console.log('key');

  }

/* manages play/pause */

var screen_gesture = function(gesture){
  console.log('screen');
  console.log(itunes.play_pause());
}

/* controls the volume and the music forward and backward */

var swipe_gesture = function(gesture){
  //console.log('in swipe gesture');
  var swipe_g =  Leap.Gesture.createGesture(gesture);
  

  if (swipe_g.state == 'start'){
  console.log('start');
  var gesture_dir = gesture.direction;
  //get the vectors of the gesture direction
  var x = gesture_dir[0];
  var y = gesture_dir[1];
  var z = gesture_dir[2];
  //horizontal direction:
  if (Math.abs(x) > Math.abs(y)){
    swipe.start = true;
    swipe.swipe_start_position = swipe_g.position;
    swipe.swipe_start_direction = swipe_g.direction;
    }
  }
  if (swipe_g.state == 'update'){
    var gesture_dir = gesture.direction;
    //get the vectors of the gesture direction
    var x = gesture_dir[0];
    var y = gesture_dir[1];
    var z = gesture_dir[2];

    if (Math.abs(x) < Math.abs(y)){
      if (y > 0){
        console.log("vol up");
        itunes.volume(1);
      }
      else{
        console.log("vol down");
        itunes.volume(-1);
      }
    }
  } 
  if (swipe_g.state == 'stop'){
    if (swipe.start){
      swipe.start = false;
      var distance = Leap.vec3.distance(swipe.swipe_start_position,swipe_g.position);
      console.log('distance:')
      console.log(distance);
      if (distance > 20){
        var x = swipe.swipe_start_direction[0];
        if (x > 0){
          console.log('next track');
          console.log(itunes.forward());
        }
        else {
          console.log('previous track');
          console.log(itunes.previous_song());
        }
      }
    }
  }

	
};

var perform_custom_gesture = function (frame, callback){
  //if the gesture has not already started..
  console.log("in pcg");
  if (precise_hands.start == false){
    // make it true
    precise_hands.start = true;
    // add the hands
    precise_hands.hands = frame.hands;
    // figure out which hand id goes with each one - the one with the 
    // bigger radius is the one that is still. 
    if (frame.hands[0].sphereRadius > frame.hands[1].sphereRadius){
      precise_hands.still_hand = frame.hands[0];
      precise_hands.main_hand = frame.hands[1];
    }
    else
    {
      precise_hands.still_hand = frame.hands[1];
      precise_hands.main_hand = frame.hands[0];
    }
    precise_hands.start_pos = precise_hands.main_hand.stabilizedPalmPosition;
    precise_hands.current_frame = frame;
    //console.log(precise_hands);
  }
  else
  {
    console.log("rotating");
    var current_position = precise_hands.main_hand.stabilizedPalmPosition;
    var distance = Leap.vec3.distance(precise_hands.start_pos, current_position);
    var rot_angle = precise_hands.main_hand.rotationAngle(precise_hands.current_frame);
    console.log(rot_angle);
    //move the stepper that much of an angle
    motions.move_stepper(rot_angle, 1, function(){
        
        // make the current frame the current frame after moving
        precise_hands.current_frame = frame;
        callback();
    });

    
  }
}


/*  reads in a gesture - this is what is called. 
    We then need to match that gesture and etc. */

var read_gesture = function(callback){
   Leap.loop({enableGestures: true}, function(frame){
      //console.log(Leap);
      if (frame.gestures && frame.gestures.length > 0)
        {
         perform_gestures(frame, frame.gestures, function(){

         });
        }
  });

  }

/* matches the gestures based on the pre-determined
  type of gesture in order to do the action */
var match_gestures = function(gesture){
    var g_type = gesture.type;
    //console.log(g_type);
    if (g_type == 'swipe'){
      swipe_gesture(gesture);
    }
    else if (g_type == 'circle'){
      circle_gesture(gesture);
    }
    else if (g_type == 'screenTap'){
      screen_gesture(gesture);
    }
    else if (g_type == 'keyTap'){
      key_tap_gesture(gesture);
    }
}

/*  this is where we evaluate whether the gesture is a predetermined one 
    or not */
var perform_gestures = function (frame,gestures,callback){
  if (frame.hands){
    //  if the number of hands in the frame is 1 then use the gestures that
    //  are given (swipe etc)
    if (frame.hands.length == 1){
      //console.log("not registering two hands");
      gestures.forEach(function(g){
      match_gestures(g);
            //reset precise hands if it has changed
      //console.log("resetting precise hands");
      precise_hands.start = false;
      });
    } 
    // if the number of hands is 2 then control the stepper motor
    else if (frame.hands.length >= 2){
      //then we need to look at the radius 
      //console.log("what is going on");
      perform_custom_gesture(frame, function(){

      });
    
    }
    else
    {
      //reset precise hands if it has changed
      //console.log("resetting precise hands");
      precise_hands.start  = false;
    }

  }
  else
  {
    precise_hands.start = false;
  }
}



exports.read_gesture = read_gesture;