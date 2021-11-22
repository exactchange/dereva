require('dotenv').config();

(() => {

  /*
  Dependencies
  */

  const fetch = require('node-fetch');

  const { HOST } = process.env;

  const runTests = async () => {
    let data;

    try {
      data = await fetch(`${HOST}/price`);

      const response = await data.json();

      if (response && response.success) {
        console.log('PASSED!');
      }

      /*
       * TODO Tests
       */

    } catch (error) {
      console.log(error);
    }
  };

  runTests();
})();
