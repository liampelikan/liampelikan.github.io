const navLinks = document.querySelectorAll('.ul-list li a');
const sections = document.querySelectorAll('section');
const revealElements = document.querySelectorAll('.home-container, .about-container, .resume-container .projects-container, .contact-content');

function removeActive() {
  navLinks.forEach(link => link.parentElement.classList.remove('active'));
}

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);

    window.scrollTo({
      top: targetSection.offsetTop - 120,
      behavior: 'auto'
    });

    removeActive();
    link.parentElement.classList.add('active');
  });
});


let isScrolling = false;

window.addEventListener('scroll', () => {
  if (!isScrolling) {
    window.requestAnimationFrame(() => {
      runScrollLogic();
      isScrolling = false;
    });
    isScrolling = true;
  }
});

function runScrollLogic() {
  const scrollPos = window.scrollY + 150;
  const windowHeight = window.innerHeight;

  // Navigation Active State
  if ((windowHeight + window.scrollY) >= document.body.offsetHeight - 10) {
    removeActive();
    const contactLink = document.querySelector('.ul-list li:last-child a');
    if (contactLink) contactLink.parentElement.classList.add('active');
  } else {
    sections.forEach(section => {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        removeActive();
        const activeLink = document.querySelector(`.ul-list li a[href="#${section.id}"]`);
        if (activeLink) activeLink.parentElement.classList.add('active');
      }
    });
  }

  // Back to Top Button
  if (window.scrollY > 500) {
    backToTop.style.display = "flex";
  } else {
    backToTop.style.display = "none";
  }

  // Reveal Elements
  revealElements.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < windowHeight - 150) {
      el.classList.add('active-reveal');
    }
  });
}

revealElements.forEach(el => el.classList.add('reveal'));

const backToTop = document.createElement('div');
backToTop.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
backToTop.id = "back-to-top";
backToTop.classList.add('back-to-top');
document.body.appendChild(backToTop);

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'auto' });
});

// Contact Form Handling
const contactForm = document.getElementById('contact-form');
const emailInput = contactForm.querySelector('[name="user_email"]');
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

emailInput.addEventListener('input', function () {
  if (this.style.borderColor === 'red') {
    this.style.borderColor = '#ccc';
  }
});

contactForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const emailValue = emailInput.value.trim();
  const btn = contactForm.querySelector('.btn-send');
  const originalText = btn.innerText;

  if (!emailPattern.test(emailValue)) {
    emailInput.style.border = "2px solid red";
    alert("Please enter a valid email address (e.g. name@example.com)");
    return;
  }

  btn.innerText = 'Sending...';

  emailjs.sendForm('service_6j30r54', 'template_9h7ddrs', this)
    .then(function () {
      btn.innerText = 'Sent!';
      contactForm.reset();

      setTimeout(() => {
        btn.innerText = originalText;
      }, 3000);
    }, function (error) {
      btn.innerText = 'Failed';
      btn.style.backgroundColor = 'red';
      console.error('EmailJS Error:', error);
      alert('Failed to send message. Please try again later.');
    });
});

/* --- DARK MODE TOGGLE --- */
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const icon = themeToggle.querySelector('i');

if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark-mode');
  icon.className = 'fa-solid fa-lightbulb';
}

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');

  if (body.classList.contains('dark-mode')) {
    icon.className = 'fa-solid fa-lightbulb';
    localStorage.setItem('theme', 'dark');
  } else {
    icon.className = 'fa-solid fa-moon';
    localStorage.setItem('theme', 'light');
  }
});
