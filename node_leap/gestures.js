// Create a vocabulary of gestures and ignore the gestures given? or use those gestures as well? 
var Leap = require("leapjs");
var itunes = require("./itunes")
var motions = require("./motions")


var swipe = {
  start: false,
  start_pos : null,
  start_dir : null,
};

var constants = require('./constants');
var ph = constants.ph;


// this is one second
var FRAME_THRESH = 60;

/* GESTURES */

/*  this should move the servo in a clockwise or counter
    clockwise direction */
var circle_gesture = function(gesture){
  //console.log('circle');
  return;
}

/*  this should do nothing? */
var key_tap_gesture = function(gesture){
  //console.log('key');
  return;
  }

/* manages play/pause */

var screen_gesture = function(gesture){
  return;
}

/* controls the volume and the music forward and backward */

var swipe_gesture = function(gesture){
  //console.log('in swipe gesture');
  var swipe_g =  Leap.Gesture.createGesture(gesture);
  

  if (swipe_g.state == 'start'){
  //console.log('start');
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
    // add the hands
    ph.hands = frame.hands;
    // figure out which hand id goes with each one - the one with the 
    // bigger radius is the one that is still. 
    if (frame.hands[0].sphereRadius > frame.hands[1].sphereRadius){
      ph.still_hand = frame.hands[0];
      ph.main_hand = frame.hands[1];
    }
    else
    {
      ph.still_hand = frame.hands[1];
      ph.main_hand = frame.hands[0];
    }
    ph.start_pos = ph.main_hand.stabilizedPalmPosition;
    //z must be negative and x be position
    if  ph.start_pos[0] > 0 && ph.start_pos[2] < 0){
      //light servo
      if  ph.main_hand.fingers.length == 1){
        if (frame.id - ph.light_servo.frame_no > FRAME_THRESH){
          ph.light_servo.on =  ph.light_servo.on;
          ph.light_servo.frame_no = frame.id;
          //motions.spin_lights ph.light_servo.on);
        }
      }
      //hand servo
      else if  ph.main_hand.fingers.length == 2){
        if (frame.id - ph.hand_servo.frame_no > FRAME_THRESH){
          ph.hand_servo.on =  ph.hand_servo.on;
          ph.hand_servo.frame_no = frame.id
          //motions.move_servo ph.hand_servo.on);
        }
      }
      //stepper
      else if  ph.main_hand.fingers.length == 3){
        if (frame.id - ph.stepper.frame_no > FRAME_THRESH){
          console.log("changing stepper");
          ph.stepper.on =  ph.stepper.on;
          ph.stepper.frame_no = frame.id;
          //motions.move_stepper ph.stepper.on);
        }
      }
    }
    //play/pause
    else if  ph.start_pos[0] < 0 && ph.start_pos[2] < 0){
      if (frame.id - ph.play.frame_no > FRAME_THRESH){
        ph.play.on =  ph.play.on;
        ph.frame_no = frame.id;
        console.log(itunes.play_pause());
      }
    }
    //console.log ph);
  };


var start_components = function(callback){
    //console.log("start components");
    motions.spin_lights ph.light_servo.direction, ph.light_servo.on);
    motions.move_servo ph.hand_servo.on);
    if  ph.stepper.on){
      console.log("in if statement");
      motions.move_stepper(30, ph.stepper.direction, ph.position, ph.stepper.in_motion,
        function(position){
          ph.position += position;
      });
}
/*  reads in a gesture - this is what is called. 
    We then need to match that gesture and etc. */

var read_gesture = function(callback){
  motions.start_board(function(){
    console.log("only called once...");
    Leap.loop({enableGestures: true}, function(frame){
    start_components();
    if (frame.gestures && frame.gestures.length > 0)
    {
     perform_gestures(frame, frame.gestures, function(){
     });
    }
  });

 });
  };

/* matches the gestures based on the pre-determined
  type of gesture in order to do the action */
var match_gestures = function(gesture){
    var g_type = gesture.type;
    //console.log(g_type);
    if (g_type == 'swipe'){
      swipe_gesture(gesture);
    }
    /*else if (g_type == 'circle'){
      circle_gesture(gesture);
    }
    else if (g_type == 'screenTap'){
      screen_gesture(gesture);
    }
    else if (g_type == 'keyTap'){
      key_tap_gesture(gesture);
    }*/
};

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
      ph.start = false;
      });
    } 
    // if the number of hands is 2 then control the stepper motor
    else if (frame.hands.length >= 2){
      //then we need to look at the radius 
      //console.log("what is going on");
      perform_custom_gesture(frame, function(){
      });
    }
  }

};



exports.read_gesture = read_gesture;
