  // Giphy
  function getGif() {
    const keywords = ["goku", "super saiyan goku", "kamehameha"]; // List of keywords
    const keyword = keywords[Math.floor(Math.random() * keywords.length)]; // Randomly pick one of the keywords
    const GIPHY_API_KEY = 'CORAf4xg925dzX7ZSSBQUjxqXboKfN8T'; // Replace with your Giphy API Key
    const GIPHY_API_URL = `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${keyword}&limit=10&offset=0&rating=g&lang=en`;
    $.getJSON(GIPHY_API_URL, function(data) {
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
          show: {effect: "fade", duration: 400},
          hide: {effect: "fade", duration: 400},
          // height: imgHeight, 
          dialogClass: "goku-modal",
          appendTo: "#gokuWrapper",  // Append the modal to the main section
          open: function(event, ui) {
            $(".ui-dialog-titlebar").hide();
            setTimeout(function() {
              $("#gifModal").dialog('close');
            }, 5000);
          }
        });
      }

      // hotkeys
hotkeys('command+k,ctrl+k', function(event, handler){
    event.preventDefault();  // Prevent the default browser behavior for these key combinations
    $('#searchAddItemField').focus();  // Automatically select the searchAddItemField
  });
  // Function to detect the user's operating system
  function getOS() {
    const platform = window.navigator.platform;
    const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
    if (macosPlatforms.includes(platform)) {
      return 'mac';
    } else if (windowsPlatforms.includes(platform)) {
      return 'windows';
    } else {
      return 'other';
    }
  }
  // Check the user's OS and adjust the hotkey hint text accordingly
  $(document).ready(function() {
    const userOS = getOS();
    if (userOS === 'mac') {
      $('#hotkeyHint').text('⌘');
    } else if (userOS === 'windows') {
      $('#hotkeyHint').text('Ctrl');
    } else {
      $('#hotkeyHint').text('Ctrl');  // Default to Ctrl+K for other OS
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
      completed: false
    },
    {
      name: "Filter to-do's",
      id: 1,
      completed: false
    },
    {
      name: "Complete to-do and see Goku",
      id: 2,
      completed: false
    }
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
    let lastArrayItem = toDoItems[toDoItems.length - 1];
    let itemID = lastArrayItem ? lastArrayItem.id + 1 : 0;
    let item = {
      name: itemName,
      id: itemID,
      completed: false
    };
    toDoItems.push(item);
    updateSiteCards();
    updateCompletedSiteCards();
  }
  // Add a new update function for completed items
  function updateCompletedSiteCards() {
      // Remove any previous cards from the list
      $(completedToDoList).html("");
      // Loop through each item in the array
      toDoItems.forEach(function (item, index) {
        if (item.completed) {
          // Create a card for this item
          let clone = templateItem.clone();
          clone.attr("data-id", item.id);
          clone.find(".to-do_item-title").text(item.name);
          clone.addClass("completed");
          clone.appendTo(completedToDoList);
        }
      });
    }
  // Modify the original updateSiteCards to only include incomplete items
  function updateSiteCards() {
      // Remove any previous cards from the list
      $(toDoList).html("");
      // Loop through each item in the array
      toDoItems.forEach(function (item, index) {
        if (!item.completed) {
          // Create a card for this item
          let clone = templateItem.clone();
          clone.attr("data-id", item.id);
          clone.find(".to-do_item-title").text(item.name);
          clone.appendTo(toDoList);
        }
      });
    }
  function resetTheCookie() {
    localStorage.setItem("todo", JSON.stringify(toDoItems));
  }
  $(document).on("click", ".to-do_item-icon", function (event) {
    event.stopPropagation();  // Stop the event from bubbling up to the parent elements
    let parentCard = $(this).closest(toDoItem);
    let cardId = +parentCard.attr("data-id");
    toDoItems = toDoItems.filter(item => item.id !== cardId);
    parentCard.remove();
    resetTheCookie();
  });
  // Mark an item complete
  $(document).on("click", toDoItem, function () {
    let cardId = +$(this).attr("data-id");
    $(this).toggleClass("completed");
    // Find the array item that matches the data-id attribute
    toDoItems.forEach(function (item, index) {
      if (item.id == cardId) {
        item.completed = !item.completed;
      }
    });
    resetTheCookie();
    updateSiteCards();
    updateCompletedSiteCards();
    // Show Goku gif if item is marked complete
    if ($(this).hasClass("completed")) {
      getGif("goku");
    }
  });
  searchAddItemField.on("keyup", debounce(function (e) {
      let value = searchAddItemField.val();
      if (value.length) {
        if (e.keyCode === 13) {  // Check if 'Enter' is pressed
          let exists = toDoItems.find(item => item.name.toLowerCase() === value.toLowerCase());
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
    }, 300));
    // Check filter
    function checkFilter(value = '') {
      let filterItems = $(toDoList).find(toDoItem);
      filterItems.css("display", "none");
      filterItems.each(function (index) {
        if ($(this).find(".to-do_item-title").text().toLowerCase().includes(value.toLowerCase())) {
          $(this).css("display", "flex");
        }
      });
    }
