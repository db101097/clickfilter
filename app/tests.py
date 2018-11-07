# tests.py
# todo: Add the tests!

import sys
sys.path.append("../")
from app import routes
from PIL import Image

class FilterApp:
    def setup(self):
        self.filter_value = "test"
        self.img_string = "teststring"

    # Test for the imagefilter value
    def test_filter_value_is_valid(self):
        self.setup()

    # Test the image string
    def test_img_string_is_decoded(self):
        self.setup()

    '''def test_image_opens(self):
		mocker.patch('Image.open')
		
		i = ImageFilterer()
		i.filter_image('rebecca_is_the_best.txt')
		
		Image.open.assert_called_once_with('rebecca_is_the_best.txt')

    def test_image_opens(self):
		mocker.patch('Image.open')
		
		i = ImageFilterer()
		i.filter_image('rebecca_is_the_best.txt')
		
		Image.open.assert_called_once_with('rebecca_is_the_best.txt')

    # Test the image was properly encoded?'''

    def test_contour(self):
        mocker.patch('Image.open')

        f = Filterer()
        f.apply_contour('hi.png')

        Image.open.assert_called_once_with(BytesIO(base64.b64decode('hi.png'))
