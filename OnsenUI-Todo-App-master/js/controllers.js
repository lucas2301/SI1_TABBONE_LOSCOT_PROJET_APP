/***********************************************************************
 * App Controllers. These controllers will be called on page initialization. *
 ***********************************************************************/

myApp.controllers = {

  //////////////////////////
  // Tabbar Page Controller //
  //////////////////////////

  tabbarPage: function(page) {
    // Set button functionality to open/close the menu.
    page.querySelector('[component="button/menu"]').onclick = function() {
      document.querySelector('#mySplitter').left.toggle();
    };

    // Set button functionality to push 'new_task.html' page.
    Array.prototype.forEach.call(page.querySelectorAll('[component="button/new-task"]'), function(element) {
      element.onclick = function() {
        document.querySelector('#myNavigator').pushPage('html/new_task.html');
      };

      element.show && element.show(); // Fix ons-fab in Safari.
    });

    // Change tabbar animation depending on platform.
    page.querySelector('#myTabbar').setAttribute('animation', ons.platform.isAndroid() ? 'slide' : 'none');
  },

  ////////////////////////
  // Menu Page Controller //
  ////////////////////////
  menuPage: function(page) {
    // Set functionality for 'No Category' and 'All' default categories respectively.
    myApp.services.categories.bindOnCheckboxChange(page.querySelector('#default-category-list ons-list-item[category-id=""]'));
    myApp.services.categories.bindOnCheckboxChange(page.querySelector('#default-category-list ons-list-item:not([category-id])'));

    // Change splitter animation depending on platform.
    document.querySelector('#mySplitter').left.setAttribute('animation', ons.platform.isAndroid() ? 'overlay' : 'reveal');
    page.querySelector('[component="button/delall"]').onclick = function () {myApp.services.tasks.removeall();};
  },

  ////////////////////////////
  // New Task Page Controller //
  ////////////////////////////
  newTaskPage: function(page) {
    // Ajout des categories
    let categoryChosen = "newCategory";
    let selectCategory = document.querySelector('#category-select');
    let strCat = `<option value="newCategory">New Category :</option>`;
    tabCat = [];
    myApp.services.fixtures.forEach(function(data) {
      let categ = data.category;
        if (! tabCat.includes(categ)){
          strCat += `
          <option value="${categ}">${categ}</option>
          `;
          tabCat.push(categ);
        }
    });
    selectCategory.innerHTML = strCat;
    selectCategory.addEventListener('change', function (event) {
      categoryChosen = event.target.value;
      if (categoryChosen == "newCategory")
        document.querySelector('#category-input').disabled = false;
      else
        document.querySelector('#category-input').disabled = true;
    });

    // Set button functionality to save a new task.
    Array.prototype.forEach.call(page.querySelectorAll('[component="button/save-task"]'), function(element) {
      element.onclick = function() {
        var newTitle = page.querySelector('#title-input').value;
        let catadd = '';
        if (categoryChosen == "newCategory")
          catadd = document.querySelector('#category-input').value;
        else
          catadd = categoryChosen;

        var date = page.querySelector("#deadline-input").value;
        if (newTitle && date) {
          // If input title is not empty, create a new task.
          nouvelletache = {
            title: newTitle,
            category: catadd,
            description: page.querySelector('#description-input').value,
            deadline: date,
            highlight: page.querySelector('#highlight-input').checked,
            urgent: page.querySelector('#urgent-input').checked,
            fini: 0
          };

          myApp.services.fixtures.push(nouvelletache);
          localStorage.setItem("taches", JSON.stringify(myApp.services.fixtures));

          myApp.services.tasks.create(nouvelletache);

          // Set selected category to 'All', refresh and pop page.
          document.querySelector('#default-category-list ons-list-item ons-radio').checked = true;
          document.querySelector('#default-category-list ons-list-item').updateCategoryView();
          document.querySelector('#myNavigator').popPage();

        } else {
          // Show alert if the input title is empty.
          ons.notification.alert((!newTitle) ? 'You must provide a task title.' : 'You must provide a deadline.');
        }
      };
    });
  },

  ////////////////////////////////
  // Details Task Page Controller //
  ///////////////////////////////
  detailsTaskPage: function(page) {
    // Get the element passed as argument to pushPage.
    let categoryChosen = "newCategory";
    let selectCategory = document.querySelector('#category-select-mod');
    let strCat = `<option value="newCategory">New Category :</option>`;
    tabCat = [];
    myApp.services.fixtures.forEach(function(data) {
      let categ = data.category;
        if (! tabCat.includes(categ)){
          strCat += `
          <option value="${categ}">${categ}</option>
          `;
          tabCat.push(categ);
        }
    });
    selectCategory.innerHTML = strCat;
    selectCategory.addEventListener('change', function (event) {
      categoryChosen = event.target.value;
      if (categoryChosen == "newCategory")
        document.querySelector('#category-input-mod').disabled = false;
      else
        document.querySelector('#category-input-mod').disabled = true;
    });
    var element = page.data.element;
    // Fill the view with the stored data.
    page.querySelector('#title-input').value = element.data.title;
    page.querySelector('#category-input-mod').value = element.data.category;
    page.querySelector('#description-input').value = element.data.description;
    page.querySelector("#deadline-input").value = element.data.deadline;
    page.querySelector('#highlight-input').checked = element.data.highlight;
    page.querySelector('#urgent-input').checked = element.data.urgent;

    // Set button functionality to save an existing task.
    page.querySelector('[component="button/save-task"]').onclick = function() {
      var newTitle = page.querySelector('#title-input').value;
      var date = page.querySelector('#deadline-input').value;
      if (newTitle && date) {
        // If input title is not empty, ask for confirmation before saving.
        ons.notification.confirm(
          {
            title: 'Save changes ?',
            message: 'Warning ! Old data will be wiped',
            buttonLabels: ['Cancel', 'Save']
          }
        ).then(function(buttonIndex) {

          if (buttonIndex === 1) {
            // If 'Save' button was pressed, overwrite the task.
            let catadd = '';
            if (categoryChosen == "newCategory")
              catadd = document.querySelector('#category-input-mod').value;
            else
              catadd = categoryChosen;

            myApp.services.tasks.update(element,
              {
                title: newTitle,
                category: catadd,
                description: page.querySelector('#description-input').value,
                ugent: element.data.urgent,
                deadline: date,
                highlight: page.querySelector('#highlight-input').checked,
                fini: element.data.fini
              }
            );

            // Set selected category to 'All', refresh and pop page.
            document.querySelector('#default-category-list ons-list-item ons-radio').checked = true;
            document.querySelector('#default-category-list ons-list-item').updateCategoryView();
            document.querySelector('#myNavigator').popPage();
          }
        });

      } else {
        // Show alert if the input title is empty.
        ons.notification.alert((!newTitle) ? 'You must provide a task title.' : 'You must provide a deadline.');
      }
    };
  }
};
