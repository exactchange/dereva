/*
 *
 * Service:Events
 * User
 *
 */

(() => {

  /*
  Exports
  */

  module.exports = () => ({
    onServiceGet: async ({ service, serviceName, method, body }) => (
      service.onHttpGet(
        {
          method,
          body,
          route: {
            path: serviceName
          },
          path: method
        },
        {
          status: code => ({
            end: () => ({
              error: {
                code,
                message: '<Dereva> Service error (GET).'
              }
            })
          }),
          send: body => ({
            status: 200,
            success: true,
            body
          })
        }
      )
    ),
    onServicePost: async ({ service, serviceName, method, body }) => (
      service.onHttpPost(
        {
          method,
          body,
          route: {
            path: serviceName
          },
          path: method
        },
        {
          status: code => ({
            end: () => ({
              error: {
                code,
                message: '<Dereva> Service error (POST).'
              }
            })
          }),
          send: body => ({
            status: 200,
            success: true,
            ...body
          })
        }
      )
    )
  });
})();
