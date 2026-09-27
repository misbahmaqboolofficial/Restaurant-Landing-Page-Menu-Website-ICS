/**
 * L'Ambroisie Cafe & Bistro - Interactive JavaScript
 * Custom interactive handlers for navigation, filtering, booking, and lightbox
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Scrolling Header Behavior
    const header = document.querySelector('header');
    
    function checkScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            // Only remove scrolled class if we are not on a light page
            if (!document.body.classList.contains('light-page')) {
                header.classList.remove('scrolled');
            }
        }
    }
    
    // Initial check in case page is loaded scrolled down
    if (document.body.classList.contains('light-page')) {
        header.classList.add('scrolled');
    } else {
        checkScroll();
        window.addEventListener('scroll', checkScroll);
    }

    // 2. Mobile Burger Drawer Navigation
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            // Prevent body scroll when menu is open
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
        });

        // Close menu when clicking link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // 3. Interactive Gallery Filtering & Lightbox (Gallery Page specific)
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterButtons.length > 0 && galleryItems.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Active class switch
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filterValue = btn.getAttribute('data-filter');
                
                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        // Subtle animate in
                        item.style.animation = 'fadeIn 0.5s ease forwards';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // Lightbox Functionality
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    let currentImageIndex = 0;
    let visibleImages = [];

    function updateLightboxImage() {
        if (visibleImages.length > 0) {
            const currentItem = visibleImages[currentImageIndex];
            const img = currentItem.querySelector('img');
            const caption = currentItem.querySelector('.gallery-overlay h3').textContent;
            const category = currentItem.querySelector('.gallery-overlay span').textContent;
            
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxCaption.textContent = `${caption} — ${category}`;
        }
    }

    if (galleryItems.length > 0 && lightbox) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                // Find all currently visible images based on filter
                const activeFilter = document.querySelector('.filter-btn.active');
                const filterVal = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
                
                visibleImages = Array.from(galleryItems).filter(el => {
                    return filterVal === 'all' || el.getAttribute('data-category') === filterVal;
                });
                
                currentImageIndex = visibleImages.indexOf(item);
                
                updateLightboxImage();
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        // Close lightbox
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
            if (!navLinks.classList.contains('active')) {
                document.body.style.overflow = 'auto';
            }
        });

        // Close lightbox on click outside image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        // Navigate Lightbox
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
            updateLightboxImage();
        });

        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
            updateLightboxImage();
        });

        // Keyboard Support
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'Escape') {
                    lightbox.classList.remove('active');
                    document.body.style.overflow = 'auto';
                } else if (e.key === 'ArrowLeft') {
                    currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
                    updateLightboxImage();
                } else if (e.key === 'ArrowRight') {
                    currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
                    updateLightboxImage();
                }
            }
        });
    }

    // 4. Area Selector in Reservations
    const areaOptions = document.querySelectorAll('.area-option');
    areaOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            areaOptions.forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            const radio = opt.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        });
    });

    // 5. Booking Form Submission / Receipt Generator (Reservations Page specific)
    const bookingForm = document.getElementById('bookingForm');
    const receiptOverlay = document.getElementById('receiptOverlay');
    const closeReceiptBtn = document.getElementById('closeReceipt');
    
    if (bookingForm && receiptOverlay) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Gather form data
            const name = document.getElementById('bookingName').value;
            const email = document.getElementById('bookingEmail').value;
            const phone = document.getElementById('bookingPhone').value;
            const date = document.getElementById('bookingDate').value;
            const time = document.getElementById('bookingTime').value;
            const guests = document.getElementById('bookingGuests').value;
            
            // Area selection
            let area = "Main Dining Room";
            const selectedAreaOpt = document.querySelector('.area-option.selected label');
            if (selectedAreaOpt) {
                area = selectedAreaOpt.textContent;
            }
            
            // Fill receipt values
            document.getElementById('rcptName').textContent = name;
            document.getElementById('rcptPhone').textContent = phone;
            document.getElementById('rcptDate').textContent = date;
            document.getElementById('rcptTime').textContent = time;
            document.getElementById('rcptGuests').textContent = guests + " Guests";
            document.getElementById('rcptArea').textContent = area;
            
            // Generate Booking Ref code
            const refCode = "AMB-" + Math.floor(100000 + Math.random() * 900000);
            document.getElementById('rcptRef').textContent = refCode;
            
            // Show receipt overlay
            receiptOverlay.classList.add('active');
        });
        
        if (closeReceiptBtn) {
            closeReceiptBtn.addEventListener('click', () => {
                receiptOverlay.classList.remove('active');
                bookingForm.reset();
                // Reset area selection
                areaOptions.forEach(o => o.classList.remove('selected'));
                if (areaOptions.length > 0) {
                    areaOptions[0].classList.add('selected');
                    const radio = areaOptions[0].querySelector('input[type="radio"]');
                    if (radio) radio.checked = true;
                }
            });
        }
    }

    // 6. Generic Contact Form Submission Handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contactName').value;
            alert(`Thank you, ${name}! Your message has been sent successfully. We will get back to you shortly.`);
            contactForm.reset();
        });
    }

    // 7. Generic Event RSVP Handler
    const eventForms = document.querySelectorAll('.event-rsvp-form');
    eventForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value;
            const eventName = form.getAttribute('data-event') || "the event";
            alert(`Success! We've sent an RSVP confirmation for "${eventName}" to ${email}.`);
            form.reset();
        });
    });

    // 8. Newsletter Footer Form Handler
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input').value;
            alert(`Thank you for subscribing! Seasonal updates from L'Ambroisie will be sent to ${email}.`);
            newsletterForm.reset();
        });
    }

    // 9. Dietary Filter Logic for Menu pages
    const dietBtns = document.querySelectorAll('.diet-filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    
    if (dietBtns.length > 0 && menuItems.length > 0) {
        dietBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Toggle active button class
                dietBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filterType = btn.getAttribute('data-diet'); // 'all', 'v', 'vg', 'gf'
                
                menuItems.forEach(item => {
                    if (filterType === 'all') {
                        item.classList.remove('fade-out');
                        return;
                    }
                    
                    // Extract tag values for the current item
                    const tags = Array.from(item.querySelectorAll('.tag')).map(t => t.textContent.trim().toUpperCase());
                    
                    let matchesFilter = false;
                    if (filterType === 'v' && (tags.includes('V') || tags.includes('VG'))) {
                        matchesFilter = true;
                    } else if (filterType === 'vg' && tags.includes('VG')) {
                        matchesFilter = true;
                    } else if (filterType === 'gf' && tags.includes('GF')) {
                        matchesFilter = true;
                    }
                    
                    if (matchesFilter) {
                        item.classList.remove('fade-out');
                    } else {
                        item.classList.add('fade-out');
                    }
                });
            });
        });
    }
});
