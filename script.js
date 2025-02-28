// toggle icon navbar
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
}

// scroll sections
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 100;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height) {
            // active navbar links
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
            // active sections for animation on scroll
            sec.classList.add('show-animate');
        }
        // if want to animation that repeats on scroll use this
        else {
            sec.classList.remove('show-animate');
        }
    });

    // sticky navbar
    let header = document.querySelector('header');

    header.classList.toggle('sticky', window.scrollY > 100);

    // remove toggle icon and navbar when click navbar links (scroll)
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');

    // animation footer on scroll
    let footer = document.querySelector('footer');

    footer.classList.toggle('show-animate', this.innerHeight + this.scrollY >= document.scrollingElement.scrollHeight);
}



const imageContainer = document.querySelector('.image-container');
const image = document.querySelector('.image-tilt');

imageContainer.addEventListener('mousemove', (e) => {
    let xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    let yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    image.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
});

imageContainer.addEventListener('mouseleave', () => {
    image.style.transform = 'rotateY(0deg) rotateX(0deg)';
});



// Select the image container
const aboutImg = document.querySelector('.about-img');
const img = aboutImg.querySelector('img');

// Add event listener for mouse movement
aboutImg.addEventListener('mousemove', (e) => {
    // Get the bounding box of the container to calculate mouse position
    const { left, top, width, height } = aboutImg.getBoundingClientRect();

    // Calculate mouse position relative to the container
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    // Calculate the tilt values (rotation effect)
    const rotateX = ((mouseY / height) - 0.5) * 30;  // Range: -15deg to 15deg
    const rotateY = ((mouseX / width) - 0.5) * -30;  // Range: -15deg to 15deg

    // Apply the tilt effect and zoom-out on the image
    img.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(0.95)`;
});

// Reset the image rotation when the mouse leaves the container
aboutImg.addEventListener('mouseleave', () => {
    img.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
});



// Image Hover Effect
const homeImgHover = document.querySelector('.home-imgHover');
const homeImg = document.querySelector('.home-imgHover .home-img');

homeImgHover.addEventListener('mouseenter', () => {
    homeImg.classList.add('blur-effect');
});

homeImgHover.addEventListener('mouseleave', () => {
    homeImg.classList.remove('blur-effect');
});

// Initialize Tilt.js on the image container
$('.image-container').tilt({
    scale: 1.05, // Slight zoom effect
    glare: true, // Add a glare effect
    maxGlare: 0.5, // Maximum glare intensity
    maxTilt: 15, // Maximum tilt angle
    speed: 500, // Speed of the tilt effect
});