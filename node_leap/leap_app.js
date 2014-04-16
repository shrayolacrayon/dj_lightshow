var webSocket = require('ws'),
    itunes = require('./itunes'),
    ws = new webSocket('ws://127.0.0.1:6437'),
    five = require('johnny-five'),
    board = new five.Board(),
    led, servo;

var 

board.on('ready', function(){
  led = new five.Led(11);
  servo = new five.Servo(10);
  servo.center();
  ws.on('message', function(data, flags){
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
}); 


