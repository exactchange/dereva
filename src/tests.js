(() => {

  /*
  Dependencies
  */

  const fetch = require('node-fetch');

  const { URL } = require('../../constants');

  const runTests = async () => {
    let data;

    try {
      data = await fetch(`${URL}/dereva/auth`);

      const response = await data.json();

      console.log(response);

      /*
       * TODO Tests
       */

    } catch (error) {
      console.log(error);
    }
  };

  runTests();
})();
