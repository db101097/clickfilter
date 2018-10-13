# filter-app-v1 <img src="readmelogo.png" width="8%" height="8%" />
A simple web-app for image filtering.

## Version 1 Requirements
* Allow a user to choose a picture to filter (uploaded images).
* Allow a user to select from 3 potential image filters (of your choosing).
* Display the filtered image to the user.

## How To Run:
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
