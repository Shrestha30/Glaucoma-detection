from flask import Flask, request, jsonify, session, send_file
from flask_bcrypt import Bcrypt
from flask_cors import CORS, cross_origin
import os
from config import ApplicationConfig
from models import db, User, Image, ClinicalData
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import pickle
import pandas as pd

app = Flask(__name__)
app.config.from_object(ApplicationConfig)
CORS(app, supports_credentials=True)

db.init_app(app)
bcrypt = Bcrypt(app)

with app.app_context():
    db.create_all()

UPLOAD_FOLDER = 'Uploads'
CLINICAL_BATCH_FOLDER = 'clinicalbatch'

image_loaded_model = load_model(os.path.join('saved_models','CNN_V2_Glaucoma.h5'))
clinical_loaded_model = load_model(os.path.join('saved_models','clinical_data_V2_Glaucoma.h5'))
with open('saved_models/clinical_data_scaler.pkl', 'rb') as f:
    loaded_scaler = pickle.load(f)


@app.route("/register", methods=["POST"])
def register_user():
    email = request.json["email"]
    password = request.json["password"]
    year = request.json["year"]
    age = request.json["age"]
    gender = request.json['gender']

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "User already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(email=email, password=hashed_password, reg_year=year, age=age, gender=gender)
    db.session.add(new_user)
    db.session.commit()
    
    session["user_id"] = new_user.id

    return jsonify({
        "id": new_user.id,
        "email": new_user.email,
        "error": "none"
    })

@app.route("/login", methods=["POST"])
def login():
    email = request.json["email"]
    password = request.json["password"]

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Unauthorized"}), 401

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401
    
    session["user_id"] = user.id

    return jsonify({
        "id": user.id,
        "email": user.email,
        "error": "none"
    })
    
@app.route('/upload',methods=['POST'])
def upload():
    uid=request.form.get('id')
    file = request.files['file']
    eye=request.form.get('eye')
    filename=file.filename
    target=''
    filepath=''
    
    if request.form.get('save')=='yes':
        target=os.path.join(UPLOAD_FOLDER,uid)
        if not os.path.isdir(target):
            os.mkdir(target)
        adate=request.form.get('date')
        exten=''
        if '.jpg' in filename:
            exten=".jpg"
        else: exten=''
        filename=eye+adate+exten
        filepath=os.path.join(target,filename)
        if os.path.exists(filepath):
            os.remove(filepath)

    else:
        target=os.path.join(UPLOAD_FOLDER,uid,'temp')
        if not os.path.isdir(target):
            os.mkdir(target)
        if '.jpg' in filename:
            exten=".jpg"
        else: exten=''
        filename='temp'+exten
        filepath=os.path.join(target,filename)
        if os.path.exists(filepath):
            os.remove(filepath)
    
    file.save(filepath)
    
    prediction='1'#assign prediction function here
    
    #start of prediction
    img_path= filepath
    img=image.load_img(img_path,target_size=(224,224))
    img=image.img_to_array(img)/255
    img=np.expand_dims(img,axis=0)
    y=image_loaded_model.predict(img)
    print(y)

    a=np.argmax(y, axis=1)
    if(a==1):
        print("Uninfected")
        prediction='0'
    else:
        print("Parasitized")
        prediction='1'
    
    if request.form.get('save')=='yes':
        imgentry = Image.query.filter_by(uid=uid).filter_by(date=adate).filter_by(eye=eye).first()
        if imgentry is None:
            imgentry = Image(uid=uid,date=adate,eye=eye,path=filepath,prediction=prediction)
            db.session.add(imgentry)
            db.session.commit()
        else:
            imgentry.prediction = prediction
            db.session.commit()
    
    # print(file)
    if prediction=='1':
        prediction='Glaucoma'
    else: prediction='no'
    
    return {"prediction": prediction}

@app.route('/clinicalpredict',methods=['POST'])
def clinicalpredict():
    uid = request.json['uid']
    date = request.json['date']
    eye = request.json['eye']
    save = request.json['save']
    dioptre1 = request.json['dioptre1']
    dioptre2 = request.json['dioptre2']
    astigmatism = request.json['astigmatism']
    phakic = request.json['phakic']
    gender = request.json['gender']
    age = request.json['age']
    pneumatic = request.json['pneumatic']
    perkins = request.json['perkins']
    pachymetry = request.json['pachymetry']
    axiallength = request.json['axiallength']
    vfmd = request.json['vfmd']
    
    prediction='1'#assign prediction function here
    
    #prediction code start with DL model
    # data = {
    #     'Age': [age],
    #     'dioptre_1': [dioptre1],
    #     'dioptre_2': [dioptre2],
    #     'astigmatism': [astigmatism],
    #     'Pneumatic': [pneumatic],
    #     'Perkins': [perkins],
    #     'Pachymetry':[pachymetry],
    #     'Axial_Length':[axiallength]
    # }
    # df = pd.DataFrame(data)
    # scaled = loaded_scaler.transform(df)
    # loaded_predict=clinical_loaded_model.predict(scaled)

    # if loaded_predict>0.5:
    #     print("Glaucoma")
    #     prediction='1'
    # else:
    #     print("Healthy")
    #     prediction='0'
    
    data = {
        'dioptre_2': [float(dioptre2)],
        'Phakic/Pseudophakic': [float(phakic)],
        'Gender': [float(gender)],
        'Age': [float(age)],
        'astigmatism': [float(astigmatism)],
        'dioptre_1': [float(dioptre1)]
    }


    df = pd.DataFrame(data)

    file='./saved_models/Clinical_model.sav'
    fileobj=open(file,'rb')
    model=pickle.load(fileobj)

    prediction_result= model.predict(df)
    print(prediction_result)

    for val in prediction_result:
        if val == 1:
            print("Glaucoma")
            prediction='1'
        else:
            print("Healthy")
            prediction='0'
    
    if save=='1':
        clinicalDataEntry = ClinicalData.query.filter_by(uid=uid).filter_by(date=date).filter_by(eye=eye).first()
        if clinicalDataEntry is None:
            clinicalDataEntry = ClinicalData(uid=uid,date=date,eye=eye,prediction=prediction,dioptre1=dioptre1,dioptre2=dioptre2,gender=gender,age=age,astigmatism=astigmatism,phakic=phakic,pneumatic=pneumatic,perkins=perkins,pachymetry=pachymetry,axiallength=axiallength,vfmd=vfmd)
            db.session.add(clinicalDataEntry)
            db.session.commit()
        else:
            clinicalDataEntry.prediction = prediction
            clinicalDataEntry.dioptre1 = dioptre1
            clinicalDataEntry.dioptre2 = dioptre2
            clinicalDataEntry.gender = gender
            clinicalDataEntry.age = age
            clinicalDataEntry.astigmatism = astigmatism
            clinicalDataEntry.phakic = phakic
            clinicalDataEntry.pneumatic = pneumatic
            clinicalDataEntry.perkins = perkins
            clinicalDataEntry.pachymetry = pachymetry
            clinicalDataEntry.axiallength = axiallength
            clinicalDataEntry.vfmd = vfmd
            db.session.commit()
    if prediction=='1':
        prediction='glaucoma'
    else: prediction='no'
    
    return {"prediction": prediction, "error":"none"}

@app.route('/combinedpredict',methods=['POST'])
def combinedpredict():
    file = request.files['file']
    filename=file.filename
    target=''
    filepath=''
    
    uid = request.form.get('uid')
    date = request.form.get('date')
    eye = request.form.get('eye')
    save = request.form.get('save')
    dioptre1 = request.form.get('dioptre1')
    dioptre2 = request.form.get('dioptre2')
    astigmatism = request.form.get('astigmatism')
    phakic = request.form.get('phakic')
    gender = request.form.get('gender')
    age = request.form.get('age')
    pneumatic = request.form.get('pneumatic')
    perkins = request.form.get('perkins')
    pachymetry = request.form.get('pachymetry')
    axiallength = request.form.get('axiallength')
    vfmd = request.form.get('vfmd')
    
    if request.form.get('save')=='1':
        target=os.path.join(UPLOAD_FOLDER,uid)
        if not os.path.isdir(target):
            os.mkdir(target)
        date=request.form.get('date')
        exten=''
        if '.jpg' in filename:
            exten=".jpg"
        else: exten=''
        filename=eye+date+exten
        filepath=os.path.join(target,filename)
        if os.path.exists(filepath):
            os.remove(filepath)

    else:
        target=os.path.join(UPLOAD_FOLDER,uid,'temp')
        if not os.path.isdir(target):
            os.mkdir(target)
        if '.jpg' in filename:
            exten=".jpg"
        else: exten=''
        filename='temp'+exten
        filepath=os.path.join(target,filename)
        if os.path.exists(filepath):
            os.remove(filepath)
    
    file.save(filepath)
    
    prediction='1'#assign prediction function here
    
    if save=='1':
        clinicalDataEntry = ClinicalData.query.filter_by(uid=uid).filter_by(date=date).filter_by(eye=eye).first()
        imgentry = Image.query.filter_by(uid=uid).filter_by(date=date).filter_by(eye=eye).first()
        if clinicalDataEntry is None:
            clinicalDataEntry = ClinicalData(uid=uid,date=date,eye=eye,prediction=prediction,dioptre1=dioptre1,dioptre2=dioptre2,gender=gender,age=age,astigmatism=astigmatism,phakic=phakic,pneumatic=pneumatic,perkins=perkins,pachymetry=pachymetry,axiallength=axiallength,vfmd=vfmd)
            db.session.add(clinicalDataEntry)
            db.session.commit()
            
            imgentry = Image(uid=uid,date=date,eye=eye,path=filepath,prediction=prediction)
            db.session.add(imgentry)
            db.session.commit()
        else:
            print('date: '+date+" eye"+eye)
            clinicalDataEntry.prediction = prediction
            clinicalDataEntry.dioptre1 = dioptre1
            clinicalDataEntry.dioptre2 = dioptre2
            clinicalDataEntry.gender = gender
            clinicalDataEntry.age = age
            clinicalDataEntry.astigmatism = astigmatism
            clinicalDataEntry.phakic = phakic
            clinicalDataEntry.pneumatic = pneumatic
            clinicalDataEntry.perkins = perkins
            clinicalDataEntry.pachymetry = pachymetry
            clinicalDataEntry.axiallength = axiallength
            clinicalDataEntry.vfmd = vfmd
            db.session.commit()
    if prediction=='1':
        prediction='glaucoma'
    else: prediction='no'
    
    return {"prediction": prediction, "error":"none"}

@app.route('/getallclinicaldata', methods=['POST'])
def getAllClinicalData():
    uid = request.json['uid']
    
    clinicalDatas = ClinicalData.query.filter_by(uid=uid)
    count = clinicalDatas.count()
    clinicalDataEntries = clinicalDatas.order_by( ClinicalData.date.asc() ).all()
    
    eye = []
    dioptre1 = []
    dioptre2 = []
    astigmatism = []
    phakic = []
    pneumatic = []
    perkins = []
    pachymetry = []
    axiallength = []
    vfmd = []
    prediction = []
    date = []
    
    for clinicalDataEntry in clinicalDataEntries:
        date.append(clinicalDataEntry.date)
        eye.append(clinicalDataEntry.eye)
        dioptre1.append(clinicalDataEntry.dioptre1)
        dioptre2.append(clinicalDataEntry.dioptre2)
        astigmatism.append(clinicalDataEntry.astigmatism)
        phakic.append(clinicalDataEntry.phakic)
        pneumatic.append(clinicalDataEntry.pneumatic)
        perkins.append(clinicalDataEntry.perkins)
        pachymetry.append(clinicalDataEntry.pachymetry)
        axiallength.append(clinicalDataEntry.axiallength)
        vfmd.append(clinicalDataEntry.vfmd)
        prediction.append(clinicalDataEntry.prediction)
        
    return {"eye":eye, "dioptre1":dioptre1, "dioptre2":dioptre2,
            "astigmatism":astigmatism, "phakic":phakic, "pneumatic":pneumatic,
            "perkins":perkins, "pachymetry":pachymetry, "axiallength":axiallength,
            "vfmd":vfmd, "prediction":prediction, "count":count,"date":date}

@app.route('/uploadBatchClinicalData',methods=["POST"])
def uploadBatchClinicalData():
    uid=request.form.get('id')
    file = request.files['file']
    filename=file.filename
    print(filename)
    target=''
    filepath=''
    
    target=os.path.join(UPLOAD_FOLDER,uid,CLINICAL_BATCH_FOLDER)
    if not os.path.isdir(target):
        os.mkdir(target)
    if '.csv' in filename:
        exten=".csv"
    else: exten=''
    filename='predicted'+exten
    filepath=os.path.join(target,filename)
    if os.path.exists(filepath):
        os.remove(filepath)
    
    file.save(filepath)#csv file saved
    
    return {'success':'1'}

@app.route('/downloadBatchPredictionCD')
def downloadBatchPredictionCD():
    uid = request.args.get('s')
    target=os.path.join(UPLOAD_FOLDER,uid,CLINICAL_BATCH_FOLDER)
    filename = 'predicted.csv'
    filepath=os.path.join(target,filename)
    
    return send_file(filepath,download_name='predicted.csv',as_attachment=True)




@app.route('/mem',methods=['GET'])
def mem():
    return {'members':['a','b']}

@app.route("/logi", methods=["POST"])
def login_user():
    email = request.json["email"]
    print(email)
    return {'mem':'Done'}

@app.route('/up',methods=['POST'])
def up():
    target=os.path.join(UPLOAD_FOLDER,'.')
    if not os.path.isdir(target):
        os.mkdir(target)
    file = request.files['file']
    
    destination="/".join([target, file.filename])
    file.save(destination)
    
    print(file)
    return {"me":'Image Received'}

@app.route('/dow')
def dow():
    return send_file('./Uploads/C100P61ThinF_IMG_20150918_144104_cell_165.png',download_name='a.png',as_attachment=True)

if __name__ == "__main__":
    app.run(debug=True)