var five = require('johnny-five'),
    board = new five.Board();
var hd = require('./constants')


//variables for the mechanical components
var light_servo, stepper, servo;



var start_board = function(callback){
    board.on("ready", function(){
      stepper = new five.Stepper({
        type: five.Stepper.TYPE.FOUR_WIRE,
        stepsPerRev: 200,
        pins: [ 6,7,8,9 ]});
      light_servo = new five.Servo({
        pin: 11,
        type: "continuous"
      });
      servo = new five.Servo({
        pin: 10,
        type: "standard",
        startAt: 90,
        range: [0,180]
      }) 
      callback();
    }); 
  };

//functions that perform different things

/** moves the stepper in a positive 
    or negative direction  the right number of degrees */


// moves the stepper a certain number of beats per minute
var move_stepper = function(bpm, callback){
  current_stepper = hd.ph().stepper;
  if (current_stepper.in_motion || !current_stepper.on){
    //console.log("doing nothing");
    return;
  }

 hd.set_stepper_motion(true);
 console.log("move_stepper");
 stepper.rpm(bpm).direction(five.Stepper.DIRECTION.CCW).accel(1600).decel(1600).step(180, function() {
    console.log("done moving CCW");

    // once first movement is done, make 10 revolutions clockwise at previously
    //      defined speed, accel, and decel by passing an object into stepper.step
    stepper.step({
      steps: 180,
      direction: five.Stepper.DIRECTION.CCW
    }, function() {
      console.log('done moving CW');
      hd.set_stepper_motion(false);
    });
  });
  };



/** moves the servo in the direction given */
var move_servo = function(){
  var current_servo = hd.ph().hand_servo;
  if (current_servo.in_motion){
    console.log('servo_motion')
    return;}
  if (current_servo.on){
    current_servo.in_motion = true;
    servo.sweep();
    current_servo.in_motion = false;
  }
  else
  {
    current_stepper.in_motion = true;
    servo.stop();
    current_servo.in_motion = false;
  }
};

/** spins the lights in a certain direction */
var spin_lights = function(){
  var current_lights = hd.ph().light_servo;
  if (current_lights.on){
    if (current_lights.direction == 1)
      light_servo.cw(1);
    else
      light_servo.ccw(1);
  }
  else {
    servo.stop();
  }

  
};

 
exports.move_stepper = move_stepper;
exports.spin_lights = function(){return;};
exports.move_servo = function(){return;};
exports.start_board = start_board;