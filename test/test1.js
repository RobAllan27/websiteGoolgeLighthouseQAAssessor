const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");
const { assert } = require('chai')
const data = require('../data/data.js')
const dataURLs = require('../data/dataBaseURL.js')
const helpers = require('./helpers/helpers.js')


const opts = {
  startingUrl: '',
  output: 'html',
  // logLevel: 'info',
  chromeFlags: [
    // '--headless'
    '--window-size=1440,1696',
    '--disable-mobile-emulation',
    '--disable-network-throttling',
    '--disable-cpu-throttling',
    // 'disableDeviceEmulation: true'
  ]
}

function launchChromeAndRunLighthouse(opts, url, conf = null, mode) {
  return chromeLauncher.launch(opts).then(chrome => {
    opts.port = chrome.port
    let baseURLValue = dataURLs.baseURL;
    return lighthouse(baseURLValue + url, opts, conf).then(res => {
      {
        results = res.report;
        report_file = helpers.file_name(url, mode)
        helpers.find_write_report(report_file, results)
        return chrome.kill().then(() => res.lhr)
      }
    });
  });
}

data.urls_mode.forEach(({ url, mode }) => {
  let config
  config = helpers.decide_config(mode)
  describe('Lighthouse Testing', function () {
    this.timeout(50000)
    let results
    before('run test', done => {
      launchChromeAndRunLighthouse(opts, url, config, mode).then(res => {
        /* Basic loop to list the available parameters  
        for (const [key, value] of Object.entries(res.categories)) {
          //console.log(`####### Here is the value found for the result categories ${key}: ${value}`);
          console.log(`####### Here is the value found for the result categories ${key}`);

          for (const [insidekey, insideValue] of Object.entries(value)) {
            //console.log(`####### Here is the value found for the result categories ${key}: ${value}`);
            console.log(`####### Here is the value found for the result categories ${insidekey}: ${insideValue}`);
          }
        }
        */
        results = Object.keys(res.categories).reduce((merged, category) => {
          merged[category] = res.categories[category].score
          return merged
        }, {})
        done()
      })
    })
    after(function() {
      helpers.write_results_to_table(results)
    })

    it('should have performance score greater than 30', done => {
      /* This print the names of the catagories
      for (const [key, value] of Object.entries(results)) {
        console.log(`####### Here is the value found ${key}: ${value}`);
      }
      */
      assert.equal(results.performance > 0.3, true)
      done()
    })

    it('should have accessibility score greater than 90', done => {
      assert.equal(results.accessibility > 0.9, true)
      done()
    })

    it('should have best-practices score greater than 70', done => {
      let bestPracticesVal = results["best-practices"]
      assert.equal(bestPracticesVal > 0.7, true)
      //assert.equal(results.best-practices > 0.7, true)
      done()
    })

    it('should have SEO score greater than 50', done => {
      assert.equal(results.seo > 0.5, true)
      done()
    })

    it('should have PWA (progressive web application) score greater than 30', done => {
      assert.equal(results.pwa > 0.3, true)
      done()
    })
  })
})
