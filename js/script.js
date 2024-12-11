let data = {}; // Holds the product data


// Load Product Data
async function loadProductData() {
  try {
    const response = await fetch('http://simonringwelski.dk/wp-content/uploads/2024/10/products.json');
    if (response.ok) {
      data = await response.json();
      console.log('Data loaded from JSON file');
    } else {
      throw new Error('Failed to fetch JSON');
    }
  } catch (error) {
    console.error('Error loading product data:', error);
    data = localBackupData; // Fallback to local backup data
    console.log('Using local backup data');
  }
  renderCategoryMenu(); // Render categories after loading data
}

// Render the Category Menu
function renderCategoryMenu() {
  const container = document.getElementById('product-container');
  container.innerHTML = ''; // Clear previous content

  Object.keys(data).forEach(categoryId => {
    const category = data[categoryId];

    // Create a category button
    const categoryButton = document.createElement('div');
    categoryButton.classList.add('category-button');
    categoryButton.onclick = () => renderProductsForCategory(categoryId);

    // Dynamically construct the image path
    const categoryImagePath = `img/${categoryId.toLowerCase()}.jpg`;

    // Add an image and label for the category
    const categoryImage = document.createElement('img');
    categoryImage.src = categoryImagePath; // Dynamically set the image path
    categoryImage.alt = categoryId;

    const categoryLabel = document.createElement('p');
    categoryLabel.textContent = categoryId;

    // Append the image and label to the button
    categoryButton.appendChild(categoryImage);
    categoryButton.appendChild(categoryLabel);

    // Append the button to the container
    container.appendChild(categoryButton);
  });
}

// Render Products for a Selected Category
function renderProductsForCategory(categoryId) {
  const container = document.getElementById('product-container');
  container.innerHTML = ''; // Clear previous content

  const category = data[categoryId];

  // Dropdown to switch categories
  const categoryDropdown = document.createElement('div');
  categoryDropdown.classList.add('category-dropdown');

  const select = document.createElement('select');
  select.classList.add('category-select');
  select.onchange = (e) => renderProductsForCategory(e.target.value);

  Object.keys(data).forEach(catId => {
    const option = document.createElement('option');
    option.value = catId;
    option.textContent = catId;
    if (catId === categoryId) option.selected = true;
    select.appendChild(option);
  });

  const backButton = document.createElement('button');
  backButton.textContent = 'X';
  backButton.onclick = renderCategoryMenu;

  categoryDropdown.appendChild(select);
  categoryDropdown.appendChild(backButton);
  container.appendChild(categoryDropdown);

  // Render the products for the selected category
  const productGallery = document.createElement('div');
  productGallery.classList.add('product-gallery');

  Object.keys(category).forEach(productId => {
    const product = category[productId];

    // Create product item
    const productItem = document.createElement('div');
    productItem.classList.add('product-item');

    const productImage = document.createElement('img');
    productImage.src = product.images[0];
    productImage.alt = product.title;
    productImage.onclick = () => showDetails(categoryId, productId);

    const productTitle = document.createElement('p');
    productTitle.textContent = product.title;

    productItem.appendChild(productImage);
    productItem.appendChild(productTitle);
    productGallery.appendChild(productItem);
  });

  container.appendChild(productGallery);
}

// Render specifications as a collapsible table
function renderSpecificationsTable(specifications) {
    const specsContainer = document.getElementById('specifications-container');
    specsContainer.innerHTML = ''; // Clear previous content

    if (specifications && specifications.length > 0) {
        // Create a button to toggle the specifications table
        const specsToggle = document.createElement('button');
        specsToggle.textContent = "Specifikationer ▼";
        specsToggle.classList.add('specifications-toggle');
        specsToggle.onclick = () => {
            // Toggle display of the specifications table
            specsTable.style.display = specsTable.style.display === 'none' ? 'block' : 'none';
            specsToggle.textContent = specsTable.style.display === 'none' 
                ? "Specifikationer ▼" : "Specifikationer ▲";
        };

        // Create a table for specifications
        const specsTable = document.createElement('table');
        specsTable.classList.add('specifications-table');
        specsTable.style.display = 'none'; // Start hidden

        // Populate the table with key-value pairs
        specifications.forEach(spec => {
            const row = document.createElement('tr');
            const keyCell = document.createElement('td');
            keyCell.textContent = spec.key;
            const valueCell = document.createElement('td');
            valueCell.textContent = spec.value;
            row.appendChild(keyCell);
            row.appendChild(valueCell);
            specsTable.appendChild(row);
        });

        // Append toggle button and table to specifications container
        specsContainer.appendChild(specsToggle);
        specsContainer.appendChild(specsTable);
        specsContainer.classList.remove('hidden'); // Show specifications container
    } else {
        specsContainer.classList.add('hidden'); // Hide if no specifications
    }
}

let currentImageIndex = 0;  // Tracks the current image index
let productImages = [];     // Stores the list of images for the product

function showDetails(categoryId, productId) {
    const product = data[categoryId][productId];

    // Update main image, title, and description
    document.getElementById('main-image').src = product.images[0];
    currentImageIndex = 0;  // Set current image index to the first image
    productImages = product.images;  // Store all images

    // Update product title and description
    document.getElementById('details-title').textContent = product.title;
    document.getElementById('details-description').textContent = product.description;

    // Render thumbnails
    renderThumbnails(product.images);

    // Render variant dropdown and options
    renderVariantDropdown(product.variants);

    // Render specifications dropdown (assuming product has specifications)
    renderSpecificationsTable(product.specifications);

    // Show modal by removing 'hidden' class
    //document.getElementById('product-details').classList.remove('hidden');
	
	// Show modal by adding 'open' class for animation
    const modal = document.getElementById('product-details');
    const overlay = document.getElementById('modal-overlay');
    
    modal.classList.add('open');  // Add the 'open' class to trigger the animation
    overlay.style.display = 'block'; // Show the overlay background
    modal.style.display = 'block';  // Make sure the modal is visible
}

function renderVariantDropdown(variants) {
    const variantContainer = document.getElementById('variant-container');
    variantContainer.innerHTML = ''; // Clear previous variants

    if (variants && variants.length > 0) {
        // Create a select dropdown for variants
        const variantSelect = document.createElement('select');
        variantSelect.classList.add('variant-dropdown');
        variantSelect.onchange = () => {
            const selectedVariant = variants[variantSelect.selectedIndex];
            document.getElementById('main-image').src = selectedVariant.image;
            document.getElementById('details-description').textContent = selectedVariant.description;
        };

        // Populate dropdown with variant options
        variants.forEach(variant => {
            const option = document.createElement('option');
            option.textContent = variant.name;
            variantSelect.appendChild(option);
        });

        // Set initial variant image and description
        document.getElementById('main-image').src = variants[0].image;
        document.getElementById('details-description').textContent = variants[0].description;

        // Append dropdown to the container
        variantContainer.appendChild(variantSelect);
        variantContainer.classList.remove('hidden'); // Show if variants exist
    } else {
        variantContainer.classList.add('hidden'); // Hide if no variants
    }
}



function renderThumbnails(images) {
    const thumbnailContainer = document.getElementById('thumbnail-container');
    thumbnailContainer.innerHTML = ''; // Clear previous thumbnails

    // Render images inside thumbnail container
    images.forEach(imgSrc => {
        const thumbnail = document.createElement('img');
        thumbnail.src = imgSrc;
        thumbnail.onclick = () => setMainImage(images.indexOf(imgSrc));  // Set the main image when thumbnail is clicked
        thumbnailContainer.appendChild(thumbnail);
    });
}

// Set main image and update the current index
function setMainImage(index) {
    const mainImage = document.getElementById('main-image');
    mainImage.src = productImages[index];
    currentImageIndex = index;  // Update current image index
}

function expandImage(img) {
	  // Get the modal
	  const modal = document.getElementById('image-modal');
	  const expandedImage = document.getElementById('expanded-image');

	  // Set the modal content to the clicked image's source
	  expandedImage.src = img.src;

	  // Display the modal
	  modal.style.display = 'flex';
}

function closeImageModal() {
	  // Hide the modal
	  const modal = document.getElementById('image-modal');
	  modal.style.display = 'none';
}

// Previous image (navigate left)
function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + productImages.length) % productImages.length;  // Wrap around to last image if at the beginning
    updateModalImage();
}

// Next image (navigate right)
function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % productImages.length;  // Wrap around to first image if at the end
    updateModalImage();
}

// Update the modal's expanded image to the current image
function updateModalImage() {
    const expandedImage = document.getElementById('expanded-image');
    expandedImage.src = productImages[currentImageIndex];
}

function hideDetails() {
  //document.getElementById('product-details').classList.add('hidden');
  const modal = document.getElementById('product-details');
    const overlay = document.getElementById('modal-overlay');
    
    modal.classList.remove('open');  // Remove the 'open' class to trigger the closing animation
    overlay.style.display = 'none'; // Hide the overlay
    setTimeout(() => { // Ensure the modal disappears after the animation
        modal.style.display = 'none';
    }, 300); // Match the duration of the animation (0.3s)
}


// Initial load of product data
loadProductData();

/* //Vitual Keyborad
let virtualKeyboard = null; // Will hold the keyboard element

// Function to create the virtual keyboard dynamically
function createVirtualKeyboard() {
  // Create keyboard container
  virtualKeyboard = document.createElement('div');
  virtualKeyboard.classList.add('virtual-keyboard');

  // Create rows of keys
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Space', 'Backspace', 'Clear', 'Submit', 'Close']
  ];

  // Create and append rows
  rows.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('row');
    row.forEach(key => {
      const button = document.createElement('button');
      button.classList.add('key');
      button.textContent = key;
      button.onclick = () => handleKeyPress(key);
      rowDiv.appendChild(button);
    });
    virtualKeyboard.appendChild(rowDiv);
  });

  // Append the virtual keyboard to the body or a container
  document.body.appendChild(virtualKeyboard);
}

// Function to handle key press
function handleKeyPress(key) {
  const activeInput = document.activeElement; // Get the focused input element
  if (!activeInput || activeInput.tagName !== "INPUT") return;

  if (key === 'Space') {
    activeInput.value += ' ';
  } else if (key === 'Backspace') {
    activeInput.value = activeInput.value.slice(0, -1); // Remove last character
  } else if (key === 'Clear') {
    activeInput.value = ''; // Clear the input field
  } else if (key === 'Submit') {
    alert('Submitted: ' + activeInput.value); // Example submission
  } else if (key === 'Close') {
    hideVirtualKeyboard()
  } else {
    activeInput.value += key; // Append the character to the input
  }
}

// Function to show the keyboard
function showVirtualKeyboard() {
  // Check if the keyboard already exists
  if (!virtualKeyboard) {
    createVirtualKeyboard(); // Create and show the keyboard
  }

  // Show the keyboard by changing its display style (if you want to animate it)
  virtualKeyboard.style.display = 'flex';
}

// Function to hide the keyboard
function hideVirtualKeyboard() {
  if (virtualKeyboard) {
    virtualKeyboard.style.display = 'none'; // Hide the keyboard
  }
}

// Add event listeners to hide keyboard when clicking outside the input field
document.addEventListener('click', function(event) {
  const input = document.getElementById('control-panel-input');
  if (!input.contains(event.target) && virtualKeyboard && virtualKeyboard.contains(event.target)) {
    hideVirtualKeyboard();
  }
});
 */



//Control panel

// Global variable to track the modal
let controlPanelModal = null;

// Function to open the control panel as a modal
function openControlPanel() {
    // Check if the modal is already open
    if (controlPanelModal) {
        // If the modal is open, focus on it
        controlPanelModal.style.display = 'block';
        return;
    }

    // Create the modal HTML content dynamically
    controlPanelModal = document.createElement('div');
    controlPanelModal.id = 'controlPanelModal';
    controlPanelModal.classList.add('control-modal');

    controlPanelModal.innerHTML = `
        <div class="control-modal-content">
            <span class="control-close-btn" id="closeControlPanelBtn">&times;</span>
            <h2>Control Panel</h2>
            
            <!-- Welcome Message Section -->
            <label for="welcomeMessageInput">Enter Welcome Message:</label>
            <input type="text" id="welcomeMessageInput" placeholder="Enter your welcome message">
            <button id="saveWelcomeMessageBtn">Save</button>
            <p id="saveMessage" style="color: green; display: none;">Message saved successfully!</p>
            <p id="errorMessage" style="color: red; display: none;">Please enter a message.</p>

            <h3>Controls</h3>
            <p>Use the options above to set your welcome message. Once set, it will be displayed on the home screen.</p>
        </div>
    `;

    // Append the modal to the body of the page
    document.body.appendChild(controlPanelModal);
	/* document.getElementById('welcomeMessageInput').addEventListener('focus', showVirtualKeyboard); */
	
    // Add event listener to close the modal
    const closeBtn = document.getElementById('closeControlPanelBtn');
    closeBtn.onclick = function() {
        controlPanelModal.style.display = 'none';
		/* hideVirtualKeyboard() */
    };

    // Load the saved welcome message from cookies and set it in the input field
    const welcomeMessage = getCookie('welcomeMessage');
    const welcomeMessageInput = document.getElementById('welcomeMessageInput');
    if (welcomeMessage) {
        welcomeMessageInput.value = welcomeMessage; // Set the saved message in the input
    }

    // Save the welcome message to cookies when the button is clicked
    const saveBtn = document.getElementById('saveWelcomeMessageBtn');
    saveBtn.onclick = function() {
        const newWelcomeMessage = welcomeMessageInput.value;
        if (newWelcomeMessage) {
            // Save the message in a cookie for 7 days
            setCookie('welcomeMessage', newWelcomeMessage, 7);
            // Show a success message inside the control panel
            document.getElementById('saveMessage').style.display = 'block';
			document.getElementById('errorMessage').style.display = 'none'; // Hide error message if successful
			// Recheck the cookie and update the welcome message immediately
            const updatedWelcomeMessage = getCookie('welcomeMessage');
            document.getElementById('welcome-message').textContent = updatedWelcomeMessage;
        } else {
            // Show the error message inside the control panel
            document.getElementById('errorMessage').style.display = 'block';
            document.getElementById('saveMessage').style.display = 'none'; // Hide success message if error
        }
    };

    // Close the modal if user clicks outside the modal
    window.onclick = function(event) {
        if (event.target === controlPanelModal) {
            controlPanelModal.style.display = 'none';
			/* hideVirtualKeyboard() */
        }
    };

    // Show the modal
    controlPanelModal.style.display = 'block';
}

// Function to set cookies
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Function to get a cookie by name
function getCookie(name) {
    const nameEq = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEq) === 0) {
            return c.substring(nameEq.length, c.length);
        }
    }
    return "";
}

// Check if a welcome message is stored in the cookies on page load
window.onload = function() {
    const welcomeMessage = getCookie('welcomeMessage');
    if (welcomeMessage) {
        // If the message exists, display it in the element with the id 'welcome-message'
        document.getElementById('welcome-message').textContent = welcomeMessage;
    }
};

// Close the modal when the page unloads or when the user navigates away
window.onbeforeunload = function() {
    if (controlPanelModal) {
        controlPanelModal.style.display = 'none';
    }
};





    document.addEventListener('DOMContentLoaded', () => {
      const openPanelButton = document.createElement('button');
	  openPanelButton.className = 'open-panel-button';
      openPanelButton.onclick = openControlPanel;
	  
	  // Add image for the button
      const iconImage = document.createElement('img');
      iconImage.src = 'img/menu/gear.png'; // Path to your image
      openPanelButton.appendChild(iconImage);
	  
      document.body.appendChild(openPanelButton);
    });
	
	function reloadWebsite() {
      location.reload(); // Reload the current page
    }
	
	function goHome() {
      window.location.href = 'index.html';
    }

	document.addEventListener('DOMContentLoaded', () => {
      const reloadButton = document.createElement('button');
	  reloadButton.className = 'reload-button';
      reloadButton.onclick = reloadWebsite;
	  
	  // Add image for the button
      const iconImage = document.createElement('img');
      iconImage.src = 'img/menu/reload.png'; // Path to your image
      reloadButton.appendChild(iconImage);
	  
      document.body.appendChild(reloadButton);
    });
	
	document.addEventListener('DOMContentLoaded', () => {
      const homeButton = document.createElement('button');
	  homeButton.className = 'home-button';
      homeButton.onclick = goHome;
	  
	  // Add image for the button
      const iconImage = document.createElement('img');
      iconImage.src = 'img/menu/home.png'; // Path to your image
      homeButton.appendChild(iconImage);
	  
      document.body.appendChild(homeButton);
    });
	
	document.addEventListener('keydown', function(e) {
      // Prevent F11 (Fullscreen toggle)
      if (e.key === 'F11') {
          e.preventDefault();
      }
      // Prevent Ctrl+W (Close window)
      if (e.ctrlKey && e.key === 'w') {
          e.preventDefault();
      }
      // Prevent Alt+F4 (Close window)
      if (e.altKey && e.key === 'F4') {
          e.preventDefault();
      }
	  // Left Arrow for navigation
	  if (e.key === 'ArrowLeft') prevImage();
	  // Right Arrow for navigation
	  if (e.key === 'ArrowRight') nextImage();
	  // Escape to close Image model
      if (e.key === 'Escape') closeImageModal();
  });
 
 
 
 
let startX, startY, endX, endY;

function handleTouchStart(event) {
    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
}

function handleTouchMove(event) {
    const touch = event.touches[0];
    endX = touch.clientX;
    endY = touch.clientY;
}

function handleTouchEnd() {
    const diffX = endX - startX;
    const diffY = endY - startY;

    // Determine swipe direction
    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 50) {
            // Right swipe
            swipeRight();
        } else if (diffX < -50) {
            // Left swipe
            swipeLeft();
        }
    } else {
        if (diffY > 50) {
            // Down swipe
            swipeDown();
        } else if (diffY < -50) {
            // Up swipe
            swipeUp();
        }
    }
}

function swipeRight() {
    console.log("Swiped right");
    nextImage();
}

function swipeLeft() {
    console.log("Swiped left");
    prevImage();
}

function swipeUp() {
    console.log("Swiped up");
    // Implement action for up swipe
}

function swipeDown() {
    console.log("Swiped down");
    closeImageModal()
}

// Attach event listeners
const screenElement = document.getElementById('image-modal');
screenElement.addEventListener('touchstart', handleTouchStart);
screenElement.addEventListener('touchmove', handleTouchMove);
screenElement.addEventListener('touchend', handleTouchEnd);


 
 
 
//This all needs to stay at the end because it breaks stuff if not
// Function to add click animation class
function addClickEffect(button) {
    button.classList.add('clicked');
    setTimeout(() => button.classList.remove('clicked'), 200); // Match the duration to CSS animation
}

// Select and apply click effect to each button
document.querySelectorAll('.back-button, .open-panel-button, .reload-button, .mute-button, .play-button, .home-button').forEach(button => {
    button.addEventListener('click', () => addClickEffect(button));
});

// Function to add click animation class
function addCloseClickEffect(button) {
    button.classList.add('clicked');
    setTimeout(() => button.classList.remove('clicked'), 200); // Match the duration to CSS animation
}

// Apply click effect to the close button
document.querySelector('.close-button').addEventListener('click', function() {
    addCloseClickEffect(this);
    // Add any additional close logic here, if necessary
});
