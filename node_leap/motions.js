var five = require('johnny-five'),
    board = new five.Board();
var constants = require('./constants')
var ph = constants.ph;


//variables for the mechanical components
var light_servo, stepper, servo;



var start_board = function(callback){
    board.on("ready", function(){
      stepper = new five.Stepper({
        type: five.Stepper.TYPE.FOUR_WIRE,
        stepsPerRev: 200,
        pins: [ 6,7,8,9 ]});
      /*light_servo = new five.Servo({
        pin: 12,
        type: "continuous"
      });
      servo = new five.Servo({
        pin: 12,
        type: "standard"
      }) */
      callback();
    }); 
  };

//functions that perform different things

/** moves the stepper in a positive 
    or negative direction  the right number of degrees */


// moves the stepper a certain number of beats per minute
var move_stepper = function(bpm, dir, position, motion, callback){
  if (motion){
    console.log("in motion");
    return;
  }
    /*stepper.rpm(bpm).speed(bpm);
    stepper.step({steps: 90, direction: 1}, function(){
      console.log("moved");
      callback(position);
  }); */
 //console.log("in move_stepper");
 console.log("move_stepper");
 stepper.rpm(180).direction(five.Stepper.DIRECTION.CCW).accel(1600).decel(1600).step(2000, function() {
    console.log("done moving CCW");

    // once first movement is done, make 10 revolutions clockwise at previously
    //      defined speed, accel, and decel by passing an object into stepper.step
    stepper.step({
      steps: 2000,
      direction: five.Stepper.DIRECTION.CCW
    }, function() {
      console.log('done moving CW');
      callback();
    });
  });
  };



/** moves the servo in the direction given */
var move_servo = function(on){
  if (on){
    servo.sweep();
  }
  else
    servo.stop();
};

/** spins the lights in a certain direction */
var spin_lights = function(direction, on){
  if (on){
    if (direction == 1)
      light_servo.cw(1);
    else
      light_servo.ccw(1);
  }
  else{
    servo.stop();
  }

  
};

 
exports.move_stepper = move_stepper;
exports.spin_lights = function(){return;};
exports.move_servo = function(){return;}
exports.start_board = start_board