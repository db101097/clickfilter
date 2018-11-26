# Docs
Almost everything you need to know!

Preview our app on [Heroku!](http://clickfilters.herokuapp.com/ "http://clickfilters.herokuapp.com/")

### Tech in use:
* Frontend
  * HTML
  * CSS
  * [Bootstrap v3.3.7](http://bootstrapdocs.com/v3.3.6/docs/)
  * Vanilla JavaScript
  * jQuery
  * [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) used in our fragment/vertex shaders to modify and augment webcam textures.
  * [threejs](https://threejs.org/) used to convert a webcam stream into a 2D texture.
  * [Jeeliz FaceFilter API](https://jeeliz.com/) used for our facetracking filters.
* Backend
  * [Flask](http://flask.pocoo.org/)
  * [Pillow](https://pillow.readthedocs.io/en/5.3.x/) image processing library, used in ClickFilters to modify images.
  * [OpenCV](https://opencv.org/) image processing library, used in routes.py to modify images.
* Hosted on
  * https://clickfilters.herokuapp.com/
