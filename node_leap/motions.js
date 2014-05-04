var five = require('johnny-five'),
    board = new five.Board();
    //server address
    server_address = ''

//variables for the mechanical components
var light_stepper, fixture_stepper, servo;

//functions that perform different things

/** moves the stepper in a positive 
    or negative direction  the right number of degrees */
var move_stepper = function(degrees){
  return 
}

var connect_arduino = function(){
  board.on("ready",function(){

  })
}
 


exports.move_stepper = move_stepper;