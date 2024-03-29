// for audio
var audio_sample_rate = null;
var scriptProcessor = null;
var audioContext = null;
// audio data
var audioData = [];
var bufferSize = 1024;
var pushFrag = 0;
var recThresh = 0.2;
var silentCount= 0;

<<<<<<< HEAD
  // Create an instance of a db object for us to store our database in
let db;
=======
function PlayVoice(filename){
    console.log(filename);
   }
 
>>>>>>> f512e800a1b99c5f26fce57455e9f2c0025c5ed9

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
     
     samples = mergeBuffers(audioData);
     let url = exportWAV(audioData);
     data = {'fs':audio_sample_rate,'samples':samples}
     var options = {
                method : 'POST',
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify(data)}
    const response = await fetch("/",options).then(response => response.json());
<<<<<<< HEAD
    console.log(response['text']);
    
    displaySpeech(response['text'],url);
        
     
=======
    text = response['text'];
    let body = document.body
    let input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("value", text); 
    body.appendChild(input);

    let button = document.createElement("button");
    button.setAttribute("id",response['filename']);
    button.innerHTML = "再生";
    body.appendChild(button); 
    body.appendChild(document.createElement("br")); 
    let button1 = document.getElementById(response['filename']);
    button1.addEventListener('click',PlayVoice(response['filename']));
>>>>>>> f512e800a1b99c5f26fce57455e9f2c0025c5ed9
   }


var onAudioProcess = function (e) {
  var input = e.inputBuffer.getChannelData(0);
  var bufferData = new Float32Array(1024);
  for (var i = 0; i < bufferSize; i++){
        bufferData[i] = input[i];
       }
             
        audioData.push(bufferData);
        
        if ( Math.max(...bufferData) > recThresh){
      //        console.log('MAX');
              silentCount = 0; 
        } else {
       // console.log(typeof silentCount);
        silentCount += 1;
        
         if ( silentCount > 50){
                if (audioData.length > 55 ){
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
    //  console.log(audio_sample_rate);
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
<<<<<<< HEAD
=======
  console.log('send audio');
>>>>>>> f512e800a1b99c5f26fce57455e9f2c0025c5ed9
 }

function availableData( arr ){
  var b = false;
  for( var i = 0; i < arr.length && !b; i ++ ){
    b = ( arr[i] != 0 );
  }
}

  // Define the storeVideo() function
function storeSpeech(WavFile,name) {
  // Open transaction, get object store; make it a readwrite so we can write to the IDB
  let objectStore = db.transaction(['speechs_os'], 'readwrite').objectStore('speechs_os');
  // Create a record to add to the IDB
  let record = {
    wav : WavFile,
    name : name
  }

  // Add the record to the IDB using add()
  let request = objectStore.add(record);

  request.onsuccess = function() {
    console.log('Record addition attempt finished');
  }

  request.onerror = function() {
    console.log(request.error);
  }

};

  // Define the displayVideo() function
  function displaySpeech(text, url) {
    // Create object URLs out of the blobs
    const audio = document.createElement('audio');
    audio.controls = true;
    const source = document.createElement('source');
    source.src = url;
    source.type = 'audio/wav';

    let body = document.body
    let input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("value", text); 
    body.appendChild(input);
    body.appendChild(audio);
    audio.appendChild(source);
    body.appendChild(document.createElement("p")); 
  }

let exportWAV = function (audioData) {

          var encodeWAV = function(samples, sampleRate) {
            var buffer = new ArrayBuffer(44 + samples.length * 2);
            var view = new DataView(buffer);

            var writeString = function(view, offset, string) {
              for (var i = 0; i < string.length; i++){
                view.setUint8(offset + i, string.charCodeAt(i));
              }
            };

            var floatTo16BitPCM = function(output, offset, input) {
              for (var i = 0; i < input.length; i++, offset += 2){
                var s = Math.max(-1, Math.min(1, input[i]));
                output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
              }
            };

            writeString(view, 0, 'RIFF');  // RIFFヘッダ
            view.setUint32(4, 32 + samples.length * 2, true); // これ以降のファイルサイズ
            writeString(view, 8, 'WAVE'); // WAVEヘッダ
            writeString(view, 12, 'fmt '); // fmtチャンク
            view.setUint32(16, 16, true); // fmtチャンクのバイト数
            view.setUint16(20, 1, true); // フォーマットID
            view.setUint16(22, 1, true); // チャンネル数
            view.setUint32(24, sampleRate, true); // サンプリングレート
            view.setUint32(28, sampleRate * 2, true); // データ速度
            view.setUint16(32, 2, true); // ブロックサイズ
            view.setUint16(34, 16, true); // サンプルあたりのビット数
            writeString(view, 36, 'data'); // dataチャンク
            view.setUint32(40, samples.length * 2, true); // 波形データのバイト数
            floatTo16BitPCM(view, 44, samples); // 波形データ

            return view;
          };

          var mergeBuffers = function(audioData) {
            var sampleLength = 0;
            for (var i = 0; i < audioData.length; i++) {
              sampleLength += audioData[i].length;
            }
            var samples = new Float32Array(sampleLength);
            var sampleIdx = 0;
            for (var i = 0; i < audioData.length; i++) {
              for (var j = 0; j < audioData[i].length; j++) {
                samples[sampleIdx] = audioData[i][j];
                sampleIdx++;
              }
            }
            return samples;
          };

          var dataview = encodeWAV(mergeBuffers(audioData), audioContext.sampleRate);
          var audioBlob = new Blob([dataview], { type: 'audio/wav' });

          var myURL = window.URL || window.webkitURL;
          var url = myURL.createObjectURL(audioBlob);
          return url;
        };
