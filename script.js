document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // --- Navigation ---
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        const icon = menuToggle.querySelector('i');
        if (mobileMenu.classList.contains('open')) {
            icon.setAttribute('data-lucide', 'x');
        } else {
            icon.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons();
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            menuToggle.querySelector('i').setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        });
    });

    // --- Hero Slider ---
    const sliderContainer = document.getElementById('heroSlider');
    if (sliderContainer) {
        const slides = [
            {
                image: "img/bag1.jpg",
                title: "Rent Your Ride in Skardu",
                description: "Explore the breathtaking beauty of Skardu with our premium car rental services"
            },
            {
                image: "img/bagimg.png",
                title: "Professional Drivers",
                description: "Experienced local drivers who know the best routes through the mountains"
            },
            {
                image: "img/bag3.jpg",
                title: "Modern Fleet",
                description: "Well-maintained vehicles equipped for mountain terrain and comfort"
            }
        ];

        const dotsContainer = document.getElementById('sliderDots');
        let currentSlide = 0;

        // Initialize slider DOM
        sliderContainer.innerHTML = slides.map((slide, index) => `
            <div class="slide ${index === 0 ? 'active' : ''}" style="background-image: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${slide.image}')">
                <div class="container hero-content">
                    <h1 class="fade-in">${slide.title}</h1>
                    <p class="fade-in-delay">${slide.description}</p>
                    <div class="hero-btns fade-in-delay-2">
                        <a href="https://wa.me/923182277086" target="_blank" class="btn btn-primary btn-lg">Book via WhatsApp</a>
                        <a href="#fleet" class="btn btn-outline btn-lg">View Our Fleet</a>
                    </div>
                </div>
            </div>
        `).join('');

        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        function updateSlider() {
            // Update Slides
            const slideElements = sliderContainer.querySelectorAll('.slide');
            slideElements.forEach((slide, index) => {
                slide.classList.toggle('active', index === currentSlide);
            });

            // Update Dots
            const dots = document.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }

        function goToSlide(index) {
            currentSlide = index;
            updateSlider();
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlider();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateSlider();
        }

        document.getElementById('nextSlide').addEventListener('click', nextSlide);
        document.getElementById('prevSlide').addEventListener('click', prevSlide);

        // Auto Slide
        setInterval(nextSlide, 5000);
    }

    // --- Price Calculator ---
    const carSelect = document.getElementById('carSelect');
    if (carSelect) {
        const rentalDays = document.getElementById('rentalDays');
        const fuelOption = document.getElementById('fuelOption');
        const totalPrice = document.getElementById('totalPrice');
        const bookBtn = document.getElementById('bookBtn');

        // New elements
        const selectedVehicleCard = document.getElementById('selectedVehicleCard');
        const selectedVehicleImg = document.getElementById('selectedVehicleImg');
        const selectedVehicleName = document.getElementById('selectedVehicleName');
        const summaryDays = document.getElementById('summaryDays');
        const summaryBase = document.getElementById('summaryBase');
        const summaryFuel = document.getElementById('summaryFuel');
        const fuelBreakdown = document.getElementById('fuelBreakdown');

        function calculateTotal() {
            const selectedOption = carSelect.options[carSelect.selectedIndex];
            const basePrice = parseInt(carSelect.value);
            const days = parseInt(rentalDays.value) || 1;
            const fuelCostPerDay = parseInt(selectedOption.getAttribute('data-fuel')) || 0;
            const carImage = selectedOption.getAttribute('data-image');
            const carName = selectedOption.getAttribute('data-name');

            if (!isNaN(basePrice)) {
                // Update Selected Vehicle Card
                selectedVehicleCard.style.display = 'block';
                selectedVehicleImg.src = carImage;
                selectedVehicleName.textContent = carName;

                // Calculate Costs
                let baseTotal = basePrice * days;
                let fuelTotal = fuelCostPerDay * days;
                
                summaryDays.textContent = days;
                summaryBase.textContent = `PKR ${baseTotal.toLocaleString()}`;
                
                let finalTotal = baseTotal;

                if (fuelOption.checked) {
                    fuelBreakdown.style.display = 'none';
                    // If fuel by customer, total is just base total
                    finalTotal = baseTotal;
                } else {
                    fuelBreakdown.style.display = 'flex';
                    summaryFuel.textContent = `PKR ${fuelTotal.toLocaleString()}`;
                    finalTotal = baseTotal + fuelTotal;
                }

                totalPrice.textContent = `PKR ${finalTotal.toLocaleString()}`;
            } else {
                selectedVehicleCard.style.display = 'none';
                totalPrice.textContent = `PKR 0`;
            }
        }

        carSelect.addEventListener('change', calculateTotal);
        rentalDays.addEventListener('input', calculateTotal);
        fuelOption.addEventListener('change', calculateTotal);

        bookBtn.addEventListener('click', () => {
            if (!carSelect.value) {
                alert('Please select a car model first');
                return;
            }
            const carName = carSelect.options[carSelect.selectedIndex].getAttribute('data-name');
            const days = rentalDays.value;
            const total = totalPrice.textContent;
            const fuel = fuelOption.checked ? "Fuel by Customer" : "Fuel Included";

            const message = `Hi! I want to book ${carName} for ${days} days. ${fuel}. Estimated Total: ${total}.`;
            window.open(`https://wa.me/923182277086?text=${encodeURIComponent(message)}`, '_blank');
        });
    }

    // Smooth scroll for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // --- Contact Handlers ---
    const phoneCallBtn = document.getElementById('phoneCallBtn');
    if (phoneCallBtn) {
        phoneCallBtn.addEventListener('click', (e) => {
            // Although href="tel:..." works naturally, explicitly setting it 
            // can help in some edge cases or when tracking is needed.
            window.location.href = 'tel:+923182277086';
        });
    }
});
