
// helper function to display data in template
function showTemplate(template, data, id) {
  html = template(data);
  $(id).html(html);
};

$(document).ready(function () {

  // gets all templates and compiles them
  var navtabsTemplate = $("#navtabs-template").html();
  navtabsTemplate = Handlebars.compile(navtabsTemplate);

  var categoryTemplate = $("#categories-template").html();
  categoryTemplate = Handlebars.compile(categoryTemplate);

  var animalTemplate = $("#animal-template").html();
  animalTemplate = Handlebars.compile(animalTemplate);


  // sets navtabs with content
  showTemplate(navtabsTemplate, animals_data, "#navtabs-content");


  // variable contains current category
  var category_data = animals_data.category[0];


  // begins showing content
  showTemplate(categoryTemplate, category_data, "#categories-content");


  // sets variables

  var active_tab_id = animals_data.category[0].name + "-tab";
  // flag for detecting first click
  var firstClick = true;
  // index of current category
  var current_category_index;
  // handles clicks on the navtabs to display different content


  // navtab click function to change content
  $("li.navtab-item").click(function () {

    $("#animal-content").css("display", "none");

    // stores name of category
    var tab_name = $(this).children().html();

    // loops through categories to find a match
    for (var i = 0; i < animals_data.category.length; i++) {
      if (animals_data.category[i].name == tab_name) {

        // sets category
        category_data = animals_data.category[i];
        showTemplate(categoryTemplate, category_data, "#categories-content");
        break;

      }
    };

    // removes current active class
    if (active_tab_id != $(this).attr("id")) {
      // sets new active class
      $("#" + active_tab_id).removeClass("active");
      $(this).addClass("active");
    } else if (firstClick == true) {
      // if it is the first virtual click, then the class is added
      $(this).addClass("active");
      firstClick = false;
    }

    // sets active tab to tab clicked on
    active_tab_id = $(this).attr("id");
    // sets current category index
    current_category_index = $(this).data("id");

    $("#categories-content").css("display", "");

    // sets variable back to false
    hasSearched = false;

  });


  // virtual click to start showing Reptiles tab
  $("#Reptiles-tab").click();

  // click on animal function to change content
  // uses EVENT DELEGATION -- for more information go to http://stackoverflow.com/questions/21511027/jquery-only-the-first-click-function-works
  $(document).on("click", ".thumbnail", function () {


    var animal_index = $(this).data("id");

    // initialise animal object
    var animalObject;

    if (hasSearched == true) {
      animalObject = {

        // name of category
        name : filteredData.name ,

        animal : {
          // gets animal name
          name : filteredData.animals[animal_index].name ,

          image1 : filteredData.animals[animal_index].image1 ,

          image2 : filteredData.animals[animal_index].image2 ,

          description : filteredData.animals[animal_index].description
        }
      };
    } else {
      animalObject = {

        // name of category
        name : animals_data.category[current_category_index].name ,

        animal : {
          // gets animal name
          name : animals_data.category[current_category_index].animals[animal_index].name ,

          image1 : animals_data.category[current_category_index].animals[animal_index].image1 ,

          image2 : animals_data.category[current_category_index].animals[animal_index].image2 ,

          description : animals_data.category[current_category_index].animals[animal_index].description
        }
      };
    };

    $("#categories-content").css("display", "none");

    showTemplate(animalTemplate, animalObject, "#animal-content");

    $("#animal-content").css("display", "");


  });


  // flag to see if user has searched, for use in setting proper data-ids to display animal
  var hasSearched = false;
  // initializes filteredData as a global variable
  var filteredData;
  // JavaScript for searchbox
  // searchbox search function
  $("#searchbox").keypress(function (event) {
    // if return key is pressed
    var searchText;
    if (event.which == 13) {

      // gets term searched
      searchText = $("#searchbox").val().toLowerCase();

      if (searchText.length == 0) {
        hasSearched = false;
      } else {
        hasSearched = true;
      }

      filteredData = {
        // filter function loops through items in the array given, and keeps the item
        // based on what the anonymous function returns (true or false)
        // the current item in the array is the parameter image (you can give it any name)

          // accesses current category name (as search will still be in the current category)
          name : animals_data.category[current_category_index].name,

          animals : animals_data.category[current_category_index].animals.filter(function (animal) {

          if (animal.name.toLowerCase().search(searchText) > -1) {
            return true;
          }
          return false;
        })
      };

      // error messages to show if nothing was found under the term
      if (filteredData.animals.length == 0) {
        // error message
        $("#categories-content").html('<h1 class="text-center text-warning">There were no animals that matched "' + searchText + '" in this category.');
      } else {
        // if content WAS found
        showTemplate(categoryTemplate, filteredData, "#categories-content");
      }
    };
  });
});
