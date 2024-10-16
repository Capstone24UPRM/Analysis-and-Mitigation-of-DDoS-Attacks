## Set-up for dummy website to be attacked.

### Database Set-Up

#### Download PosgreSQL.

If you do not have Postgres installed. Follow the following links to correctly download the database engine. Keep in mind that there exists multiple ways to download and set-up, any will work as long as you have a new database that you can connect to locally.

Direct download from official website: </br>https://www.postgresql.org/download/

With Homebrew (Make sure to download homebrew if using this method): </br>
Video: https://www.youtube.com/watch?v=IbVPbF7HTL4 </br>
Website: https://formulae.brew.sh/formula/postgresql@14

#### DB Credentials Set-Up

Navegating to /AttackedWebsite/src/backend/config you will find dbConfig.py and populateDB.py.

In order for the website to properly function. Replace placeholders with the DB credentials you are planning to host the information on:

<img src="DB credentials example.png" alt="drawing" width="300"/>

#### Populate DB

On the first Database setup it is necessary to populate it with data. To do this go to /AttackedWebsite/src/backend/config and run ```python3 populateDB.py```. Make note that if you run this command more than once you might ruin the integrity of the DB.

### Website Set-Up

Technologies: 
- Backend - Python, Flask, PostgreSQL
- Frontend - Javascript, Next.js, TailwindCSS

#### Steps to run website:
Make sure you are on the /AttackedWebsite directory when running these commands:

1. Create a python virtual enviroment:<br/>
```python3 -m venv .venv```

2. Activate enviroment: <br/>
```source .venv/bin/activate```

2. Install dependencies from requirements.txt:<br/>
```pip3 install -r src/backend/requirements.txt```

3. run backend<br/>
```python3 src/backend/main.py```

Great! You should be getting a message about deployment and that our backend application is running.

![alt text](<Backend deployment image.png>)

3. Open another terminal instance to run the frontend.

4. Go to the frontend directory. <br/>
```cd src/frontend```

5. run npm install to get all packages. <br/>
```npm install```

6. Once done with all packages, lets start our server.<br/>
```npm run dev```

All done, access the application by typing the given localhost url in you web browser.
![alt text](<Frontend deployment image.png>)


### Additional Notes

As we attack the website, feel free to configure ports for each of the servers as necessary.