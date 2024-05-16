document.addEventListener("DOMContentLoaded", function() {
    const selectContainer = document.getElementById('select-container');
    const imageContainers = document.querySelectorAll('.image-container .selected-image');
    let doneUnblur = false;
    let zoomed=false;
    fetch('options.json')
        .then(response => response.json())
        .then(data => {
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
            initializeFromHash();
        })
        .catch(error => console.error('Error loading options:', error));
    function updateHashAndImage() {
        const hash = Array.from(selectContainer.children).map(select => select.value).join('.');
        window.location.hash = hash; 
        updateSelectedImages();
    }
    function updateSelectedImages() {
        const hash = window.location.hash.substr(1); 
        const values = hash.split('.');
        imageContainers.forEach((container, index) => {
            const imageUrl = 'images/' + values[index] + '.jpeg'; 
            container.querySelector('img').src = imageUrl;
        });
    }
    function initializeFromHash() {
        const hash = window.location.hash.substr(1); 
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
            if (doneUnblur){
            zoom(element);
        }
        });
        element.addEventListener('mouseleave', function() {
            if (zoom){
            unzoom(element);}
        });

    });
    function zoom(img){
        let trueimage=img.getElementsByTagName('img')[0];
        trueimage.style.transform = `scale(1.5)`;
        trueimage.style.transition = `transform 10s`;
        zoomed=true;
    }
    function unzoom(img){
        let trueimage=img.getElementsByTagName('img')[0];
        trueimage.style.transform = `scale(1)`;
        trueimage.style.transition = `transform 0s`;
        zoomed=false;
    }
    function unblurImg(img){
        let blurAmount = 10; 
        let interval = setInterval(function() {
            if (blurAmount > 0) {
                doneUnblur=false;
                blurAmount=blurAmount-0.25; 
                img.style.filter = `blur(${blurAmount}px)`;
            } else {
                clearInterval(interval);
                doneUnblur=true;
            }
        }, 50); 
    }

});
