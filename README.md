# filter-app-v3 <img src="readmelogo.png" width="8%" height="8%" />
A web-app for image & video filtering, much like instagram and snapchat.

View our app live on [Heroku!](https://clickfilterapp.herokuapp.com/ "https://clickfilterapp.herokuapp.com/")

##### check out our [wiki](https://github.com/kre64/filter-app-v1/wiki) for more information.
## Tech in use
##### Check out our [docs](https://github.com/kre64/filter-app-v1/tree/master/docs) for more details!
* Frontend
  * HTML/CSS+Bootstrap
  * JavaScript + jQuery
  * WebGL, THREE.js, Jeeliz API
* Middleware
  * Cloudinary (Image hosting service on the cloud)
* Backend
  * Flask (Python)
  * Pillow, OpenCV, Python libs for image processing
  * Postgres
* Hosted on
  * https://clickfilterapp.herokuapp.com/
  * Locally @ localhost:5000

## Version 1 Requirements
* Allow a user to choose a picture to filter (uploaded images).
* Allow a user to select from 3 potential image filters (of your choosing).
* Display the filtered image to the user.

## Version 2 Requirements
* We were allowed to do whatever we wanted, as long as we used new tech :)
* Built a video filtering system using WebGL + THREEjs!
* Added a facetracking filter in the same vein as Snapchat using Jeeliz-WebGL
* Rebuilt the frontend UI/UX experience using Bootstrap, and jinga2 templating

## Version 3 Requirements
* A user should be able to create and name photo albums;
* A user should be able to select a photo album to add an image to;
* An image can be added to multiple photo albums;
* The photo album should persist across sessions (you’ll need to store the album data somewhere).

## How To Run
1. Clone or download this repo into a directory of your choosing.
2. In a Command Line Interface of your choosing create a virtual environment

   ```
   python3 -m venv venv
   ```
3. Activate the virtual environment

   **UNIX machines**
   ```
   source venv/bin/activate
   ```
   **Windows**
   ```
   venv\Scripts\activate
   ```
4. Install required python modules
   ```
   pip install -r requirements.txt
   ```
5. Then type in 
   ```
   flask run
   ```
   Now open up your web browser and enter the following URL in the address field:
   http://localhost:5000/
6. Incase of Errors

   Go [here](http://flask.pocoo.org/docs/dev/cli/ "Command Line Interface") or
   [there](http://flask.pocoo.org/docs/1.0/installation/ "Installation")
