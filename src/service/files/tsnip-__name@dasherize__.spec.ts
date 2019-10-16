
<% if (mocks) { %>
<% mocks.forEach((mock) => { %>
@Injectable()
class Mock<%= mock.typeReference %> {
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
  <%= xlet.decl %> <%= xlet.name %> <% if (xlet.type){ %>: <%= xlet.type %><% } %><% if (xlet.value){ %>= <%= xlet.value %><% } %>;
<% }); %>
<% } %>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
      <% if (beforeeach.imports) { %>
        <% beforeeach.imports.forEach((ximport) => { %>
        <%= ximport %>,
        <% }); %>
      <% } %>
      ],
      providers: [
        <%= classify(className) %>Service,
      <% if (beforeeach.providers) { %>
        <% beforeeach.providers.forEach((provider) => { %>
        <% if (provider.useClass) { %>
        { provide: <%= provider.provide %>, useClass: <%= provider.useClass %> },
        <% } else { %>
        <%= provider.provide %>,
        <% } %>
        <% }); %>
      <% } %>
      ]
    });

    service = TestBed.get(<%= classify(className) %>Service);
    <% if (beforeeach.calls) { %>
    <% beforeeach.calls.forEach((bcall) => { %>
    <%= bcall %>;
    <% }) %>
    <% } %>
  });

  beforeEach(() => {
    <% if (mocks) { %>
    <% mocks.forEach((mock) => { %>
    <%= mock.name %> = TestBed.get(<%= mock.typeReference %>);
    <% }); %>
    <% } %>

    <% standardMocks.forEach((smock) => { %>
    <%= smock.name %> = TestBed.get(<%= smock.typeReference %>);
    <% }); %>
  });

  afterEach(() => {
    <% if (aftereach.calls) { %>
    <% aftereach.calls.forEach((xcall) => { %>
    <%= xcall %>;
    <% }) %>
    <% } %>
  });

  <% clazz.methods.forEach((m) => { %>
    describe('and <%= m.name %>', () => {
      <% m.calls.forEach((call) => { %>
        it('should call <%= call.name %>', () => {
      
        });
      <% }); %>
    });
  <% }) %>
});
