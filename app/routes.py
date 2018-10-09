# routes.py
from flask import render_template, jsonify, request, send_file, make_response
from app import app
from PIL import Image, ImageFilter
from io import BytesIO
import base64
import re

UPLOAD_FOLDER = 'app/static/uploads'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
if __name__ == "__main__":
    app.run(debug=True)


@app.route('/')
@app.route('/home')
def home():
    return render_template('index.html')


@app.route('/hey', methods=['GET', 'POST'])
def hey():
    # value will be the filter style applied to the image
    # todo: add more styles!
    # value = request.form['value']
    # remove the padding from the img file
    img = re.sub('^data:image/.+;base64,', '', request.form['img'])
    img = Image.open(BytesIO(base64.b64decode(img)))

    img_io = BytesIO()
    img.filter(ImageFilter.CONTOUR).save(img_io, 'PNG', quality=70)
    img_io.seek(0)
    # post_img = base64.b64encode(img.tobytes()).decode()
    # print(post_img)

    response = make_response(send_file(img_io, mimetype='image/png'))
    response.headers.add(
        'Access-Control-Allow-Origin',
        'http://localhost:4200')
    response.headers.set(
        'Content-Type',
        'image/png'
        )
    return response
