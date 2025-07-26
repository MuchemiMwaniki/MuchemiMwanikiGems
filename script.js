document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const currentTheme = localStorage.getItem('theme');

    // Apply saved theme on load
    if (currentTheme) {
        body.classList.add(currentTheme);
    } else {
        // Default to light theme if no preference
        body.classList.add('light-theme');
    }

    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light-theme');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark-theme');
        }
    });

    // --- Mobile Navigation Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');

    menuToggle.addEventListener('click', () => {
        navList.classList.toggle('active');
    });

    // Close mobile nav when a link is clicked
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', () => {
            if (navList.classList.contains('active')) {
                navList.classList.remove('active');
            }
        });
    });

    // --- Scroll to Top/Down Buttons ---
    const scrollToTopBtn = document.getElementById('scroll-to-top-btn');
    const scrollToBottomBtn = document.getElementById('scroll-to-bottom-btn');
    const sections = document.querySelectorAll('section'); // Get all sections

    const showScrollButtons = () => {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        const pageHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

        if (scrollPosition > 200) { // Show "scroll to top" after scrolling down a bit
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }

        // Show "scroll to bottom" only if not at the very bottom
        if (scrollPosition < pageHeight - 50) { // 50px buffer from bottom
            scrollToBottomBtn.classList.add('show');
        } else {
            scrollToBottomBtn.classList.remove('show');
        }
    };

    const scrollToSection = (direction) => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        let targetPosition;

        if (direction === 'top') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else if (direction === 'bottom') {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth'
            });
        } else if (direction === 'down') {
            // Find the next section below the current scroll position
            let nextSection = null;
            for (let i = 0; i < sections.length; i++) {
                if (sections[i].offsetTop > currentScroll + 50) { // +50 to ensure it's past the current view
                    nextSection = sections[i];
                    break;
                }
            }
            if (nextSection) {
                targetPosition = nextSection.offsetTop;
            } else {
                targetPosition = document.documentElement.scrollHeight; // Go to bottom if no next section
            }
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        } else if (direction === 'up') {
            // Find the previous section above the current scroll position
            let prevSection = null;
            for (let i = sections.length - 1; i >= 0; i--) {
                if (sections[i].offsetTop < currentScroll - 50) { // -50 to ensure it's past the current view
                    prevSection = sections[i];
                    break;
                }
            }
            if (prevSection) {
                targetPosition = prevSection.offsetTop;
            } else {
                targetPosition = 0; // Go to top if no previous section
            }
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    };

    scrollToTopBtn.addEventListener('click', () => scrollToSection('top'));
    scrollToBottomBtn.addEventListener('click', () => scrollToSection('bottom'));
    // For more dynamic up/down scrolling to next/prev section, you'd need two separate buttons and logic.
    // For this combined button, it mostly serves as "top" or "bottom" direct jump.
    // To implement scroll to next/previous section, you'd make `scroll-to-top-btn` also scroll up, and `scroll-to-bottom-btn` scroll down.
    // Let's modify: scroll-to-top is only 'top', scroll-to-bottom is only 'bottom'.

    window.addEventListener('scroll', showScrollButtons);
    showScrollButtons(); // Call on load to check initial position


    // --- AI Chatbot Placeholder Logic ---
    const chatbotToggleBtn = document.querySelector('.chatbot-toggle-btn');
    const chatbotPopup = document.querySelector('.chatbot-popup');
    const chatbotCloseBtn = document.querySelector('.chatbot-close-btn');
    const chatbotInput = document.querySelector('.chatbot-input');
    const chatbotSendBtn = document.querySelector('.chatbot-send-btn');
    const chatbotMessages = document.querySelector('.chatbot-messages');

    chatbotToggleBtn.addEventListener('click', () => {
        chatbotPopup.classList.toggle('active');
    });

    chatbotCloseBtn.addEventListener('click', () => {
        chatbotPopup.classList.remove('active');
    });

    const appendMessage = (message, sender) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = message;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Auto-scroll to bottom
    };

    const handleChatInput = () => {
        const userMessage = chatbotInput.value.trim();
        if (userMessage === '') return;

        appendMessage(userMessage, 'user');
        chatbotInput.value = ''; // Clear input

        // --- DEMO BOT RESPONSE ---
        // In a real scenario, you'd send 'userMessage' to an AI API here
        // and append the AI's response as a 'bot-message'.
        setTimeout(() => {
            let botResponse = "I'm a demo AI assistant. How else can I assist you with MM's GitHub profile?";
            if (userMessage.toLowerCase().includes('prompt engineering')) {
                botResponse = "MM specializes in advanced prompt engineering techniques to get the best out of AI models.";
            } else if (userMessage.toLowerCase().includes('projects')) {
                botResponse = "You can find MM's projects listed in the 'My Projects' section above!";
            } else if (userMessage.toLowerCase().includes('contact')) {
                botResponse = "You can find MM's contact details in the 'Get in Touch' section, including email and social media links.";
            }
            appendMessage(botResponse, 'bot');
        }, 800);
    };

    chatbotSendBtn.addEventListener('click', handleChatInput);
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleChatInput();
        }
    });

    // --- Make Chatbot Draggable (Optional, Basic) ---
    let isDragging = false;
    let offsetX, offsetY;

    chatbotPopup.addEventListener('mousedown', (e) => {
        if (e.target.closest('.chatbot-header')) { // Only drag from header
            isDragging = true;
            offsetX = e.clientX - chatbotPopup.getBoundingClientRect().left;
            offsetY = e.clientY - chatbotPopup.getBoundingClientRect().top;
            chatbotPopup.style.cursor = 'grabbing';
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        chatbotPopup.style.left = `${e.clientX - offsetX}px`;
        chatbotPopup.style.top = `${e.clientY - offsetY}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        chatbotPopup.style.cursor = 'grab';
    });
});
