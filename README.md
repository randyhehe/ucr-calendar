# ucr-calendar

The following command line tools will need to be installed:
```
NodeJS. Verify working by testing out command 'node --version'. This should also come with npm (node package manager), test command 'npm'
Bower. (this is a npm package and requires npm to install). To install, type 'npm install -g bower'. Test to see if bower is working by running 'bower'
nodemon (npm install -g nodemon)
node-sass (npm install -g node-sass)
```

In the root of the directory run:
```
npm install
bower install
```

Make sure to do this everytime you get new changes from the master branch, as new dependencie sfrom npm or bower may have been added. When adding your own dependencies from npm and bower, make sure you include --save when installing it (npm install --save package).

Test to see if app builds by running command 'npm run start' or 'npm run start-watch' in root of the directory. Try accessing http://localhost:8080/ on your browser

Probably missing a lot of details and some installation steps. Let me know if you encounter an error.

I recommend quickly reading some information on MongoDB, Express, AngularJS, NodeJS to know what they are and what they do. Then some articles on MEAN to better understand in a high level why we need all 4 of these to make a good web app.

This template is modifed from: https://scotch.io/tutorials/setting-up-a-mean-stack-single-page-application#toc-making-it-all-work-together
This might be helpful in understanding some of the initial code in our project. There are some differences though.
