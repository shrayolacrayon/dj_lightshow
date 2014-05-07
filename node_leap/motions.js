var five = require('johnny-five'),
    board = new five.Board()
     


//variables for the mechanical components
var light_servo, stepper, servo;


board.on("ready", function(){
    stepper = new five.Stepper({
      type: five.Stepper.TYPE.FOUR_WIRE,
      stepsPerRev: 200,
      pins: [ 6,7,8,9 ]});
    light_servo = new five.Servo({
      pin: 12,
      type: "continuous"
    });
    servo = new five.Servo({
      pin: 12,
      type: "standard"
    })
  }); 

//functions that perform different things

/** moves the stepper in a positive 
    or negative direction  the right number of degrees */


// moves the stepper a certain number of beats per minute
var move_stepper = function(bpm){
    stepper.rpm(bpm);
    stepper.step({steps: 180, direction: 1 }, function(){
      stepper.step({steps: 180, direction : -1}, function(){
        console.log("finished moving stepper");  
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