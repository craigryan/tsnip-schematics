
describe('<%= classify(name) %> service test', () => {

  beforeEach(function() {
    <% if (cond1) { %>
      // do cond1
    <% } else { %>
      // do cond2
    <% } %>
  });

  it('should test service', () => {
    console.log('test invoked');
  });
});
