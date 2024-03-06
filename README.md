# Welcome to CS162 Final Project

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

A Flask based API backend was added in the *api* directory.

Read this [tutorial](https://blog.miguelgrinberg.com/post/how-to-create-a-react--flask-project) on how to create Flask + React combined projects.

## Run Backend

Install the backend by running:

```bash
    cd api
    python3 -m venv venv
    source venv/bin/activate
    pip3 install -r requirements.txt
```
**Note:** if `pip3` doesn't work, try `pip`

Start the server by running:

```bash
    cd api
    source venv/bin/activate
    flask --app . run
```

**Note**: `flask run` should work, too, because the configuration is saved in `.flaskenv`.

## Run Frontend

In a separate terminal, install the frontend by running:

```bash
    yarn install
    yarn build
```

In a separate terminal, start the server by running:

```bash
    yarn start
```

## **Please add more to the README**

- Describe the project
- Add screenshots
- Link to figma designs
- Describe team and roles
- Set up unit tests!
- Explain deployment process
- Set up continuous integration pipeline
