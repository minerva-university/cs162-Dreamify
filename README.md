<a name="readme-top"></a>

<br />
<div align="center">
  <a href="https://github.com/minerva-university">
    <img src="readme_images/minerva_logo.png" alt="Logo" width="90" height="90" style="border:5px; border-radius: 50%;">
  </a>

<h1 align="center">Dreamify</h1>
<img src="readme_images/banner.jpg" alt="Dreamify Story Page">

<p align="center">
        Dreamify is a web platform designed to enrich family bedtime routines by creating personalized bedtime stories for children. Recognizing the importance of bedtime stories in developing a child's language skills, empathy, and emotional bonds, Dreamify leverages advanced AI tools to generate unique stories with the child as the protagonist, featuring customizable characters and themes based on the child's interests and physical traits.
    <br />
    <a href="https://drive.google.com/file/d/1HWpfiyR_rrEENRAB89p0RyDiq_fvDl3Q/view?usp=sharing"><strong>View Project Proposal »</strong></a>
    <br />
    <br />
    <a href="https://www.figma.com/file/ZaXcdSIkvy0zxM7uetz7wH/Figma-basics?type=design&mode=design&t=VmONGzLsiYv4rWDU-1">View Figma Design</a>
    ·
    <a href="https://github.com/minerva-university/cs162-Dreamify/issues">Report Issues</a>
  </p>
</div>

<h3> Built With </h3>

[![React][React.js]][React-url] [![Flask][Flask.js]][Flask-url] [![SQLAlchemy][SQLAlchemy.js]][SQLAlchemy-url] [![GPT][GPT.js]][GPT-url] [![DALL·E][DALL·E.js]][DALL·E-url]

<!-- TABLE OF CONTENTS -->

<h3>Table of Contents</h3>
<ul>
  <li><a href="#project-explanation-video">Project Explanation Video</a></li>
  <li><a href="#about-the-project">About The Project</a></li>
    <ul>
      <li><a href="#problem-statement">Problem Statement</a></li>
      <li><a href="#features">Features</a></li>
    </ul>
    <li><a href="#web-interface">Web Interface</a></li>
    <li><a href="#app-usage">App Usage</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <ul>
      <li><a href="#requirements">Requirements</a></li>
      <li><a href="#local-version">Local Version</a></li>
      <li><a href="#docker-version">Docker Version</a></li>
    </ul>
    <li><a href="#run-unittests">Run Unittests</a></li>
    <li><a href="#continuous-integration">Continuous Integration</a></li>
    <li><a href="#deployment">Deployment</a></li>
    <li><a href="#project-structure-overview">Project Structure Overview</a></li>
    <ul>
      <li><a href="#frontend">Frontend</a></li>
      <li><a href="#backend">Backend</a></li>
    </ul>
  </li>
  <li><a href="#tech-stack-overview">Tech Stack Overview</a></li>
  <li><a href="#team-members-and-roles">Team Members and Roles</a></li>
</ul>

## Project Explanation Video

Links to the video (2 sources as backup):

- [YouTube](TODO: PASTE **UNLISTED YOUTUBE** VIDEO LINK IN THESE BRACKETS, this will make a link out of this)
- [Google Drive](TODO: PASTE **GOOGLE DRIVER** VIDEO LINK IN THESE BRACKETS, this will make a link out of this)

The video contains the following sections:

- App showcase and explanation
- Frontend overview
- Backend overview
- Deployment process explanation

## About The Project

### Problem Statement

In today's fast-paced world, parents cherish the intimate moments of reading bedtime stories to their children, a practice proven to enhance vocabulary, concentration, and emotional intelligence. However, due to busy schedules, not all parents manage to maintain this precious routine. Dreamify addresses this challenge by offering an innovative solution that not only facilitates this bonding experience but also personalizes it, making every storytime a unique adventure.

### Features

- Add your children to your profile with information about them, which will be used to generate an image based on your child's description using AI
- Once you have added your children, you can create AI-generated personalized stories for a selected child with personalized images per story chapter.

To learn how to install the app, see "Getting Started" below.  
To learn how to use the app, see "Usage" below.

## Web Interface

<p align="center">
  <table>
    <tr>
      <td>
        <p align="center"><b>Home Page</b></p>
        <p align="center">
            Bring your child's imagination to life with bedtime stories that are as unique as they are
            <br>
          <img src="readme_images/homepage.png" alt="Dreamify Home Page" width="400"/>
        </p>
      </td>
      <td>
        <p align="center"><b>Story Page</b></p>
        <p align="center">
            Immerse your child in a world of adventure with stories that inspire and excite.
            <br>
          <img src="readme_images/storypage.png" alt="Dreamify Story Page" width="400"/>  
        </p>
      </td>
    </tr>
  </table>
</p>

## App Usage

Dreamify is designed to make bedtime stories a personal and engaging experience for your child. Follow these steps to get started:

1. **Sign Up:**

   - Navigate to `Home`.
   - Click on `Get Started` to create a new account.
   - Fill in the required details to set up your profile.
   - Log into your account after the automatic redirection.

2. **Add a Child's Profile:**

   - Once logged in, go to the `My Profile` section.
   - Click on `Add a child` to create a profile for your child.
   - Enter the name, age, interests, and other details that will help personalize the stories.

3. **Create a Story:**

   - Click `New Story` to start.
   - Select your child's profile to tailor the story to their preferences.
   - Choose an image style, a story genre and enter a story topic to create a story based on the provided selections.

4. **Read and Save:**

   - After the story is generated, you can read it together with your child.
   - Created stories are save automatically to your library for repeat bedtime reading.
   - Click `Library` to read previously generated stories.

## Getting Started

To get a local copy up and running follow these simple example steps.

### Requirements

- **An OpenAI API key that has access to image generation and gpt-4** (you only get access to these AI models once you loaded money on your account, free credits don't count)
- Python version `3.11` or higher (verified with version `3.11.0`)
- Node.js (verified with version `v20.11.0`)

### Local Version

#### Setup Environment Variables for local Environment

1. Make sure you are in the `api` folder in the terminal (run `cd api` if not)
2. Run `python env_variables_setup.py`
3. Navigate back to the project root folder
4. Open the newly created .env file
5. Set OPENAI_GENERATE to True (otherwise a dummy asset will be used)
6. Fill in your OpenAI API key right next to OPENAI_API_KEY

#### Run the Backend Server

**Install the Backend Requirements:**

1. Make sure you are in the `api` folder in the terminal (run `cd api` if not)
2. Create a virtual environment: run `python -m venv venv`
3. Activate the virtual environment:
   Windows: run `venv\Scripts\activate.bat`
   Mac/Linux: run `source venv/bin/activate`
4. Run `pip install -r requirements.txt`

**Note:** if `pip`/`python` doesn't work, try `pip3`/`python3`

**Start the Server:**

2. Make sure you are in the `api` folder in the terminal (run `cd api` if not)
3. Activate the virtual environment (if not done already):
   Windows: run `venv\Scripts\activate.bat`
   Mac/Linux: run `source venv/bin/activate`
4. Run `flask --app . run`

**Note**: `flask run` should work, too, because the configuration is saved in `.flaskenv`.

#### Run the Frontend Server

1. Open a new terminal window
2. Make sure you have `yarn` installed (if not, run `npm install --global yarn`)
3. Run `yarn install` to install the node requirements
4. Run `yarn build` to create a build version
5. Run `yarn start` to run the app
6. Navigate to `http://localhost:3000` in the browser

### Docker Version

Make sure to have [Docker](https://www.docker.com/) installed and running.

**Note**: Unfortunately, story generation currently does not work in the docker version when OpenAI generation is enabled (but it works in the local version)

#### Setup Environment Variables for Docker Environment

1. Make sure no `.env` file exists in the project root folder
2. Make sure you are in the `api` folder in the terminal (run `cd api` if not)
3. Run `python env_variables_setup.py production`
4. Navigate back to the project root folder
5. Open the newly created .env file
6. Set OPENAI_GENERATE to True (otherwise a dummy asset will be used)
7. Fill in your OpenAI API key right next to `OPENAI_API_KEY`

#### Start the Docker Containers

1. Make sure you are in the project root folder in the terminal
2. Run `docker-compose up --build` and until it is finished (once the api containers show up)
3. Navigate to `http://localhost:3000` in the browser
4. (To stop the docker container, run `docker-compose down`)

## Run Unittests

1. Make sure you are in the `api` folder in the terminal (run `cd api` if not)
2. Make sure the backend requirements are installed
3. Run `pytest`

## Continuous Integration

Continuous integration settings can be found in `.github/workflows/ci.yaml`.

There are 2 steps:

1. Run the tests
2. Build the Docker containers

## Deployment

**App is up and running on heroku here:**  
**TODO: ADD HEROKU APP LINK HERE**

### Setup Environment Variables for Deployment Environment

1. Make sure no `.env` file exists in the project root folder
2. Make sure you are in the `api` folder in the terminal (run `cd api` if not)
3. Run `python env_variables_setup.py production`

### NEXT STEP <---- TODO: edit this

**!!!!!!!!!!!!!!!!!!!!! TODO !!!!!!!!!!!!!!!!!!!!!**  
**Explain the deployment process with all necessary steps**  
**!!!!!!!!!!!!!!!!!!!!! TODO !!!!!!!!!!!!!!!!!!!!!**

## Project Structure Overview

### Frontend

- Source folder: src
  - assets: contains static assets (images/text) used in the frontend
  - clients: contains the clients for communication with the backend
  - components: contains all components (along with their styles in `styles`)
    - AuthRoute.js: route wrapper to redirect to the home page when logged in
    - ChildProfileCard.js: a card with a child image and some details on it
    - ChildProfileForm.js: a form to enter child details
    - Footer.js: page footer
    - Header.js: page header
    - PopUpAlert.js: warning pop alert
    - ProtectedRoute.js: route wrapper to redirect to the login page when not logged in
    - Spinner.js: component used for loading states
  - contexts: contains the client providers
  - pages: contains all page components (along with their styles in `stlyes` and images used in `photos`)
    - AboutUsPage.js: info about the project developers
    - AddachildPage.js: used to create a new child entry
    - HomePage.js: landing page
    - LibaryPage.js: contains all generated stories
    - LoginPage.js: used to log in
    - ModifyChildPage.js: used to change a child entry
    - NewStoryPage.js: used to generate a new story
    - SelectChildPage.js: used to select a child to generate a story for
    - SignupPage.js: used to register a new account
    - StoryPage.js: displays a given story
    - TermsPage.js: contains sample terms of service and privacy policy
    - UserProfilePage.js: contains all added children and user information
  - utils: contains helper utilities
- App.css: contains all global styling
- App.js: contains the root react component with all routes
- setupProxy.js: contains the proxy initialization for the backend

### Backend

Source folder: api

A detailed file and functionality overview can be found in the [api README](https://github.com/minerva-university/cs162-Dreamify/blob/main/api/README.md).

## Tech Stack Overview

- **Frontend Framework**: **React**
- **Backend Framework**: **Flask** with the extensions:
  - **Flask-SQLAlchemy**: ORM for SQL abstraction
  - **Flask-RESTX**: manages backend route endpoints
  - **Flask-Bcrypt**: password encryption management
  - **Flask-JWT-Extended**: access token management
  - **Flask-Cors**: solves backend reroute problems (proxying did not work for most team members but proxying is used in the Docker and deployment versions)
- **Database**:
  - **SQLite** in the local version
  - **Postgres** in the Docker and deployment version
- **External API**: **OpenAI API**, used to generate text and images
- **Docker/Deployment Servers**:
  - **Frontend**: **nginx**
  - **Backend**: **gunicorn** (WSGI server)

The backend also makes use of asynchronous operations via **asyncio** to speed up processing times for chapter image generation.

## Team Members and Roles

<table align="center" border="1">
  <!-- Mykhailo Chudyk -->
  <tr>
    <td align="center">
        <img src="src/assets/about_us_page/misha.png" alt="Mykhailo Chudyk" width="150" />
    </td>
    <td>
      <strong>Mykhailo Chudyk</strong>
      <p>Main Roles: Frontend Developer (Routes for frontend in App.js, NewStoryPage.js, LibraryPage.js, StoryPage.js, component templates); Designer (Website Design)<br>
      Supporting Role: Project Manager (Project Planning, Agenda, Splitting of work)
      </p>
    </td>
  </tr>
  <!-- Paul Franek -->
  <tr>
    <td align="center">
        <img src="src/assets/about_us_page/paul.png" alt="Paul Franek" width="150" />
    </td>
    <td>
      <strong>Paul Franek</strong>
      <p>Main Role: Backend Developer (Database, OpenAI API connectivity, Routes for frontend, Tests, Docker, Continuous Integration)<br>
      Supporting Role: Frontend Developer (client for backend, bug fixes, style fixes), Documentation
      </p>
    </td>
  </tr>
  <!-- Tamirlan Bektemissov -->
  <tr>
    <td align="center">
        <img src="src/assets/about_us_page/tamir.png" alt="Tamirlan Bektemissov" width="150" />
    </td>
    <td>
      <strong>Tamirlan Bektemissov</strong>
      <p>Main Role: Frontend Developer (HomePage.js, AboutUsPage.js, TermsPage.js, Header.js, Footer.js)<br>
      Supporting Role: Backend Developer (Database design, review PRs)
      </p>
    </td>
  </tr>
  <!-- Flambeau Iriho -->
  <tr>
    <td align="center">
        <img src="src/assets/about_us_page/flambeau.png" alt="Flambeau Iriho" width="150" />
    </td>
    <td>
      <strong>Flambeau Iriho</strong>
      <p>Main Roles: Frontend Developer (LoginPage.js, SignupPage.js, NewStoryPage.js, and StoryPage.js); Product Design (Figma)<br>
      Supporting Role: PR reviewer for front-end pages
      </p>
    </td>
  </tr>
  <!-- Billy Altangerel -->
  <tr>
    <td align="center">
        <img src="src/assets/about_us_page/billy.png" alt="Billy Altangerel" width="150" />
    </td>
    <td>
      <strong>Billy Altangerel</strong>
      <p>Main Role: Frontend Developer (AddachildPage.js, ModifyChildPage.js)<br>
      Supporting Role: Docker, Deployment
      </p>
    </td>
  </tr>
</table>

<!-- MARKDOWN LINKS & IMAGES -->

[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/minerva-university/cs162-Dreamify/forks
[product-screenshot]: readme_images/homepage.png

<!-- Built with-->

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Flask.js]: https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white
[Flask-url]: https://flask.palletsprojects.com/
[SQLAlchemy.js]: https://img.shields.io/badge/SQLAlchemy-ffffff?style=for-the-badge&logo=sqlalchemy&logoColor=black
[SQLAlchemy-url]: https://www.sqlalchemy.org/
[GPT.js]: https://img.shields.io/badge/GPT-008080?style=for-the-badge&logo=openai&logoColor=white
[GPT-url]: https://openai.com/api/
[DALL·E.js]: https://img.shields.io/badge/DALL·E-FFA500?style=for-the-badge&logo=openai&logoColor=white
[DALL·E-url]: https://openai.com/dall-e/
