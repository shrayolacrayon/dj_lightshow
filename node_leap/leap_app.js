var //webSocket = require('ws'),
    itunes = require('./itunes'),
    gestures = require('./gestures'),
    motions = require('./motions'),
    Leap = require("leapjs");

  var precise_hands = {
    hands: [],
    main_hand: null,
    still_hand: null,
    light_servo: {on: true, frame_no: -1, direction: 1},
    hand_servo: {on: true, frame_no: -1},
    stepper: {on: true, frame_no: -1 , direction: 1, position: 0, in_motion: false},
    play: {on: false, frame_no: -1}
    
  };
    //ws = new webSocket('ws://127.0.0.1:6437'),
    //five = require('johnny-five'),
    //board = new five.Board();
    //led, servo;

/* TODO: So far we have the board connected to johnny five via not wifly. We need to first 
  locate it through wifi and have it do the same.
  Next we need to define the servos and steppers in some way, and the pins that they are located on
  We then need to create a vocabulary of gestures that will be able to connect the data given by the leap motion (ie. from the frames)
  A good way to do that is to define functions for each of the types of gestures and then call those functions 
   */


gestures.read_gesture(function(frame){

});
/*Leap.loop(function(frame){
  if (frame.hands && frame.hands.length > 0){
    console.log(frame.hands[0].palmPosition);
  }
}); */




