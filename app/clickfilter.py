# clickfilter.py
# encapsulate things

# import modules used in routes
import PIL
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance

'''
ClickFilter class takes
filtervalue f
bytestream io
image file i
'''
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
        self.image = self.image.filter(ImageFilter.CONTOUR)
        self.image.save(self.img_io, 'PNG', quality=70)

    def applyEmboss(self):
        self.image = self.image.filter(ImageFilter.EMBOSS)
        self.image.save(self.img_io, 'PNG', quality=70)

    def applyEdge(self):
        self.image = self.image.filter(ImageFilter.EDGE_ENHANCE_MORE)
        self.image.save(self.img_io, 'PNG', quality=70)

    def applyNoir(self):
        self.image = PIL.ImageEnhance.Sharpness(self.image).enhance(1.3)
        self.image = PIL.ImageEnhance.Color(self.image).enhance(1.5)
        self.image = PIL.ImageEnhance.Contrast(self.image).enhance(1.1)
        self.image = PIL.ImageEnhance.Brightness(self.image).enhance(1.1)
        self.image.convert(mode='L').save(self.img_io, 'PNG', quality=70)
        self.image.save(self.img_io, 'PNG', quality=70)

    def applyJuicy(self):
        self.image = PIL.ImageEnhance.Color(self.image).enhance(2.0)
        self.image = PIL.ImageEnhance.Contrast(self.image).enhance(1.2)
        self.image.save(self.img_io, 'PNG', quality=70)

    def applySlumber(self):
        self.image = PIL.ImageEnhance.Color(self.image).enhance(0.5)
        source = self.image.split()
        R, G, B = 0, 1, 2

        mask = source[B].point(lambda i: i < 60 and 255)
        out = source[R].point(lambda i: i * 1.2)
        source[R].paste(out, None, mask)

        out = source[G].point(lambda i: i * 1.2)
        source[G].paste(out, None, mask)

        out = source[B].point(lambda i: i * 0.5)
        source[B].paste(out, None, mask)

        self.image = Image.merge(self.image.mode, source)
        self.image = PIL.ImageEnhance.Color(self.image).enhance(1.4)
        self.image = PIL.ImageEnhance.Contrast(self.image).enhance(1.2)
        self.image.save(self.img_io, 'PNG', quality=70)

    # fill out with rest of possible filter values
    filters = {
        'contour': applyCountour,
        'emboss': applyEmboss,
        'edge': applyEdge,
        'noir': applyNoir,
        'juicy': applyJuicy,
        'slumber': applySlumber
    }

    def processFilter(self):
        self.filters[self.filter_value](self)
