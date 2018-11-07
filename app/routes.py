 # routes.py
import base64
import random
import re
import PIL
from flask import render_template, jsonify, request, send_file, make_response
from app import app
from PIL import Image, ImageFilter, ImageEnhance
from io import BytesIO
from .clickfilter import ClickFilter
import cv2
import numpy as np

# to be used if we need to save files to server.
UPLOAD_FOLDER = 'app/static/uploads'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
if __name__ == "__main__":
	app.run(debug=True)


@app.route('/')
@app.route('/home')
def home():
	return render_template('index.html')


@app.route('/filterimg', methods=['GET', 'POST'])
def filterimg():
	# Endpoint for image processing/filtering.
	# todo: encapsulate things so everything is simpler to test

	# value = requested filterstyle from frontend.
	# img   = img data from frontend.
	value = request.form['value']
	# print(value)
	# removes the padding from the img data.
	# decodes the base64 img into a readable bytestream and reads it.
	img = re.sub('^data:image/.+;base64,', '', request.form['img'])
	img = Image.open(BytesIO(base64.b64decode(img)))
	img_io = BytesIO()

	# encapsulated stuff
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
		'http://clickfilters.herokuapp.com')
	response.headers.set(
		'Content-Type',
		'image/png'
		)
	return response
