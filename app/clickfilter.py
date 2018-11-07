# clickfilter.py
# encapsulate things

# import modules used in routes
from PIL import Image, ImageFilter, ImageEnhance


class ClickFilter:
    def __init__(self, f, io, i):
        self.filter_value = f
        self.img_io = io
        self.image = i

    def getFilterValue(self):
        return self.filter_value

    def getImageIO(self):
        return self.img_io

    def getImage(self):
        return self.image

    def applyCountour(self):
        # insert real code
        self.image = self.image.filter(ImageFilter.CONTOUR)
        self.io = self.image.save(self.img_io, 'PNG', quality=70)

    def applyEmboss(self):
        # insert real code
        # and then bootstrap up
        self.image = self.image.filter(ImageFilter.EMBOSS)
        self.io = self.image.save(self.img_io, 'PNG', quality=70)

    def applyEdge(self):
        # insert real code
        # and then bootstrap up
        self.image = self.image.filter(ImageFilter.EDGE_ENHANCE_MORE)
        self.io = self.image.save(self.img_io, 'PNG', quality=70)

    # fill out with rest of possible filter values
    filters = {
        'contour': applyCountour,
        'emboss': applyEmboss,
        'edge': applyEdge
    }

    def processFilter(self):
        self.filters[self.filter_value](self)
