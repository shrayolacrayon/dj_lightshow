var five = require('johnny-five'),
    board = new five.Board(),
    //server address
    server_address = '';
     


//variables for the mechanical components
var light_stepper, stepper, servo;


board.on("ready", function(){
    stepper = new five.Stepper({
      type: five.Stepper.TYPE.FOUR_WIRE,
      stepsPerRev: 200,
      pins: [ 6,7,8,9 ]});
  });

//functions that perform different things

/** moves the stepper in a positive 
    or negative direction  the right number of degrees */



var move_stepper = function(degrees, dir, callback){
    stepper.rpm(30);
    stepper.step({steps: degrees * 90, direction: dir}, function(){
    console.log("finished moving stepper");  
    callback();

  });
  };




/** moves the servo in the direction given */
var move_servo = function(direction){
  return
};

/** spins the lights in a certain direction */
var spin_lights = function(direction){
  return
};

var connect_arduino = function(){
  board.on("ready",function(){

  })
};
 


exports.move_stepper = move_stepper;