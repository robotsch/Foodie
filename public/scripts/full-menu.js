$(() => {

  // Transforms any scripting attacks to normal text 
  const escape = function (str) {
    let div = document.createElement("div");
    div.append(document.createTextNode(str));
    return div.innerHTML;
  };

  const createMenuItem = function (menuItemData) {
    return $(`
      <div class="row">
        <div class="col-lg-8 d-flex justify-content-between">
          <div>
            <h4>${menuItemData.name}</h4>
            <p>${menuItemData.description}</p>
            <h5>$${menuItemData.price / 100}</h5>
          </div>
        </div>
        <div class="menuItem-img-container">
          <img src="${menuItemData.image_url}" alt="IMG">
        </div>
      </div>
    `);
  };

  const createMenuCategoryTitle = function (category) {
    return $(`
      <div class="row" id="${category}">
        <div class="col-lg-8">
          <h3>${category}</h3>
        </div>
      </div>  
    `);
  };

  const renderMenuItems = function (menuItemsData, category) {

    $("#menu-container").append(createMenuCategoryTitle(category));

    for (const menuItem of menuItemsData) {
      $(`#${category}`).append(createMenuItem(menuItem));
    }
  };


  fetch('/api/menu')
    .then(response => response.json())
    .then(data => {
      for (const category in data.categories) {
        if (Object.hasOwnProperty.call(data.categories, category)) {
          renderMenuItems(data.menuItems[category], data.categories[category])
        }
      }
    })
    .catch(err => {
      console.log(err.message);
    });


});