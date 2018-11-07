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

	# to do
	test_me = ClickFilter(value, img_io, img)
	'''
	print(
		"value:", test_me.getFilterValue(),
		"\nimg_io:", test_me.getImageIO(),
		"\nimage:", test_me.getImage()
		)
	'''
	
	# opened image has filter applied to it and is saved to the img_io stream.
	if value == 'contour':
		# f = Filterer()
		# f.contour(img_io)
		# img.filter(ImageFilter.CONTOUR).save(img_io, 'PNG', quality=70)
		test_me.processFilter()
	elif value == 'emboss':
		# img.filter(ImageFilter.EMBOSS).save(img_io, 'PNG', quality=70)
		test_me.processFilter()
	elif value == 'edge':
		# img.filter(ImageFilter.EDGE_ENHANCE_MORE).save(img_io, 'PNG', quality=70)
		test_me.processFilter()
	elif value =='vintage':
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
	elif value == 'noir':
		img = PIL.ImageEnhance.Sharpness(img).enhance(1.3)
		img = PIL.ImageEnhance.Color(img).enhance(1.5)
		img = PIL.ImageEnhance.Contrast(img).enhance(1.1)
		img = PIL.ImageEnhance.Brightness(img).enhance(1.1)
		img.convert(mode='L').save(img_io, 'PNG', quality=70)
		img.save(img_io, 'PNG', quality=70)
	elif value == 'juicy':
		img = PIL.ImageEnhance.Color(img).enhance(2.0)  # oversaturate
		img = PIL.ImageEnhance.Contrast(img).enhance(1.2)  # oversaturate
		img.save(img_io, 'PNG', quality=70)
	elif value == 'slumber':
		img = PIL.ImageEnhance.Color(img).enhance(0.5)
		source = img.split()
		R, G, B = 0, 1, 2

		mask = source[B].point(lambda i: i < 60 and 255)
		out = source[R].point(lambda i: i * 1.2)
		source[R].paste(out, None, mask)

		out = source[G].point(lambda i: i * 1.2)
		source[G].paste(out, None, mask)

		out = source[B].point(lambda i: i * 0.5)
		source[B].paste(out, None, mask)

		img = Image.merge(img.mode, source)
		img = PIL.ImageEnhance.Color(img).enhance(1.4)
		img = PIL.ImageEnhance.Contrast(img).enhance(1.2)
		img.save(img_io, 'PNG', quality=70)

	# set img_io HEAD to first position.
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

    # set img_io HEAD to first position.
	img_io.seek(0)

	# CORS headed uneeded now, but don't remove yet.
	response = make_response(send_file(img_io, mimetype='image/png'))
	response.headers.add(
		'Access-Control-Allow-Origin',
		'http://localhost:4200')
	response.headers.set(
		'Content-Type',
		'image/png'
		)
	return response
