# tests.py
# todo: Add the tests!

import sys
sys.path.append("../")
from app import routes

class FilterApp:
    def setup(self):
        self.filter_value = "test"
        self.img_string = "teststring"

    def test_filter_value_is_valid(self):
        self.setup()

    def test_img_string_is_decoded(self):
        self.setup()
