#-*- coding: utf-8-*-
import sys
sys.path.append('/usr/local/lib64/python3.6/site-packages/')
sys.path.append('/usr/local/lib/python3.6/site-packages/')
sys.path.append('/var/www/app')
import io,sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from flask import Flask,render_template, send_from_directory,request,jsonify
import json
import array
import struct
import numpy as np
import scipy.io.wavfile as siw
import time
from BertSum.server_BertSum.bert_summary import Bertsum_pred
from tools.speech_t import speech_text

app = Flask(__name__)
def raw2PCM(raw_floats):
        floats = array.array('f', raw_floats)
        samples = [int(sample * 32767)
                   for sample in floats]       
        results = np.array(samples, dtype = 'int16')
        #print(max(results))
        return results
@app.route('/',methods = ['POST','GET'])
def hello():
    if request.method == 'POST':
        result = request.get_json()
        samples = result['samples']
        fs = result['fs']
       # print('samples',type(samples))
        audioData =[]
        for jsn_val in samples.values():
                audioData.append(jsn_val);
        audioData = raw2PCM(audioData)
        wav_id = int(time.time())
        output_path =  "/var/www/app/wav/" + str(wav_id) + ".wav"
        siw.write(output_path, fs ,audioData)
        text,type_ = speech_text(output_path)
        print('テキスト化')
        print(text)
        return jsonify({"text": text, "file_name" : str(wav_id)} )

    return render_template('rec_test.html')

if __name__ == "__main__":
    app.run()


