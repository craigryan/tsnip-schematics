
<% if (mocks) { %>
<% mocks.forEach((mock) => { %>
@Injectable()
class Mock<% mock.typeReference %> {
  // mocked methods go here..
}
<% }); %>
<% } %>

<% if (standardMocks && standardMocks.includes('router')) { %>
@Injectable()
class MockRouter {
  navigate(commands: any[], extras?: any) {}
}
<% } %>

describe('<%= classify(className) %>Service test', () => {

  let service: <%= classify(className) %>Service;

<% if (lets) { %>
<% lets.forEach((xlet) => { %>
  <% xlet.decl %> <% xlet.name %> <% if (xlet.type){ %>: <% xlet.type %><% } %><% if (xlet.value){ %>= <% xlet.value %><% } %>;
<% }); %>
<% } %>

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
      <% if (beforeeach.providers) { %>
        <% beforeeach.providers.forEach((provider) => { %>
        <% if (provider.useClass) { %>
        { provide: <% provider.provide %>, useClass: <% provider.useClass %> },
        <% } else { %>
        <% provider.provide %>,
        <% } %>
        <% }); %>
      <% } %>
      ] ,
      imports: [
      <% if (beforeeach.imports) { %>
        <% beforeeach.imports.forEach((ximport) => { %>
        <% ximport %>,
        <% }); %>
      <% } %>
      ]
    });

    service = TestBed.get(<%= classify(className) %>Service);
  });

  beforeEach(() => {
    <% if (mocks) { %>
    <% mocks.forEach((mock) => { %>
    <% mock.name %> = TestBed.get(<% mock.type %>);
    <% }); %>
    <% } %>

    <% standardMocks.forEach((smock) => { %>
    <% smock.name %> = TestBed.get(<%- smock.type %>);
    <% }); %>
  });

  it('should test service', () => {
    console.log('test invoked');
  });
});
