// for audio
var audio_sample_rate = null;
var scriptProcessor = null;
var audioContext = null;
// audio data
var audioData = [];
var bufferSize = 1024;
var pushFrag = 0;
var recThresh = 0.3;
var silentCount= 0;
async function SendData(){
      let mergeBuffers = function (audioData) {
        let sampleLength = 0;
        for (let i = 0; i < audioData.length; i++) {
          sampleLength += audioData[i].length;
        }
        let samples = new Float32Array(sampleLength);
        let sampleIdx = 0;
        for (let i = 0; i < audioData.length; i++) {
          for (let j = 0; j < audioData[i].length; j++) {
            samples[sampleIdx] = audioData[i][j];
            sampleIdx++;
          }
        }
        return samples;
      };
     
     samples = mergeBuffers(audioData)
     data = {'fs':audio_sample_rate,'samples':samples}
     var options = {
                method : 'POST',
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify(data)}
    const response = await fetch("/",options).then(response => response.json());
    text = response['text'];
    let body = document.body
    let input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("value", text); 
    body.appendChild(input);
    body.appendChild(document.createElement("br")); 
   }


var onAudioProcess = function (e) {
  var input = e.inputBuffer.getChannelData(0);
  var bufferData = new Float32Array(1024);
  for (var i = 0; i < bufferSize; i++){
        bufferData[i] = input[i];
       }
             
        audioData.push(bufferData);
        
        if ( Math.max(...bufferData) > recThresh){
              console.log('MAX');
              silentCount = 0; 
        } else {
        console.log(typeof silentCount);
        silentCount += 1;
        
         if ( silentCount > 10){
                if (audioData.length > 20 ){
                        SendData(audioData);
                        console.log('audio send');
                 }
              
              audioData = [];
             console.log('reset count');
              silentCount = 0; 
         }      
       }
    };

 function MicSuccess( stream ){
      audioContext = new AudioContext();
      audio_sample_rate = audioContext.sampleRate;
      console.log(audio_sample_rate);
      scriptProcessor = audioContext.createScriptProcessor(1024, 1, 1);
      var mediastreamsource = audioContext.createMediaStreamSource(stream);
      mediastreamsource.connect(scriptProcessor);
      scriptProcessor.onaudioprocess = onAudioProcess;
      scriptProcessor.connect(audioContext.destination);

      console.log('record start?');
}

//録音スタートの処理
function startREC(){
  $('#rec_btn').css('display','none');
  $('#stop_btn').css('display', 'block');
  audioData = [];
  navigator.mediaDevices.getUserMedia({audio: true}).then(MicSuccess);
}
//録音停止の処理
function stopREC(){
  $('#rec_btn').css('display','block');
  $('#stop_btn').css('display', 'none');
  audioContext.close();
  SendData();
  console.log('send audio');
 }

function availableData( arr ){
  var b = false;
  for( var i = 0; i < arr.length && !b; i ++ ){
    b = ( arr[i] != 0 );
  }
}


