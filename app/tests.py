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

    # Test the image was properly encoded?
