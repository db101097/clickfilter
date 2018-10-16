# routes.py
import base64
import random
import re
import PIL
from flask import render_template, jsonify, request, send_file, make_response
from app import app
from PIL import Image, ImageFilter, ImageEnhance
from io import BytesIO

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
    # todo: add more styles!

    # value = requested filterstyle from frontend.
    # img   = img data from frontend.
    value = request.form['value']
    # print(value)
    # removes the padding from the img data.
    # decodes the base64 img into a readable bytestream and reads it.
    img = re.sub('^data:image/.+;base64,', '', request.form['img'])
    img = Image.open(BytesIO(base64.b64decode(img)))
    img_io = BytesIO()

    # possibly expand on these so that they aren't so boring?
    # opened image has filter applied to it and is saved to the img_io stream.
    if value == 'contour':
        img.filter(ImageFilter.CONTOUR).save(img_io, 'PNG', quality=70)
    elif value == 'emboss':
        img.filter(ImageFilter.EMBOSS).save(img_io, 'PNG', quality=70)
    elif value == 'edge':
        img.filter(ImageFilter.EDGE_ENHANCE_MORE).save(img_io, 'PNG', quality=70)
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
