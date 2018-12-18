 # routes.py
import base64
import cloudinary
import os
import cloudinary.uploader
import random
import re
import PIL
from flask import render_template, jsonify, request, send_file, make_response, session, redirect, url_for
from app import app
from PIL import Image, ImageFilter, ImageEnhance
from io import BytesIO
from .clickfilter import ClickFilter
import cv2
import numpy as np
import psycopg2
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

# to be used if we need to save files to server.
UPLOAD_FOLDER = 'app/static/uploads'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])
BASEDIR = os.path.abspath(os.path.dirname(__file__))

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
if __name__ == "__main__":
    app.run(debug=True)

app.secret_key = os.urandom(24)
app.config['SQLALCHEMY_DATABASE_URI']=os.getenv('DATABASE_URL')
app.config['SQLAlCHEMY_TRACK_MODIFICATIONS']=False 
db = SQLAlchemy(app)


class user(db.Model):
    __tablename__= 'User'
    username =db.Column(db.String(20),primary_key=True,unique=True,nullable=False)
    password_hash=db.Column(db.String(1000),nullable=False)

    def __init__(self,un,pw):
        self.username=un
        self.password_hash=pw


class album(db.Model):
    __tablename__='albums'
    album_id= db.Column(db.Integer(),unique=True,primary_key=True)
    username =db.Column(db.String(20))
    size = db.Column(db.Integer())
    name= db.Column(db.String(20))

    def __init__(self,un,size,name):
        self.username = un
        self.size = size
        self.name = name


class photo(db.Model):
    __tablename__='photo'
    album_id= db.Column(db.Integer(),primary_key=True)
    photo_str=db.Column(db.String(1000))

    db.create_all()


cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET'),
    cloudinary_url=os.getenv('CLOUDINARY_URL'),
)


@app.route('/')
def home():
    if 'username' in session:
        print('user in session')
        session['logged_in'] = True
        return redirect(url_for('profile'))
    print('user NOT in session')
    return render_template('home.html')


@app.route('/profile', methods=['GET', 'POST'])
def profile():
    if 'logged_in' not in session:
        print("A user is NOT logged in")
        return redirect(url_for('home'))
    return render_template('profile.html', username=session['username'], dog='dog')


@app.route('/album/<title>')
def album(title):
    print(title)
    return render_template('album.html', title=title)


# route for photomode
@app.route('/photomode')
def photomode():
    # filters to be passed for HTML templating.
    filters = [
        'contour',
        'emboss',
        'edge',
        'vintage',
        # 'movie_moment',
        'noir',
        'juicy',
        'slumber',
        'face_blur',
    ]
    return render_template('photomode.html', filters=filters)


@app.route('/photomode/save', methods=['POST'])
def savephoto():
    if request.method == 'POST':
        img = request.form['file']
        title = request.form['title']
        img_up = cloudinary.uploader.upload(img, resource_type="auto", public_id=title)
        # THIS IS THE URL WE ARE SAVING TO THE USERS DEFAULT "MY PHOTOS" ALBUM
        # print(img_up['url'])
        return "success"


@app.route('/videomode')
def videomode():
    return render_template('videomode.html')


@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        un=str(request.form['username'])
        pw = str(request.form['password'])
        dbu= user.query.filter_by(username=un).first()
        if(check_password_hash(dbu.password_hash,pw)):
            print('success')
            session['username'] = request.form['username']
            session['logged_in'] = True
            print(session['username'])
            return render_template('profile.html', username=session['username'])
        else:
            print('unrecognized username/password combination')
            return 'unrecognized username/password combination'


@app.route('/logout')
def logout():
    session.pop('username', None)
    session.pop('logged_in', None)
    return redirect(url_for('home'))


@app.route('/signup', methods=['POST'])
def signup():
    if request.method == 'POST':
        un=str(request.form['username'])
        pw = generate_password_hash(str(request.form['password']))
        new_user= user(un,pw)
        db.session.add(new_user)
        db.session.commit()

        print('New user signed up.')
        session['username'] = request.form['username']
        print(session['username'])

        default_album = album(un,size,"My Photos")
        db.session.add(default_album)
        deb.session.commit()
        print('album added')
        return render_template('profile.html', username=session['username'])


@app.route('/filterimg', methods=['GET', 'POST'])
def filterimg():
    # Endpoint for image processing/filtering.
    # todo: encapsulate things so everything is simpler to test

    # value = requested filter value from frontend.
    # img   = img data from frontend.
    value = request.form['value']

    # removes the padding from the img data.
    # decodes the base64 img into a readable bytestream and reads it.
    # img_io is a new bytestream that will hold the filtered result.
    img = re.sub('^data:image/.+;base64,', '', request.form['img'])
    img = Image.open(BytesIO(base64.b64decode(img)))
    img_io = BytesIO()

    # create ClickFilter object, see clickfilter.py
    target_image = ClickFilter(value, img_io, img)
    '''
    print(
        "value:", test_me.getFilterValue(),
        "\nimg_io:", test_me.getImageIO(),
        "\nimage:", test_me.getImage()
        )
    '''

    # encapsulate this stuff
    # opened image has filter applied to it and is saved to the img_io stream.
    if value =='vintage':
        im2= cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
        im2 = cv2.applyColorMap(im2, cv2.COLORMAP_WINTER)
        im2 = cv2.applyColorMap(im2 , cv2.COLORMAP_PINK)
        img_str = cv2.imencode('.PNG', im2)[1].tostring()
        img_io.write(img_str)
    elif value == "movie_moment":
        im2= cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
        height,width,channel = im2.shape

        #size of the bar
        top_bar=int(height*1/5)

        #create a new black array image with the extra space for the black bars
        new_image = np.zeros((int(height+2*top_bar),width,channel) , im2.dtype)

        #assign the dimensions of the new image
        ni_height,ni_width,ni_channel = new_image.shape

        #define the region of the bottom bar as the new image height minus the size of the bar
        bottom_bar=ni_height-top_bar

        # alpha and beta values to adjust brightness and contrast
        #playing with values will provide different results
        alpha = 1.95 
        beta = -50    

        #using numpy iteration for fast processing
        #implementing the equation g(x)=a*f(x)+B
        #starts the iteration from the where the top bar ends and stop at the start of the top bar
        new_image[top_bar:bottom_bar,0:width,0:channel]=np.clip(alpha*im2[0:height,0:width,0:channel] + beta, 0, 255)
        img_str = cv2.imencode('.PNG', new_image)[1].tostring()
        img_io.write(img_str)
    elif value=='face_blur':
        im2= cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)

        gs_im2=cv2.cvtColor(im2,cv2.COLOR_BGR2GRAY)
        haar_face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_alt.xml')
        faces = haar_face_cascade.detectMultiScale(gs_im2, scaleFactor=1.1, minNeighbors=5)

        for (x, y, w, h) in faces: 
            roi=im2[y: y+h, x:x+w]

        width,height,channel=roi.shape

        roi=cv2.blur(roi,(width,height))

        for (x, y, w, h) in faces: 
            im2[y: y+h, x:x+w]=roi

        img_str = cv2.imencode('.PNG', im2)[1].tostring()
        img_io.write(img_str)
    else:
        target_image.processFilter()

    # set img_io HEAD to first position.
    img_io.seek(0)

    # CORS headed uneeded now, but don't remove yet.
    response = make_response(send_file(img_io, mimetype='image/png'))
    response.headers.add(
        'Access-Control-Allow-Origin',
        'https://clickfilters.herokuapp.com')
        # http://localhost:5000
    response.headers.set(
        'Content-Type',
        'image/png'
        )
    return response
