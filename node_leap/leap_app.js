var //webSocket = require('ws'),
    itunes = require('./itunes'),
    gestures = require('./gestures')
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
/*board.on('ready', function(){
  //led = new five.Led(11);
  //servo = new five.Servo(10);
  //servo.center();
  /*ws.on('message', function(data, flags){
    frame = JSON.parse(data);

    if (frame.hands && frame.hands.length > 1){
      console.log(frame);
      led.on();
      servo.to(180);
    }
    else{
      led.off();
      servo.to(90);
    }
  }) 
  gestures.read_gesture(function(frame){
    
  })
}); */

gestures.read_gesture(function(frame){

});


