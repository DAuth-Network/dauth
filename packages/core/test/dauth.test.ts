const DAuth = require("../src")
describe('myFunction', () => {
  it('should return 42 when passed 21', async () => {
    try {
      const dAuth = new DAuth();
      const account = 'scott001110@gmail.com'
      const res = await dAuth.httpService.authOpt(
        account,
        'email',
        'test'
      )
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  });
});