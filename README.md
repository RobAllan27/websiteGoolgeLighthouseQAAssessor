Run Performance audits using lighthouse
-

********** Acknowledgements **************
THis test suite is very much based on the 

https://dzone.com/articles/automating-performance-audit-using-lighthouse?utm_medium=feed&utm_source=feedpress.me&utm_campaign=Feed%3A+dzone

The original source repo for this is here.
https://github.com/gowthamraj198/Lighthouse.git


New repo is stored at the following location.

TBC

Additional changes have been made for the specific client, and to add in specific tets for each of
 - performance
 - accessibility
 - best-practices
 - seo
 - pwa  


After cloning the repo,
Install all the dependencies using:
- `npm install`

Install reporting tool mochawesome globally using:
- `npm i -g mochawesome`

Run tests by running the command 
- `npm run test`

Read data (list of urls) from the below path. 'Mode' is whether to open in mobile or desktop
- `data\data.js`


Note:
If you dont want to run using mochawesome reports, run the command:
- `mocha test/test1.js`