// App logic.
window.myApp = {};

let nbInit = 0;

document.addEventListener('init', function(event) {
  var page = event.target;

  // Each page calls its own initialization controller.
  if (myApp.controllers.hasOwnProperty(page.id)) {
    myApp.controllers[page.id](page);
  }

  // Fill the lists with initial data when the pages we need are ready.
  // This only happens once at the beginning of the app.
  if ((page.id === 'menuPage' || page.id === 'pendingTasksPage' || page.id === 'completedTasksPage' || page.id === 'enCoursTasksPage') && nbInit == 0) {
    if (document.querySelector('#menuPage')
      && document.querySelector('#enCoursTasksPage')
      && !document.querySelector('#enCoursTasksPage ons-list-item')
    ) {
      nbInit++;
      myApp.services.fixtures.forEach(function(data) {
          myApp.services.tasks.create(data);
      });
    }
  }
});
