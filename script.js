const canvas = document.getElementById("video-canvas");
const context = canvas.getContext("2d");

// We have frames from 0 to 239 (240 frames total)
const frameCount = 240;
const currentFrame = (index) =>
    `all_video_frames/frame_${index.toString().padStart(4, "0")}.jpg`;

const images = [];

// Preload all images to ensure smooth playback without network delays during scroll
for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    
    // Draw the first frame as soon as it's loaded
    if (i === 0) {
        img.onload = () => {
            renderImage(img);
        };
    }
    images.push(img);
}

// Function to render an image onto the canvas, mimicking "object-fit: cover"
function renderImage(img) {
    if (!img || !img.complete) return;

    // Set internal canvas resolution to match the screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;

    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    // "Cover" logic
    if (canvasRatio > imgRatio) {
        drawHeight = canvas.width / imgRatio;
        offsetY = (canvas.height - drawHeight) / 2;
    } else {
        drawWidth = canvas.height * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

// Keep track of current frame to redraw on resize
let currentFrameIndex = 0;

// Re-render current frame on window resize to maintain aspect ratio
window.addEventListener("resize", () => {
    if (images[currentFrameIndex]) {
        renderImage(images[currentFrameIndex]);
    }
});

// Update the frame based on scroll position using requestAnimationFrame
window.addEventListener("scroll", () => {
    requestAnimationFrame(() => {
        const scrollTop = document.documentElement.scrollTop;
        const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
        
        // Calculate the current progress of the scroll (0 to 1)
        const scrollFraction = Math.max(0, Math.min(1, scrollTop / maxScrollTop));
        
        // Map the scroll progress to a frame index (0 to 239)
        const frameIndex = Math.min(
            frameCount - 1,
            Math.floor(scrollFraction * frameCount)
        );

        // Update if frame changed
        if (frameIndex !== currentFrameIndex) {
            currentFrameIndex = frameIndex;
            renderImage(images[currentFrameIndex]);
        }
    });
});

// Accordion Logic for Services Section
document.addEventListener("DOMContentLoaded", () => {
    const accordions = document.querySelectorAll('.accordion-header');

    accordions.forEach(accordion => {
        accordion.addEventListener('click', () => {
            const parent = accordion.parentElement;
            const content = parent.querySelector('.accordion-content');
            
            // Close other accordions
            document.querySelectorAll('.accordion').forEach(acc => {
                if (acc !== parent && acc.classList.contains('active')) {
                    acc.classList.remove('active');
                    acc.querySelector('.accordion-content').style.maxHeight = null;
                }
            });

            // Toggle active class
            parent.classList.toggle('active');
            
            // Animate max-height
            if (parent.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + 40 + "px"; // added 40px for padding
            } else {
                content.style.maxHeight = null;
            }
        });
    });
});

// AOS Animation Injection & Initialization
document.addEventListener("DOMContentLoaded", () => {
    // Dynamically add 'data-aos' attributes to elements we want to animate
    const aosTargets = document.querySelectorAll(
        '.section-header, .project-card, .service-glass-card, .about-left, .about-text, .astat, .process-step, .test-card, .hero-title, .hero-subtitle, .hero-desc, .hero-stats'
    );
    
    aosTargets.forEach((el, i) => {
        el.setAttribute('data-aos', 'fade-up');
        // Add a slight staggered delay based on index
        const delay = (i % 4) * 150; 
        el.setAttribute('data-aos-delay', delay);
    });

    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 50
        });
    }
});

// Modal Logic
document.addEventListener("DOMContentLoaded", () => {

    // Contact Modal
    const contactModal = document.getElementById("contactModal");
    const contactOpenBtns = document.querySelectorAll(".cta-right .btn-white");
    const contactCloseBtn = document.getElementById("closeContactModal");

    if(contactModal) {
        contactOpenBtns.forEach(btn => {
            if(btn.textContent.includes("Contact")) {
                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    contactModal.classList.add("active");
                });
            }
        });

        if(contactCloseBtn) {
            contactCloseBtn.addEventListener("click", () => {
                contactModal.classList.remove("active");
            });
        }
    }

    // Book Call Modal
    const bookCallModal = document.getElementById("bookCallModal");
    const bookOpenBtns = document.querySelectorAll(".book-call-btn");
    const bookCloseBtn = document.getElementById("closeBookModal");

    if(bookCallModal) {
        bookOpenBtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                bookCallModal.classList.add("active");
            });
        });

        if(bookCloseBtn) {
            bookCloseBtn.addEventListener("click", () => {
                bookCallModal.classList.remove("active");
            });
        }
    }

    // Book A Call - Form constraints & WhatsApp Integration
    const bookDate = document.getElementById("bookDate");
    if(bookDate) {
        // Prevent selecting past dates
        const today = new Date().toISOString().split('T')[0];
        bookDate.setAttribute('min', today);
        
        // Prevent Sundays
        bookDate.addEventListener('input', function(e) {
            const day = new Date(this.value).getUTCDay();
            if([0].includes(day)) {
                e.preventDefault();
                this.value = '';
                alert('We are closed on Sundays. Please select another day.');
            }
        });
    }

    const whatsappBtn = document.getElementById("bookViaWhatsappBtn");
    if(whatsappBtn) {
        whatsappBtn.addEventListener("click", () => {
            const form = document.getElementById("bookingForm");
            if(!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            
            const formData = new FormData(form);
            const msg = `*New Call Booking Request*%0A%0A` +
                        `*Name:* ${formData.get('Name')}%0A` +
                        `*Email:* ${formData.get('Email')}%0A` +
                        `*Phone:* ${formData.get('Phone')}%0A` +
                        `*Company:* ${formData.get('Company') || 'N/A'}%0A` +
                        `*Service:* ${formData.get('Service')}%0A` +
                        `*Budget:* ${formData.get('Budget')}%0A` +
                        `*Date:* ${formData.get('Date')}%0A` +
                        `*Time:* ${formData.get('Time')}%0A` +
                        `*Details:* ${formData.get('Message') || 'N/A'}`;
            
            const whatsappUrl = `https://wa.me/919334727613?text=${msg}`;
            window.open(whatsappUrl, '_blank');
        });
    }

    // Know More About Me Modal Logic
    const knowMoreBtns = document.querySelectorAll(".know-more-btn");
    const knowMoreModal = document.getElementById("knowMoreModal");
    const closeKnowMoreModal = document.getElementById("closeKnowMoreModal");
    const fsBookCallBtn = document.getElementById("fsBookCallBtn");

    if(knowMoreBtns.length > 0 && knowMoreModal) {
        knowMoreBtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                knowMoreModal.classList.add("active");
                
                // Re-trigger opening animations for header
                const cinematicElements = knowMoreModal.querySelectorAll('.cinematic-reveal');
                cinematicElements.forEach(el => {
                    el.style.animation = 'none';
                    el.offsetHeight; /* trigger reflow */
                    el.style.animation = null; 
                });
            });
        });

        if(closeKnowMoreModal) {
            closeKnowMoreModal.addEventListener("click", () => {
                knowMoreModal.classList.remove("active");
            });
        }
    }

    // Connect Book Call inside Fullscreen Modal to main Book Call Modal
    if(fsBookCallBtn && bookCallModal) {
        fsBookCallBtn.addEventListener("click", () => {
            knowMoreModal.classList.remove("active");
            setTimeout(() => {
                bookCallModal.classList.add("active");
            }, 400); // Wait for fs modal to close
        });
    }

    // Fullscreen Modal Scroll Animations (Intersection Observer)
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    const counters = document.querySelectorAll('.counter');
    
    // Observer specifically for elements inside the modal
    const modalObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                
                // Trigger counter animation if it's a stat block
                if(entry.target.classList.contains('fs-stat')) {
                    const counterEl = entry.target.querySelector('.counter');
                    if(counterEl && !counterEl.classList.contains('counted')) {
                        counterEl.classList.add('counted');
                        const target = +counterEl.getAttribute('data-target');
                        const duration = 2000; // 2 seconds
                        const increment = target / (duration / 16); // 60fps
                        
                        let current = 0;
                        const updateCounter = () => {
                            current += increment;
                            if(current < target) {
                                counterEl.innerText = Math.ceil(current);
                                requestAnimationFrame(updateCounter);
                            } else {
                                counterEl.innerText = target;
                            }
                        };
                        updateCounter();
                    }
                }
                
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target); 
            }
        });
    }, {
        root: document.getElementById('knowMoreModal'), // Use modal as scrolling root
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    scrollRevealElements.forEach(el => {
        modalObserver.observe(el);
    });

    // Image Lightbox Modal Logic
    const imageLightboxModal = document.getElementById("imageLightboxModal");
    const closeLightboxModal = document.getElementById("closeLightboxModal");
    const lightboxImage = document.getElementById("lightboxImage");
    const projectCards = document.querySelectorAll(".project-card");

    if (imageLightboxModal && lightboxImage) {
        projectCards.forEach(card => {
            // Exclude the card that opens the huge gallery
            if (card.id !== "yt-thumbnails-card") {
                card.addEventListener("click", () => {
                    const imgPlaceholder = card.querySelector(".project-img-placeholder");
                    if (imgPlaceholder) {
                        // Get the computed background image
                        const style = window.getComputedStyle(imgPlaceholder);
                        const bgImage = style.getPropertyValue('background-image');
                        
                        // Extract URL from 'url("...")'
                        if (bgImage && bgImage !== "none") {
                            const urlMatch = bgImage.match(/url\(['"]?(.*?)['"]?\)/);
                            if (urlMatch && urlMatch[1]) {
                                lightboxImage.src = urlMatch[1];
                                imageLightboxModal.classList.add("active");
                            }
                        }
                    }
                });
            }
        });

        if (closeLightboxModal) {
            closeLightboxModal.addEventListener("click", () => {
                imageLightboxModal.classList.remove("active");
                setTimeout(() => {
                    lightboxImage.src = "";
                }, 500); // Clear after animation finishes
            });
        }
    }

    // Close on outside click for all modals (updated with lightbox)
    const modals = document.querySelectorAll('.modal-overlay, .fullscreen-modal');
    modals.forEach(modal => {
        modal.addEventListener("click", (e) => {
            if(e.target === modal || e.target.classList.contains("lightbox-content") || e.target.classList.contains("viewer-content")) {
                modal.classList.remove("active");
            }
        });
    });

    // ==========================================
    // DYNAMIC GALLERIES & PANZOOM VIEWER
    // ==========================================
    const galleriesData = {
        "yt-thumbnails-card": {
            title: "YouTube Thumbnails",
            desc: "A collection of high-performing thumbnails designed to maximize clicks.",
            images: [
                "https://plain-apac-prod-public.komododecks.com/202609/02/AQObwcVXw5OCuA1Ayv7i/image.jpg",
                "https://plain-apac-prod-public.komododecks.com/202609/02/WZulWOGGyUBoOfDsXIhM/image.jpg",
                "https://plain-apac-prod-public.komododecks.com/202609/02/QxVmQTZg1CJLHy4WAgcT/image.jpg",
                "https://plain-apac-prod-public.komododecks.com/202609/02/KsO6ZjIFT8dtQPd3Uilh/image.jpg",
                "https://plain-apac-prod-public.komododecks.com/202609/02/VT2f1h8xCwaZubdHPpUa/image.jpg"
            ]
        },
        "sm-design-card": {
            title: "Social Media Design",
            desc: "High-impact social media creatives designed to engage audiences and build brands.",
            images: [
                "https://plain-apac-prod-public.komododecks.com/202609/02/qiAGqJN7hfmQB7pzrm7h/image.jpg", // Original poster
                "https://plain-apac-prod-public.komododecks.com/202609/02/cC4XwXebRTkpIovlEEfN/image.jpg",
                "https://plain-apac-prod-public.komododecks.com/202609/02/8GwihdzBo7TtI3FyvhsG/image.jpg",
                "https://plain-apac-prod-public.komododecks.com/202609/02/dviJyfu9buB7u1rzI0Hz/image.jpg",
                "https://plain-apac-prod-public.komododecks.com/202609/02/xEtrtzeExc4PbsifcEd6/image.jpg",
                "https://plain-apac-prod-public.komododecks.com/202609/02/klnCZYhaylKjuzKol8Dh/image.jpg",
                "https://plain-apac-prod-public.komododecks.com/202609/02/msaDOqQdQY2mrI2eREzQ/image.jpg"
            ]
        }
    };

    let currentGalleryKey = null;
    let currentGalleryIndex = 0;
    let panzoomInstance = null;

    // DOM Elements
    const thumbnailGalleryModal = document.getElementById("thumbnailGalleryModal");
    const closeGalleryModal = document.getElementById("closeGalleryModal");
    const galleryGrid = document.getElementById("galleryGrid");
    const galleryDynamicTitle = document.getElementById("galleryDynamicTitle");
    const galleryDynamicDesc = document.getElementById("galleryDynamicDesc");
    
    const galleryViewerModal = document.getElementById("galleryViewerModal");
    const closeViewerModal = document.getElementById("closeViewerModal");
    const viewerImage = document.getElementById("viewerImage");
    const preloadImage = document.getElementById("preloadImage");
    const viewerCurrent = document.getElementById("viewerCurrent");
    const viewerTotal = document.getElementById("viewerTotal");
    const viewerPrevBtn = document.getElementById("viewerPrevBtn");
    const viewerNextBtn = document.getElementById("viewerNextBtn");

    if (galleryGrid) {
        // Add click listeners to all gallery trigger cards
        Object.keys(galleriesData).forEach(key => {
            const card = document.getElementById(key);
            if (card) {
                card.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openGallery(key);
                });
            }
        });

        // Open Gallery Grid Modal
        const openGallery = (key) => {
            currentGalleryKey = key;
            const data = galleriesData[key];
            
            galleryDynamicTitle.innerText = data.title;
            galleryDynamicDesc.innerText = data.desc;
            viewerTotal.innerText = data.images.length;
            
            // Clear and populate grid
            galleryGrid.innerHTML = "";
            data.images.forEach((src, index) => {
                const delay = (index % 4) * 0.1; // Staggered animation
                const itemHTML = `
                    <div class="gallery-item cinematic-reveal" style="animation-delay: ${delay}s" data-index="${index}">
                        <img src="${src}" alt="Thumbnail ${index + 1}" loading="lazy">
                        <div class="gallery-item-overlay">
                            <i class="ph ph-magnifying-glass-plus"></i> View Full
                        </div>
                    </div>
                `;
                galleryGrid.innerHTML += itemHTML;
            });

            // Re-bind click listeners for new grid items
            const newGalleryItems = document.querySelectorAll(".gallery-item");
            newGalleryItems.forEach(item => {
                item.addEventListener("click", () => {
                    currentGalleryIndex = parseInt(item.getAttribute("data-index"));
                    openViewer(currentGalleryIndex);
                });
            });

            thumbnailGalleryModal.classList.add("active");
            
            // Retrigger animations
            const reveals = thumbnailGalleryModal.querySelectorAll('.cinematic-reveal');
            reveals.forEach(el => {
                el.style.animation = 'none';
                el.offsetHeight;
                el.style.animation = null;
            });
        };

        // Close Gallery Modal
        if(closeGalleryModal) {
            closeGalleryModal.addEventListener("click", () => {
                thumbnailGalleryModal.classList.remove("active");
            });
        }

        // Open Viewer Lightbox
        const openViewer = (index) => {
            if (!currentGalleryKey) return;
            const images = galleriesData[currentGalleryKey].images;
            
            viewerImage.style.opacity = '0';
            setTimeout(() => {
                viewerImage.src = images[index];
                viewerCurrent.innerText = index + 1;
                galleryViewerModal.classList.add("active");
                // Reset or Initialize PanZoom
                if (typeof panzoom !== 'undefined') {
                    if (panzoomInstance) panzoomInstance.dispose();
                    panzoomInstance = panzoom(viewerImage, {
                        maxZoom: 5,
                        minZoom: 1,
                        bounds: true,
                        boundsPadding: 0.1
                    });
                }
                
                // Preload next image
                if(index + 1 < images.length) {
                    preloadImage.src = images[index + 1];
                }
                
                setTimeout(() => {
                    viewerImage.style.opacity = '1';
                }, 50);
            }, 150);
        };

        const nextImage = () => {
            if (!currentGalleryKey) return;
            const len = galleriesData[currentGalleryKey].images.length;
            if (currentGalleryIndex < len - 1) {
                currentGalleryIndex++;
                openViewer(currentGalleryIndex);
            }
        };

        const prevImage = () => {
            if (currentGalleryIndex > 0) {
                currentGalleryIndex--;
                openViewer(currentGalleryIndex);
            }
        };

        // Button Listeners
        if(viewerNextBtn) viewerNextBtn.addEventListener("click", (e) => { e.stopPropagation(); nextImage(); });
        if(viewerPrevBtn) viewerPrevBtn.addEventListener("click", (e) => { e.stopPropagation(); prevImage(); });
        if(closeViewerModal) closeViewerModal.addEventListener("click", () => {
            galleryViewerModal.classList.remove("active");
            if (panzoomInstance) {
                panzoomInstance.dispose();
                panzoomInstance = null;
            }
        });

        // Touch Swipe Navigation Variables
        let touchstartX = 0;
        let touchendX = 0;
        
        galleryViewerModal.addEventListener('touchstart', e => {
            // Only capture swipe if we aren't pinch-zooming
            if (e.touches.length === 1) {
                touchstartX = e.changedTouches[0].screenX;
            }
        }, {passive: true});

        galleryViewerModal.addEventListener('touchend', e => {
            if (e.changedTouches.length === 1) {
                touchendX = e.changedTouches[0].screenX;
                handleSwipe();
            }
        }, {passive: true});

        const handleSwipe = () => {
            const threshold = 50;
            // Only trigger swipe if we are at base zoom (1x)
            let isZoomed = false;
            if (panzoomInstance) {
                const transform = panzoomInstance.getTransform();
                if (transform.scale > 1.05) isZoomed = true;
            }
            
            if (!isZoomed) {
                if (touchendX < touchstartX - threshold) nextImage();
                if (touchendX > touchstartX + threshold) prevImage();
            }
        }

        // Keyboard Navigation
        document.addEventListener("keydown", (e) => {
            if (galleryViewerModal.classList.contains("active")) {
                if (e.key === "ArrowRight") nextImage();
                if (e.key === "ArrowLeft") prevImage();
                if (e.key === "Escape") {
                    closeViewer();
                }
            } else if (thumbnailGalleryModal.classList.contains("active") && e.key === "Escape") {
                thumbnailGalleryModal.classList.remove("active");
            }
        });
    }

    // ==========================================
    // PREMIUM PORTRAIT ANIMATIONS & PARALLAX
    // ==========================================
    
    // Parallax Scroll Effect
    const parallaxWrappers = document.querySelectorAll('.parallax-wrapper');
    if (parallaxWrappers.length > 0) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            requestAnimationFrame(() => {
                parallaxWrappers.forEach(wrapper => {
                    const speed = parseFloat(wrapper.getAttribute('data-parallax-speed')) || 0.1;
                    const yPos = -(scrollY * speed);
                    wrapper.style.transform = `translateY(${yPos}px)`;
                });
            });
        }, { passive: true });
    }

    // Cinematic Intersection Observer for Premium Portraits
    const portraitObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.2 // Trigger when 20% of the image is visible
    });

    const premiumReveals = document.querySelectorAll('.founder-premium-reveal, .about-premium-reveal');
    premiumReveals.forEach(el => {
        portraitObserver.observe(el);
    });
});

    // ==========================================
    // CUSTOM VIDEO PLAYER LOGIC
    // ==========================================
    const cvcPlay = document.getElementById('cvcPlay');
    const cvcSeek = document.getElementById('cvcSeek');
    const cvcProgressBar = document.getElementById('cvcProgressBar');
    const cvcCurrent = document.getElementById('cvcCurrent');
    const cvcTotal = document.getElementById('cvcTotal');
    const cvcMute = document.getElementById('cvcMute');
    const cvcVolume = document.getElementById('cvcVolume');
    const cvcVolumeBar = document.getElementById('cvcVolumeBar');
    const cvcSpeedBtn = document.getElementById('cvcSpeedBtn');
    const cvcSpeedMenu = document.getElementById('cvcSpeedMenu');
    const cvcFullscreen = document.getElementById('cvcFullscreen');
    const viewerVideoEl = document.getElementById('viewerVideo');

    if (viewerVideoEl) {
        // Format time in M:SS
        const formatTime = (timeInSeconds) => {
            const m = Math.floor(timeInSeconds / 60);
            const s = Math.floor(timeInSeconds % 60);
            return m + ':' + (s < 10 ? '0' : '') + s;
        };

        // Play / Pause
        const togglePlay = () => {
            if (viewerVideoEl.paused) {
                viewerVideoEl.play();
                cvcPlay.innerHTML = '<i class="ph-fill ph-pause"></i>';
            } else {
                viewerVideoEl.pause();
                cvcPlay.innerHTML = '<i class="ph-fill ph-play"></i>';
            }
        };

        cvcPlay.addEventListener('click', (e) => { e.stopPropagation(); togglePlay(); });
        
        // Let clicking on the video container toggle play if it's a video
        const panzoomContainer = document.getElementById('viewerPanzoomContainer');
        panzoomContainer.addEventListener('click', (e) => {
            if (viewerVideoEl.style.display === 'block') {
                togglePlay();
            }
        });

        // Time Update & Progress
        viewerVideoEl.addEventListener('timeupdate', () => {
            if (!viewerVideoEl.duration) return;
            const progress = (viewerVideoEl.currentTime / viewerVideoEl.duration) * 100;
            cvcSeek.value = progress;
            cvcProgressBar.style.width = progress + '%';
            cvcCurrent.innerText = formatTime(viewerVideoEl.currentTime);
        });

        viewerVideoEl.addEventListener('loadedmetadata', () => {
            cvcTotal.innerText = formatTime(viewerVideoEl.duration);
            cvcSeek.value = 0;
            cvcProgressBar.style.width = '0%';
            cvcPlay.innerHTML = '<i class="ph-fill ph-play"></i>';
        });

        // Seek
        cvcSeek.addEventListener('input', (e) => {
            e.stopPropagation();
            const time = (cvcSeek.value / 100) * viewerVideoEl.duration;
            viewerVideoEl.currentTime = time;
            cvcProgressBar.style.width = cvcSeek.value + '%';
        });

        // Mute / Unmute
        cvcMute.addEventListener('click', (e) => {
            e.stopPropagation();
            viewerVideoEl.muted = !viewerVideoEl.muted;
            if (viewerVideoEl.muted || viewerVideoEl.volume === 0) {
                cvcMute.innerHTML = '<i class="ph-fill ph-speaker-x"></i>';
                cvcVolume.value = 0;
                cvcVolumeBar.style.width = '0%';
            } else {
                cvcMute.innerHTML = '<i class="ph-fill ph-speaker-high"></i>';
                cvcVolume.value = viewerVideoEl.volume;
                cvcVolumeBar.style.width = (viewerVideoEl.volume * 100) + '%';
            }
        });

        // Volume slider
        cvcVolume.addEventListener('input', (e) => {
            e.stopPropagation();
            viewerVideoEl.volume = cvcVolume.value;
            cvcVolumeBar.style.width = (cvcVolume.value * 100) + '%';
            viewerVideoEl.muted = cvcVolume.value == 0;
            cvcMute.innerHTML = viewerVideoEl.muted ? '<i class="ph-fill ph-speaker-x"></i>' : '<i class="ph-fill ph-speaker-high"></i>';
        });

        // Playback Speed
        cvcSpeedBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            cvcSpeedMenu.classList.toggle('active');
        });

        document.querySelectorAll('.cvc-speed-menu div').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                document.querySelectorAll('.cvc-speed-menu div').forEach(el => el.classList.remove('active'));
                item.classList.add('active');
                const speed = parseFloat(item.getAttribute('data-speed'));
                viewerVideoEl.playbackRate = speed;
                cvcSpeedBtn.innerText = speed + 'x';
                cvcSpeedMenu.classList.remove('active');
            });
        });

        // Fullscreen
        cvcFullscreen.addEventListener('click', (e) => {
            e.stopPropagation();
            if (viewerVideoEl.requestFullscreen) {
                viewerVideoEl.requestFullscreen();
            } else if (viewerVideoEl.webkitRequestFullscreen) {
                viewerVideoEl.webkitRequestFullscreen();
            }
        });

        // Close menus when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.cvc-speed-container')) {
                cvcSpeedMenu.classList.remove('active');
            }
        });
    }


// ==========================================
// VIDEO EDITING STANDALONE MODAL LOGIC
// ==========================================
const videoEditingCard = document.getElementById('video-editing-card');
const videoStandaloneModal = document.getElementById('videoStandaloneModal');
const closeVideoModal = document.getElementById('closeVideoModal');
const standaloneVideoPlayer = document.getElementById('standaloneVideoPlayer');

if (videoEditingCard && videoStandaloneModal) {
    videoEditingCard.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        videoStandaloneModal.classList.add('active');
        if (standaloneVideoPlayer) {
            standaloneVideoPlayer.currentTime = 0;
            standaloneVideoPlayer.play();
        }
    });
}

if (closeVideoModal) {
    closeVideoModal.addEventListener('click', (e) => {
        videoStandaloneModal.classList.remove('active');
        if (standaloneVideoPlayer) standaloneVideoPlayer.pause();
    });
}

if (videoStandaloneModal) {
    videoStandaloneModal.addEventListener('click', (e) => {
        if (e.target === videoStandaloneModal || e.target.classList.contains('modal-overlay') || e.target.classList.contains('viewer-content')) {
            videoStandaloneModal.classList.remove('active');
            if (standaloneVideoPlayer) standaloneVideoPlayer.pause();
        }
    });
}

// ==========================================
// HERO INTERACTIVE SHOWCASE LOGIC
// ==========================================
const heroInteractiveCard = document.getElementById('heroInteractiveCard');
const heroShowcaseModal = document.getElementById('heroShowcaseModal');
const closeHeroShowcaseModal = document.getElementById('closeHeroShowcaseModal');

if (heroInteractiveCard && heroShowcaseModal) {
    heroInteractiveCard.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        heroShowcaseModal.classList.add('active');
    });
}

if (closeHeroShowcaseModal) {
    closeHeroShowcaseModal.addEventListener('click', (e) => {
        heroShowcaseModal.classList.remove('active');
    });
}

if (heroShowcaseModal) {
    heroShowcaseModal.addEventListener('click', (e) => {
        if (e.target === heroShowcaseModal || e.target.classList.contains('modal-overlay') || e.target.classList.contains('hero-showcase-content')) {
            heroShowcaseModal.classList.remove('active');
        }
    });
}

// ==========================================
// TRUST STATS COUNTER ANIMATION
// ==========================================
const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = +entry.target.getAttribute('data-target');
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    entry.target.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    entry.target.innerText = target;
                }
            };
            updateCounter();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => statsObserver.observe(stat));

// ==========================================
// TESTIMONIAL CAROUSEL LOGIC
// ==========================================
const testimonialsTrack = document.getElementById('testimonialsTrack');
const testimonialPrev = document.getElementById('testimonialPrev');
const testimonialNext = document.getElementById('testimonialNext');

if (testimonialsTrack && testimonialPrev && testimonialNext) {
    const scrollAmount = 400; // rough width of a card + gap
    
    testimonialNext.addEventListener('click', () => {
        testimonialsTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
    
    testimonialPrev.addEventListener('click', () => {
        testimonialsTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
}

// ==========================================
// PREMIUM REVIEW SHOWCASE MODAL LOGIC
// ==========================================
const reviewCards = document.querySelectorAll('.premium-test-card');
const reviewShowcaseModal = document.getElementById('reviewShowcaseModal');
const closeReviewModal = document.getElementById('closeReviewModal');

// Modal Elements
const rsClientAvatar = document.getElementById('rsClientAvatar');
const rsClientName = document.getElementById('rsClientName');
const rsClientRole = document.getElementById('rsClientRole');
const rsProject = document.getElementById('rsProject');
const rsStars = document.getElementById('rsStars');
const rsFullReview = document.getElementById('rsFullReview');

reviewCards.forEach(card => {
    card.addEventListener('click', () => {
        // Extract data
        const name = card.querySelector('.client-name').innerText;
        const role = card.querySelector('.client-role').innerText;
        const avatarSrc = card.querySelector('.client-avatar').src || card.querySelector('.client-avatar').innerHTML; 
        const isPlaceholder = card.querySelector('.placeholder-avatar');
        
        const fullReviewText = card.getAttribute('data-full-review');
        const projectType = card.getAttribute('data-project');
        
        // Populate Modal
        rsClientName.innerText = name;
        rsClientRole.innerText = role;
        rsProject.innerText = projectType;
        
        if (isPlaceholder) {
            rsClientAvatar.style.display = 'none'; // Fallback for pure icon placeholders
        } else {
            rsClientAvatar.style.display = 'block';
            rsClientAvatar.src = avatarSrc;
        }

        // Generate 5 Animated Stars with delays
        rsStars.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            const star = document.createElement('i');
            star.className = 'ph-fill ph-star';
            star.style.animationDelay = (0.3 + (i * 0.1)) + 's';
            rsStars.appendChild(star);
        }

        // Generate Line-by-line staggered text
        rsFullReview.innerHTML = '';
        const sentences = fullReviewText.split('. ');
        sentences.forEach((sentence, index) => {
            if (sentence.trim().length > 0) {
                const span = document.createElement('span');
                span.className = 'rs-line';
                span.style.animationDelay = (0.5 + (index * 0.15)) + 's';
                span.innerText = sentence + (index === sentences.length -1 ? '' : '. ');
                rsFullReview.appendChild(span);
            }
        });

        // Open Modal
        reviewShowcaseModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

if (closeReviewModal) {
    closeReviewModal.addEventListener('click', () => {
        reviewShowcaseModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
}

if (reviewShowcaseModal) {
    reviewShowcaseModal.addEventListener('click', (e) => {
        if (e.target === reviewShowcaseModal || e.target.classList.contains('modal-overlay') || e.target.classList.contains('review-showcase-container')) {
            reviewShowcaseModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

/* ========================================= */
/* NAVIGATION SCROLL & ACTIVE STATE          */
/* ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('.nav-links a, .footer-col a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Only act on internal section links
            if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    e.preventDefault();
                    
                    // Offset by 80px to account for any fixed headers if present
                    const offsetTop = targetSection.getBoundingClientRect().top + window.scrollY - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 2. Active State Observer on Scroll
    // Observe sections and footer
    const sections = document.querySelectorAll('section[id], footer[id]');
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px', // Trigger when section is roughly in the middle of the viewport
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                
                // Update active state across all navigation links
                document.querySelectorAll('.nav-links a, .footer-col a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + currentId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});
