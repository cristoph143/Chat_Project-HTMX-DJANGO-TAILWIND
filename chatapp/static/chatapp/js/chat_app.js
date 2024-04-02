// chat_app.js

// Clear the input field after a message is sent
function clearInput() {
    const inputField = document.querySelector('input[name="message"]');
    if (inputField) {
        inputField.value = '';  // Clear the message input field
    }
}

// Scroll to the bottom of the chat box
function scrollToBottom() {
    const chatBox = document.getElementById('messages');
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Initialize event listeners
document.addEventListener("DOMContentLoaded", function() {
    // Initially scroll to the bottom of the chat
    scrollToBottom();

    // Initialize infinite scroll
    initializeInfiniteScroll();
});

// Event listener for after a request is made
document.body.addEventListener('htmx:afterRequest', function(evt) {
    // If messages are being loaded or a message has been sent, scroll to bottom
    if (evt.detail.xhr.responseURL.includes("/chat/load-more-messages") ||
        evt.detail.xhr.responseURL.includes("/chat/send-message/")) {
        
        scrollToBottom();  // Ensure we are at the bottom of the chat
        
        // If we loaded more messages, hide the loading indicator
        if (evt.detail.xhr.responseURL.includes("/chat/load-more-messages")) {
            document.querySelector('.loading-indicator').classList.add('hidden');
            // If all messages are loaded, mark the chat as complete
            if (evt.detail.xhr.getResponseHeader('X-Is-All-Loaded') === 'true') {
                document.getElementById('messages').classList.add('all-loaded');
            }
        }
        
        // If a message has been sent, clear the input
        if (evt.detail.xhr.responseURL.includes("/chat/send-message/")) {
            clearInput();
        }
    }
});

// Infinite scroll functionality
function initializeInfiniteScroll() {
    const chatBox = document.getElementById('messages');
    const loadMoreTrigger = document.getElementById('load-more-messages');

    chatBox.addEventListener('scroll', function() {
        // Check if we've scrolled to the top and if there are more messages to load
        if (chatBox.scrollTop === 0 && !chatBox.classList.contains('all-loaded')) {
            htmx.trigger(loadMoreTrigger, 'loadMore');  // Trigger HTMX to load more messages
        }
    });

    // Function to load more messages if the chat window is not full
    function loadMoreIfNeeded() {
        if (chatBox.scrollHeight <= chatBox.clientHeight && !chatBox.classList.contains('all-loaded')) {
            htmx.trigger(loadMoreTrigger, 'loadMore');
        }
    }

    // Call this function after each HTMX request that loads new messages
    document.body.addEventListener('htmx:afterOnLoad', function(evt) {
        if (evt.detail.xhr.responseURL.includes("/chat/load-more-messages")) {
            loadMoreIfNeeded();
        }
    });
}
