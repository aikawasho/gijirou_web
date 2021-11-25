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
import ssl


app = Flask(__name__)
def raw2PCM(raw_floats):
        floats = array.array('f', raw_floats)
        samples = [int(sample * 32767)
                   for sample in floats]       
        results = np.array(samples, dtype = 'int16')
        #print(max(results))
        return results
<<<<<<< HEAD
=======

#Flaskオブジェクトの生成
app = Flask(__name__)
context = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
context.load_cert_chain('cert.crt', 'server_secret.key')
#「/」へアクセスがあった場合に、"Hello World"の文字列を返す
>>>>>>> f512e800a1b99c5f26fce57455e9f2c0025c5ed9
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
<<<<<<< HEAD
        return jsonify({"text": text, "file_name" : str(wav_id)} )
=======
        return jsonify({"text": text,"filename":str(wav_id)} )
>>>>>>> f512e800a1b99c5f26fce57455e9f2c0025c5ed9

    return render_template('rec_test.html')

if __name__ == "__main__":
    app.run()

<<<<<<< HEAD

=======
@app.route('/rec_data', methods=["POST"])
def rec_data():
    print('ポストを受け取りました')
    
    return request.json
 
@app.route('/music/<path:filename>')
def download_file(filename):
    return send_from_directory('/Users/shotta_control/Documents/ginza/JS_test/music', filename)
@app.route('/favicon.ico')
def favicon():
    return send_from_directory('/home/ec2-user/summary_server/gijirou_web/image/',
                               'favicon.ico')

@app.route('/static/js/<path:filename>')
def processor_file(filename):
    return send_from_directory('/home/ec2-user/summary_server/gijirou_web/static/js', filename)
if __name__ == "__main__":
        app.run(debug=False, host='0.0.0.0',port = 9012, ssl_context=context, threaded=True,)
>>>>>>> f512e800a1b99c5f26fce57455e9f2c0025c5ed9
