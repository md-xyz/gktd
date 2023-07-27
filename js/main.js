let completedToDoItems = [];
let isBlurred = false;

if (localStorage.getItem("completedTodo") != null) {
  completedToDoItems = JSON.parse(localStorage.getItem("completedTodo"));
}

// Giphy
function getGif() {
  const keywords = ["goku", "super saiyan goku", "kamehameha"]; // List of keywords
  const keyword = keywords[Math.floor(Math.random() * keywords.length)]; // Randomly pick one of the keywords
  const GIPHY_API_KEY = "CORAf4xg925dzX7ZSSBQUjxqXboKfN8T"; // Replace with your Giphy API Key
  const GIPHY_API_URL = `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${keyword}&limit=10&offset=0&rating=g&lang=en`;
  $.getJSON(GIPHY_API_URL, function (data) {
    if (data.data.length) {
      // Select a random gif from the returned results
      let randomIndex = Math.floor(Math.random() * data.data.length);
      let gifUrl = data.data[randomIndex].images.original.url;
      showGifModal(gifUrl);
    }
  });
}
function showGifModal(gifUrl) {
  $("#gifImage").attr("src", gifUrl);
  $("#gifModal").dialog({
    modal: true,
    width: "680px",
    show: { effect: "fade", duration: 400 },
    hide: { effect: "fade", duration: 400 },
    // height: imgHeight,
    dialogClass: "goku-modal",
    appendTo: "#gokuWrapper", // Append the modal to the main section
    open: function (event, ui) {
      $(".ui-dialog-titlebar").hide();
      setTimeout(function () {
        $("#gifModal").dialog("close");
      }, 5000);
    },
  });
}

// hotkeys
hotkeys("command+/,ctrl+/", function (event, handler) {
  event.preventDefault(); // Prevent the default browser behavior for these key combinations
  $("#searchAddItemField").focus(); // Automatically select the searchAddItemField
});

$("#searchAddItemField").keyup(function (event) {
  if (event.keyCode == 27) {
    // Escape key has keyCode 27
    $(this).blur();
  }
});

// Function to detect the user's operating system
function getOS() {
  const platform = window.navigator.platform;
  const macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"];
  const windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"];
  if (macosPlatforms.includes(platform)) {
    return "mac";
  } else if (windowsPlatforms.includes(platform)) {
    return "windows";
  } else {
    return "other";
  }
}

hotkeys("f", function (event, handler) {
  event.preventDefault();

  let notFirstItems = $(toDoList).find(toDoItem + ":not(:first)");
  let completedItems = $(completedToDoList).find(toDoItem);
  let completedTitleRow = $(".group-title-row.for--completed");
  let navLeft = $(".nav-left");
  let navRight = $(".nav-right");

  if (localStorage.getItem("blur") === "true") {
    notFirstItems.css("filter", "");
    completedItems.css("filter", "");
    completedTitleRow.css("filter", "");
    navLeft.css("transform", "");
    navRight.css("transform", "");
    localStorage.setItem("blur", "false");
    isBlurred = false;
  } else {
    notFirstItems.css("filter", "blur(4px) opacity(0.3)");
    completedItems.css("filter", "blur(4px) opacity(0.3)");
    completedTitleRow.css("filter", "blur(4px) opacity(0.3)");
    navLeft.css("transform", "translateX(-120%)");
    navRight.css("transform", "translateX(120%)");
    localStorage.setItem("blur", "true");
    isBlurred = true;
  }
});

// When the page loads, restore the blur state and nav positions
$(document).ready(function () {
  if (localStorage.getItem("blur") === "true") {
    let notFirstItems = $(toDoList).find(toDoItem + ":not(:first)"); // Select all todo items except the first one
    let completedItems = $(completedToDoList).find(toDoItem); // Select all completed todo items
    let completedTitleRow = $(".group-title-row.for--completed"); // Select the title row for completed todos
    let navLeft = $(".nav-left"); // Select the left nav
    let navRight = $(".nav-right"); // Select the right nav

    // Add the blur and opacity, and slide the navs off screen
    notFirstItems.css("filter", "blur(4px) opacity(0.3)");
    completedItems.css("filter", "blur(4px) opacity(0.3)");
    completedTitleRow.css("filter", "blur(4px) opacity(0.3)");
    navLeft.css("transform", "translateX(-100%)");
    navRight.css("transform", "translateX(100%)");
  }
});

// Check the user's OS and adjust the hotkey hint text accordingly
$(document).ready(function () {
  const userOS = getOS();
  if (userOS === "mac") {
    $("#hotkeyHint").text("⌘");
  } else if (userOS === "windows") {
    $("#hotkeyHint").text("Ctrl");
  } else {
    $("#hotkeyHint").text("Ctrl"); // Default to Ctrl+K for other OS
  }
});
// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
// Class & element variables
let searchAddItemField = $(".field.search-add");
let toDoList = ".to-do_list";
let completedToDoList = ".to-do_list-completed"; // Define this selector as per your HTML
let toDoItem = ".to-do_item";
let templateItem = $(".hidden-template-items").find(".to-do_item").eq(0);
// Create initial list
let toDoItems = [
  {
    name: "Add a couple to-do's",
    id: 0,
    completed: false,
  },
  {
    name: "Filter to-do's",
    id: 1,
    completed: false,
  },
  {
    name: "Complete to-do and see Goku",
    id: 2,
    completed: false,
  },
];
// On page load
if (localStorage.getItem("todo") == null) {
  resetTheCookie();
} else {
  toDoItems = JSON.parse(localStorage.getItem("todo"));
}
updateSiteCards();
updateCompletedSiteCards();

function pushToArray(itemName) {
  let itemID =
    (toDoItems.length > 0 ? toDoItems : completedToDoItems).slice(-1)[0].id + 1;
  let item = {
    name: itemName,
    id: itemID,
    completed: false,
  };
  toDoItems.push(item);
  updateSiteCards();
  updateCompletedSiteCards();
}

// Add a new update function for completed items
function updateSiteCards() {
  // Remove any previous cards from the list
  $(toDoList).html("");
  // Loop through each item in the array
  toDoItems.forEach(function (item, index) {
    let clone = templateItem.clone();
    clone.attr("data-id", item.id);
    clone.find(".to-do_item-title").text(item.name);
    if (item.completed) {
      clone.addClass("completed");
    } else {
      clone.removeClass("completed");
    }
    clone.appendTo(toDoList);
  });

  // Apply sortable widget to non-completed tasks
  // Add the sortable functionality to the toDoList
  $(toDoList).sortable({
    // Only make the .to-do_item elements sortable
    items: toDoItem,
    start: function (event, ui) {
      // When the user starts sorting a to-do item, this function will run
      if (window.navigator && window.navigator.vibrate) {
        // Vibrate for 200ms
        window.navigator.vibrate(200);
      }
    },
    update: function (event, ui) {
      // When the user stops sorting the to-do items, this function will run
      let orderedIDs = $(this).sortable("toArray", { attribute: "data-id" }); // Get the ordered list of IDs
      toDoItems = orderedIDs.map((id) => {
        return toDoItems.find((item) => item.id == id); // Return the item object that matches the ID
      });
      resetTheCookie();

      // Add the blur to all the items except the first one
      let notFirstItems = $(toDoList).find(toDoItem + ":not(:first)");
      let firstItem = $(toDoList).find(toDoItem + ":first");

      // If blur is currently active, reapply it after sorting
      if (isBlurred) {
        notFirstItems.css("filter", "blur(4px) opacity(0.3)");
        firstItem.css("filter", ""); // Ensure the first item does not have the blur
      }
    },
  });

  if (isBlurred) {
    $(toDoList)
      .find(toDoItem + ":not(:first)")
      .css("filter", "blur(4px) opacity(0.3)");
  }
}

function updateCompletedSiteCards() {
  $(completedToDoList).html("");
  completedToDoItems.forEach(function (item, index) {
    let clone = templateItem.clone();
    clone.attr("data-id", item.id);
    clone.find(".to-do_item-title").text(item.name);
    if (item.completed) {
      clone.addClass("completed");
    } else {
      clone.removeClass("completed");
    }
    clone.appendTo(completedToDoList);
  });
  if (isBlurred) {
    $(completedToDoList).find(toDoItem).css("filter", "blur(4px) opacity(0.3)");
  }
}

function resetTheCookie() {
  localStorage.setItem("todo", JSON.stringify(toDoItems));
  localStorage.setItem("completedTodo", JSON.stringify(completedToDoItems));
}

$(document).on("click", ".to-do_item-icon", function (event) {
  event.stopPropagation(); // Stop the event from bubbling up to the parent elements
  let parentCard = $(this).closest(toDoItem);
  let cardId = +parentCard.attr("data-id");

  // Check in toDoItems array
  let index = toDoItems.findIndex((item) => item.id === cardId);
  if (index !== -1) {
    toDoItems.splice(index, 1);
  } else {
    // Check in completedToDoItems array
    index = completedToDoItems.findIndex((item) => item.id === cardId);
    if (index !== -1) {
      completedToDoItems.splice(index, 1);
    }
  }
  parentCard.remove();
  resetTheCookie();
});

// Mark an item complete
// Mark an item complete
$(document).on("click", toDoItem, function () {
  let cardId = +$(this).attr("data-id");
  let index = toDoItems.findIndex((item) => item.id === cardId);
  if (index !== -1) {
    let item = toDoItems.splice(index, 1)[0];
    item.completed = !item.completed;
    completedToDoItems.push(item);

    // All items completed
    if (toDoItems.length === 0) {
      getGif();
    }
  } else {
    index = completedToDoItems.findIndex((item) => item.id === cardId);
    if (index !== -1) {
      let item = completedToDoItems.splice(index, 1)[0];
      item.completed = !item.completed;
      toDoItems.push(item);
    }
  }
  resetTheCookie();
  updateSiteCards();
  updateCompletedSiteCards();
});

searchAddItemField.on(
  "keyup",
  debounce(function (e) {
    let value = searchAddItemField.val();
    if (value.length) {
      if (e.keyCode === 13) {
        // Check if 'Enter' is pressed
        let exists = toDoItems.find(
          (item) => item.name.toLowerCase() === value.toLowerCase()
        );
        if (!exists) {
          pushToArray(value);
          resetTheCookie();
          searchAddItemField.val("");
        }
      } else {
        checkFilter(value);
      }
    } else {
      checkFilter();
    }
  }, 300)
);
// Check filter
function checkFilter(value = "") {
  let filterItems = $(toDoList).find(toDoItem);
  filterItems.css("display", "none");
  filterItems.each(function (index) {
    if (
      $(this)
        .find(".to-do_item-title")
        .text()
        .toLowerCase()
        .includes(value.toLowerCase())
    ) {
      $(this).css("display", "flex");
    }
  });
}
