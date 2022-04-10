// Client facing scripts here
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
        <div class="col-lg-8 mx-auto d-flex justify-content-between">
          <div>
            <h4>${menuItemData.name}</h4>
            <p>${menuItemData.description}</p>
            <h5>$${menuItemData.price / 100}</h5>
          </div>
          <img src="${menuItemData.image_url}" alt="IMG">
        </div>
      </div>
    `);
  };

  const createMenuCategoryTitle = function (categoryData) {
    return $(`
      <div class="row" id="${categoryData.category}">
        <div class="col-lg-8 mx-auto">
          <h3>${categoryData.category}</h3>
        </div>
      </div>  
    `);
  };

  const renderMenuItems = function (categoryData) {
    $("#menu-container").append(createMenuCategoryTitle(categoryData));

    // QUERY DATABASE FOR MENU ITEMS OF SAID CATEGORY
    const menuItems = [
      {
        name: "Spring Rolls2",
        description: "A deep fried roll filled with vegetables FROM DB",
        price: 200,
        image_url: null,
        category: 'Appetizers'
      }
    ];
    // END OF FAKE MINI DATA

    console.log("here");

    for (const menuItem of menuItems) {
      $(`#${categoryData.category}`).append(createMenuItem(menuItem));
    }
  };

  renderMenuItems({ category: 'Mains2' });

});