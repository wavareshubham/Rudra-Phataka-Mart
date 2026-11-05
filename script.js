/**
 * RUDRA FATAKA MART (रुद्र फटाका मार्ट) - STALL NO. 42, SHEVGAON
 * Diwali Fireworks Advertisement Website - Vanilla JavaScript
 * Clean, well-documented, beginner-friendly code
 */

document.addEventListener('DOMContentLoaded', () => {

    // ------------------------------------------------------------------------
    // 1. Mobile Menu Toggle
    // -------------------------------------------------------------------------
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            const isOpen = navLinks.classList.contains('open');
            mobileMenuBtn.setAttribute('aria-expanded', isOpen);
        });

        // Close mobile menu when clicking any nav link
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
            });
        });
    }

    // -------------------------------------------------------------------------
    // 2. Interactive "दिवा लावा" (Light a Diya) Feature
    // -------------------------------------------------------------------------
    const lightDiyaBtn = document.getElementById('lightDiyaBtn');
    const diyaMessage = document.getElementById('diyaMessage');

    if (lightDiyaBtn && diyaMessage) {
        lightDiyaBtn.addEventListener('click', (e) => {
            diyaMessage.style.display = 'block';
            showToast('🪔 शुभ दीपावली! दिवा प्रज्वलित करण्यात आला आहे!');
            
            // Trigger festive firework burst from the button location
            const rect = lightDiyaBtn.getBoundingClientRect();
            createFireworkBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 45);
        });
    }

    // -------------------------------------------------------------------------
    // 3. Fireworks Canvas Animation (Lightweight & Smooth)
    // -------------------------------------------------------------------------
    const canvas = document.getElementById('fireworksCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    // Resize canvas dynamically to match window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Festive color options for fireworks
    const festiveColors = [
        '#FFD700', // Gold
        '#FFA000', // Amber
        '#FF3D00', // Crimson Orange
        '#FF1744', // Red
        '#00E676', // Bright Green
        '#00E5FF', // Cyan Sparkle
        '#FFFFFF'  // Pure White
    ];

    // Particle Class
    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color || festiveColors[Math.floor(Math.random() * festiveColors.length)];
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 1.5;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.alpha = 1;
            this.decay = Math.random() * 0.02 + 0.015;
            this.gravity = 0.08;
            this.size = Math.random() * 2.5 + 1.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += this.gravity;
            this.vx *= 0.98;
            this.vy *= 0.98;
            this.alpha -= this.decay;
        }

        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.alpha);
            ctx.fillStyle = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Function to create a burst of particles at (x, y)
    function createFireworkBurst(x, y, count = 30) {
        const baseColor = festiveColors[Math.floor(Math.random() * festiveColors.length)];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle(x, y, baseColor));
        }
    }

    // Animation Loop
    function animateFireworks() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.update();
            p.draw(ctx);
            if (p.alpha <= 0) {
                particles.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animateFireworks);
    }
    animateFireworks();

    // Occasional gentle ambient fireworks for Diwali festival feeling
    setInterval(() => {
        // Only trigger if tab is visible and particles count is low
        if (!document.hidden && particles.length < 80) {
            const randomX = Math.random() * (canvas.width * 0.7) + (canvas.width * 0.15);
            const randomY = Math.random() * (canvas.height * 0.4) + (canvas.height * 0.1);
            createFireworkBurst(randomX, randomY, 25);
        }
    }, 4500);

    // Burst button in Special Diwali section
    const burstNowBtn = document.getElementById('burstNowBtn');
    if (burstNowBtn) {
        burstNowBtn.addEventListener('click', () => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2.5;
            createFireworkBurst(centerX - 120, centerY, 40);
            createFireworkBurst(centerX, centerY - 60, 50);
            createFireworkBurst(centerX + 120, centerY, 40);
            showToast('🎆 दिवाळीच्या हार्दिक शुभेच्छा!');
        });
    }

    // -------------------------------------------------------------------------
    // 4. Contact Modal Management (Call & WhatsApp Options)
    // -------------------------------------------------------------------------
    const contactModal = document.getElementById('contactModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalHeaderIcon = document.getElementById('modalHeaderIcon');

    // Attach to global window scope so HTML onclick handlers can trigger it
    window.openContactModal = function(type = 'call', customTitle = null) {
        if (!contactModal) return;

        if (type === 'whatsapp') {
            modalHeaderIcon.textContent = '💬';
            modalTitle.textContent = customTitle || 'कोणाशी WhatsApp वर बोलायचे ते निवडा';
        } else {
            modalHeaderIcon.textContent = '📞';
            modalTitle.textContent = customTitle || 'कोणाला कॉल करायचा आहे ते निवडा';
        }

        contactModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    };

    window.closeContactModal = function() {
        if (!contactModal) return;
        contactModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && contactModal.classList.contains('active')) {
            window.closeContactModal();
        }
    });

    // -------------------------------------------------------------------------
    // 5. Product Category Inquire Handler
    // -------------------------------------------------------------------------
    window.inquireProduct = function(productName) {
        // Pre-fill Marathi inquiry message for WhatsApp
        const text = encodeURIComponent(`नमस्कार, मला रुद्र फटाका मार्ट (स्टॉल नं. ४२) मधील "${productName}" फटाक्यांविषयी चौकशी करायची आहे.`);
        
        // Update modal WhatsApp links to include product name in message
        const rishikeshWa = document.querySelector('.action-wa-rishikesh');
        const bharatWa = document.querySelector('.action-wa-bharat');

        if (rishikeshWa) {
            rishikeshWa.href = `https://wa.me/918669710695?text=${text}`;
        }
        if (bharatWa) {
            bharatWa.href = `https://wa.me/919604091262?text=${text}`;
        }

        window.openContactModal('whatsapp', `"${productName}" बाबत चौकशीसाठी निवडा`);
    };

    // -------------------------------------------------------------------------
    // 6. Copy Address to Clipboard
    // -------------------------------------------------------------------------
    const copyAddressBtn = document.getElementById('copyAddressBtn');
    if (copyAddressBtn) {
        copyAddressBtn.addEventListener('click', () => {
            const address = `रुद्र फटाका मार्ट, स्टॉल नं. ४२, खंडोबानगर, शेवगाव, ता. शेवगाव, जि. अहिल्यानगर (पिन: ४१४५०२)\nसंपर्क: 8669710695 / ९६०४०९१२६२`;
            
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(address).then(() => {
                    showToast('✓ दुकानाचा पत्ता कॉपी झाला आहे!');
                }).catch(() => {
                    fallbackCopy(address);
                });
            } else {
                fallbackCopy(address);
            }
        });
    }

    function fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showToast('✓ दुकानाचा पत्ता कॉपी झाला आहे!');
        } catch (err) {
            showToast('पत्ता: खंडोबानगर, स्टॉल ४२, शेवगाव');
        }
        document.body.removeChild(textArea);
    }

    // -------------------------------------------------------------------------
    // 7. Share Shop with Friends on WhatsApp
    // -------------------------------------------------------------------------
    const shareShopBtn = document.getElementById('shareShopBtn');
    if (shareShopBtn) {
        shareShopBtn.addEventListener('click', () => {
            const shareText = encodeURIComponent(
                `🪔 *रुद्र फटाका मार्ट - स्टॉल नं. ४२, शेवगाव* 🎆\n\n` +
                `आमच्या शेवगावमध्ये अस्सल व दर्जेदार फटाक्यांचे भव्य दालन सुरू झाले आहे!\n` +
                `📍 *पत्ता:* खंडोबानगर, स्टॉल नं. ४२, शेवगाव (जि. अहिल्यानगर)\n` +
                `👤 *प्रोप्रा. ऋषिकेश वावरे:* 8669710695\n` +
                `👤 *प्रोप्रा. भारत म्हस्के:* 9604091262\n\n` +
                `या दिवाळीत आपल्या आनंदात भर घाला! नक्की भेट द्या!`
            );
            window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
        });
    }

    // -------------------------------------------------------------------------
    // 8. Toast Notification Utility
    // -------------------------------------------------------------------------
    let toastTimeout;
    function showToast(message) {
        const toast = document.getElementById('toastNotification');
        if (!toast) return;

        toast.textContent = message;
        toast.classList.add('show');

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // -------------------------------------------------------------------------
    // 9. Active Nav Link on Scroll
    // -------------------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links .nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.pageYOffset + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    console.log('रुद्र फटाका मार्ट (स्टॉल नं. ४२, शेवगाव) वेबसाईट यशस्वीरीत्या लोड झाली!');
});
