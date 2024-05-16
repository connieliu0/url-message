document.addEventListener("DOMContentLoaded", function() {
    const selectContainer = document.getElementById('select-container');
    const imageContainers = document.querySelectorAll('.image-container .selected-image');

    // Load options from JSON
    fetch('options.json')
        .then(response => response.json())
        .then(data => {
            // Create select elements
            Object.keys(data).forEach((key, index) => {
                const select = document.createElement('select');
                select.id = key;
                select.setAttribute('data-image-index', index);
                select.addEventListener('change', updateHashAndImage);
                data[key].forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.value;
                    optionElement.textContent = option.label;
                    select.appendChild(optionElement);
                });
                selectContainer.appendChild(select);
            });
            // Initialize based on URL hash
            initializeFromHash();
        })
        .catch(error => console.error('Error loading options:', error));

    // Function to update URL hash and selected image
    function updateHashAndImage() {
        const hash = Array.from(selectContainer.children).map(select => select.value).join('.');
        window.location.hash = hash; // Update URL hash
        updateSelectedImages();
    }

    // Function to update selected images
    function updateSelectedImages() {
        const hash = window.location.hash.substr(1); // Remove '#' from hash
        const values = hash.split('.');
        imageContainers.forEach((container, index) => {
            const imageUrl = 'images/' + values[index] + '.jpeg'; // Assuming image filenames correspond to select values
            container.querySelector('img').src = imageUrl;
        });
    }

    // Initialize based on URL hash
    function initializeFromHash() {
        const hash = window.location.hash.substr(1); // Remove '#' from hash
        if (hash) {
            const values = hash.split('.');
            const selects = Array.from(selectContainer.children);
            if (values.length === selects.length) {
                values.forEach((value, index) => {
                    selects[index].value = value;
                });
                updateSelectedImages();
            }
        }
    }
    const image=document.getElementsByClassName('selected-image');
    console.log(image)
    Array.from(image).forEach(function(element) {
        element.addEventListener('mouseenter', function() {
            unblurImg(element);
        });

    });
    function unblurImg(img){
        let blurAmount = 10; // Initial blur amount
        let interval = setInterval(function() {
            if (blurAmount > 0) {
                blurAmount=blurAmount-0.25; // Decrease blur amount gradually
                img.style.filter = `blur(${blurAmount}px)`;
            } else {
                clearInterval(interval); // Stop interval when blur is 0
            }
        }, 50); // Interval for smoother transition, adjust as needed
    }

});
