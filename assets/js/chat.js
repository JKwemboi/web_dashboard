/* 
Name                 : VidManage – Bootstrap CRM & Project Management Admin Template
Author               : TemplateRise
Url                  : https://www.templaterise.com/template/VidManage-bootstrap-crm-project-management-admin-template
*/


// Global variables
const welcomeScreen = document.getElementById('welcomeScreen');
const chatInterface = document.getElementById('chatInterface');
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtnChat = document.getElementById('sendBtn');
const typingIndicator = document.getElementById('typingIndicator');
const chatName = document.getElementById('chatName');
const chatStatus = document.getElementById('chatStatus');
const chatAvatar = document.getElementById('chatAvatar');
const sidebar = document.getElementById('sidebar');
const mainChat = document.getElementById('mainChat');
const backBtn = document.getElementById('backBtn');
const fileInput = document.getElementById('fileInput');

// Chat search elements
const chatSearchContainer = document.getElementById('chatSearchContainer');
const chatSearchInput = document.getElementById('chatSearchInput');
const searchCount = document.getElementById('searchCount');
const prevSearchBtn = document.getElementById('prevSearchBtn');
const nextSearchBtn = document.getElementById('nextSearchBtn');
const searchToggleBtn = document.getElementById('searchToggleBtn');
const closeSearchBtn = document.getElementById('closeSearchBtn');

// Context menu and reply elements
const contextMenu = document.getElementById('contextMenu');
const replyBar = document.getElementById('replyBar');
const replyBarClose = document.getElementById('replyBarClose');
const replyToName = document.getElementById('replyToName');
const replyBarContent = document.getElementById('replyBarContent');

// Chat menu elements
const chatMenuBtn = document.getElementById('chatMenuBtn');
const chatDropdownMenu = document.getElementById('chatDropdownMenu');
const clearChatBtn = document.getElementById('clearChatBtn');
const closeChatBtn = document.getElementById('closeChatBtn');


// Global state
let searchResults = [];
let currentSearchIndex = -1;
let isSearchActive = false;
let currentTheme = 'dark';
let messageIdCounter = 6;
let currentReplyingTo = null;
let selectedMessage = null;
let currentChatInfo = null;

// Mobile detection
function isMobileDevice() {
    return window.innerWidth <= 768 || 
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'chat-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Modal functions
function showModal(modalElement) {
    modalElement.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hideModal(modalElement) {
    modalElement.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Chat menu functions
function toggleChatMenu() {
    const isVisible = chatDropdownMenu.classList.contains('show');
    
    if (isVisible) {
        chatDropdownMenu.classList.remove('show');
    } else {
        const rect = chatDropdownMenu.getBoundingClientRect();
        chatDropdownMenu.style.right = '20px';
        chatDropdownMenu.style.top = (rect.bottom + 50) + 'px';

        chatDropdownMenu.classList.add('show');
    }
}

function clearChat() {
    confirmClearChat();
}

function confirmClearChat() {
    const messages = chatMessages.querySelectorAll('.message');
    messages.forEach((message, index) => {
        setTimeout(() => {
            message.style.animation = 'messageSlide 0.3s ease-out reverse';
            setTimeout(() => {
                message.remove();
            }, 300);
        }, index * 50);
    });

    const currentChatName = chatName.textContent;
    if (currentChatData.messages[currentChatName]) {
        currentChatData.messages[currentChatName] = [];
    }

    setTimeout(() => {
        if (chatMessages.querySelectorAll('.message').length === 0) {
            showEmptyChatState();
        }
    }, messages.length * 50 + 500);
    showNotification('Chat cleared successfully');
}

function showEmptyChatState() {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-chat';
    emptyState.innerHTML = `
        <i class="fas fa-comments"></i>
        <div class="empty-chat-title">No messages yet</div>
        <div class="empty-chat-subtitle">Start a conversation by sending a message below</div>
    `;
    chatMessages.insertBefore(emptyState, typingIndicator);
}

function closeChat() {
    confirmCloseChat();
}

function confirmCloseChat() {
    closeChatSearch();
    closeReplyBar();
    
    chatInterface.style.display = 'none';
    welcomeScreen.style.display = 'flex';
    
    document.querySelectorAll('.chat-item').forEach(item => {
        item.classList.remove('active');
    });

    if (isMobileDevice()) {
        sidebar.classList.remove('hide');
        mainChat.classList.remove('show');
    }
    showNotification('Chat closed');
}

// Current chat data with message IDs and profile info
let currentChatData = {
    messages: {
        'John Doe': [
            { id: 1, type: 'received', content: 'Hey! How are you doing today? 😊', time: '2:30 PM' },
            { id: 2, type: 'sent', content: "I'm doing great! Just working on some new projects. How about you?", time: '2:32 PM' },
            { id: 3, type: 'received', content: "That sounds awesome! I'd love to hear more about your projects sometime. 🚀", time: '2:33 PM' },
            { id: 4, type: 'sent', content: "Let's catch up over coffee this weekend? ☕", time: '2:35 PM' },
            { id: 5, type: 'received', content: 'Perfect! Saturday works for me. Looking forward to it! 🎉', time: '2:36 PM' }
        ],
        'Sarah Wilson': [
            { id: 6, type: 'received', content: 'Thanks for the help earlier!', time: '1:45 PM' },
            { id: 7, type: 'sent', content: 'No problem at all! Happy to help anytime.', time: '1:46 PM' },
            { id: 8, type: 'received', content: 'You are the best! 🙌', time: '1:47 PM' }
        ],
        'Team Group': [
            { id: 9, type: 'received', content: 'Mike: Let\'s schedule the meeting', time: '12:30 PM' },
            { id: 10, type: 'received', content: 'Alice: What time works for everyone?', time: '12:31 PM' },
            { id: 11, type: 'sent', content: 'I\'m free after 2 PM today', time: '12:32 PM' }
        ],
        'Alex Johnson': [
            { id: 12, type: 'sent', content: 'See you tomorrow at the conference!', time: 'Yesterday' },
            { id: 13, type: 'received', content: 'Perfect! See you tomorrow 👍', time: 'Yesterday' }
        ],
        'Emma Davis': [
            { id: 14, type: 'received', content: 'Can you send me the documents?', time: '2 days ago' },
            { id: 15, type: 'sent', content: 'Sure, I\'ll email them to you shortly.', time: '2 days ago' }
        ],
        'Family Group': [
            { id: 16, type: 'received', content: 'Mom: Don\'t forget dinner on Sunday!', time: '3 days ago' },
            { id: 17, type: 'sent', content: 'Of course! Looking forward to it 🍽️', time: '3 days ago' }
        ],
        'Mike Chen': [
            { id: 18, type: 'received', content: 'Great work on the presentation!', time: '10:15 AM' },
            { id: 19, type: 'sent', content: 'Thank you! Glad it went well.', time: '10:16 AM' }
        ],
        'Lisa Park': [
            { id: 20, type: 'received', content: 'Let\'s catch up soon! 🎨', time: '9:45 AM' },
            { id: 21, type: 'sent', content: 'Absolutely! How about this weekend?', time: '9:46 AM' }
        ]
    },
    profiles: {
        'John Doe': {
            type: 'contact',
            name: 'John Doe',
            avatar: 'JD',
            avatarGradient: 'linear-gradient(45deg, #ff6b6b, #feca57)',
            status: 'Online',
            isOnline: true,
            about: 'Entrepreneur | Coffee lover ☕ | Tech enthusiast',
            phone: '+1 (555) 123-4567'
        },
        'Sarah Wilson': {
            type: 'contact',
            name: 'Sarah Wilson',
            avatar: 'SW',
            avatarGradient: 'linear-gradient(45deg, #e74c3c, #f39c12)',
            status: 'Last seen today at 1:45 PM',
            isOnline: false,
            about: 'Designer by day, artist by night 🎨',
            phone: '+1 (555) 987-6543'
        },
        'Team Group': {
            type: 'group',
            name: 'Team Group',
            avatar: 'TG',
            avatarGradient: 'linear-gradient(45deg, #9b59b6, #3498db)',
            status: '5 members',
            memberCount: 5,
            description: 'Our awesome development team workspace. Let\'s build amazing things together! 🚀',
            members: [
                { 
                    name: 'John Doe', 
                    initials: 'JD', 
                    gradient: 'linear-gradient(45deg, #ff6b6b, #feca57)', 
                    status: 'Online', 
                    isAdmin: true 
                },
                { 
                    name: 'Sarah Wilson', 
                    initials: 'SW', 
                    gradient: 'linear-gradient(45deg, #e74c3c, #f39c12)', 
                    status: 'Last seen 2 hours ago', 
                    isAdmin: false 
                },
                { 
                    name: 'Mike Chen', 
                    initials: 'MC', 
                    gradient: 'linear-gradient(45deg, #2ecc71, #27ae60)', 
                    status: 'Online', 
                    isAdmin: false 
                },
                { 
                    name: 'Alice Johnson', 
                    initials: 'AJ', 
                    gradient: 'linear-gradient(45deg, #1abc9c, #16a085)', 
                    status: 'Last seen yesterday', 
                    isAdmin: false 
                },
                { 
                    name: 'You', 
                    initials: 'ME', 
                    gradient: 'linear-gradient(45deg, #25d366, #128c7e)', 
                    status: 'Online', 
                    isAdmin: true 
                }
            ]
        },
        'Alex Johnson': {
            type: 'contact',
            name: 'Alex Johnson',
            avatar: 'AJ',
            avatarGradient: 'linear-gradient(45deg, #1abc9c, #16a085)',
            status: 'Last seen yesterday at 11:20 PM',
            isOnline: false,
            about: 'Travel blogger | Nature lover 🌲',
            phone: '+1 (555) 456-7890'
        },
        'Emma Davis': {
            type: 'contact',
            name: 'Emma Davis',
            avatar: 'ED',
            avatarGradient: 'linear-gradient(45deg, #f1c40f, #f39c12)',
            status: 'Last seen 2 days ago',
            isOnline: false,
            about: 'Marketing specialist | Yoga enthusiast 🧘‍♀️',
            phone: '+1 (555) 234-5678'
        },
        'Family Group': {
            type: 'group',
            name: 'Family Group',
            avatar: 'FG',
            avatarGradient: 'linear-gradient(45deg, #e67e22, #d35400)',
            status: '8 members',
            memberCount: 8,
            description: 'Our loving family group ❤️ Stay connected and share precious moments!',
            members: [
                { 
                    name: 'Mom', 
                    initials: 'M', 
                    gradient: 'linear-gradient(45deg, #e74c3c, #c0392b)', 
                    status: 'Online', 
                    isAdmin: true 
                },
                { 
                    name: 'Dad', 
                    initials: 'D', 
                    gradient: 'linear-gradient(45deg, #3498db, #2980b9)', 
                    status: 'Last seen 1 hour ago', 
                    isAdmin: true 
                },
                { 
                    name: 'Sister', 
                    initials: 'S', 
                    gradient: 'linear-gradient(45deg, #9b59b6, #8e44ad)', 
                    status: 'Online', 
                    isAdmin: false 
                },
                { 
                    name: 'Brother', 
                    initials: 'B', 
                    gradient: 'linear-gradient(45deg, #f39c12, #e67e22)', 
                    status: 'Last seen 30 minutes ago', 
                    isAdmin: false 
                },
                { 
                    name: 'You', 
                    initials: 'ME', 
                    gradient: 'linear-gradient(45deg, #25d366, #128c7e)', 
                    status: 'Online', 
                    isAdmin: false 
                }
            ]
        },
        'Mike Chen': {
            type: 'contact',
            name: 'Mike Chen',
            avatar: 'MC',
            avatarGradient: 'linear-gradient(45deg, #2ecc71, #27ae60)',
            status: 'Last seen 5 hours ago',
            isOnline: false,
            about: 'Software developer | Gamer 🎮',
            phone: '+1 (555) 345-6789'
        },
        'Lisa Park': {
            type: 'contact',
            name: 'Lisa Park',
            avatar: 'LP',
            avatarGradient: 'linear-gradient(45deg, #8e44ad, #9b59b6)',
            status: 'Online',
            isOnline: true,
            about: 'Graphic designer | Creative soul ✨',
            phone: '+1 (555) 567-8901'
        }
    }
};

// Initialize event listeners
function initializeEventListeners() {

    // Chat menu
    chatMenuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleChatMenu();
    });

    clearChatBtn.addEventListener('click', function(e) {
        e.preventDefault();
        clearChat();
        chatDropdownMenu.classList.remove('show');
    });

    closeChatBtn.addEventListener('click', function(e) {
        e.preventDefault();
        closeChat();
        chatDropdownMenu.classList.remove('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!chatMenuBtn.contains(e.target) && !chatDropdownMenu.contains(e.target)) {
            chatDropdownMenu.classList.remove('show');
        }
        if (!contextMenu.contains(e.target)) {
            contextMenu.style.display = 'none';
        }
    });

    // Chat item event listeners
    const chatItems = document.querySelectorAll('.chat-item');
    chatItems.forEach(item => {
        item.removeEventListener('click', handleChatClick);
        item.removeEventListener('touchstart', handleChatClick);
        
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            handleChatClick(this);
        });
        
        item.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            handleChatClick(this);
        }, { passive: false });
    });

    // Back button
    backBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        goBackToChats();
    });

    backBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        e.stopPropagation();
        goBackToChats();
    }, { passive: false });

    // Search toggle button
    searchToggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        toggleChatSearch();
    });

    // Close search button
    closeSearchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        closeChatSearch();
    });

    // Search navigation buttons
    prevSearchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        navigateSearch('prev');
    });

    nextSearchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        navigateSearch('next');
    });

    // Send button
    sendBtnChat.addEventListener('click', function(e) {
        e.preventDefault();
        sendMessage();
    });

    // Message input
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });

    // Chat search input
    chatSearchInput.addEventListener('input', (e) => {
        searchInChat(e.target.value);
    });

    chatSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (e.shiftKey) {
                navigateSearch('prev');
            } else {
                navigateSearch('next');
            }
        } else if (e.key === 'Escape') {
            closeChatSearch();
        }
    });

    // File input
    fileInput.addEventListener('change', handleFileSelect);

    // Reply bar close
    replyBarClose.addEventListener('click', closeReplyBar);

    // Context menu events
    document.getElementById('replyOption').addEventListener('click', handleReply);
    document.getElementById('copyOption').addEventListener('click', handleCopy);
    document.getElementById('deleteOption').addEventListener('click', handleDelete);

    // Message action buttons (arrow icons)
    chatMessages.addEventListener('click', handleMessageActionClick);

    // Sidebar search
    const searchInput = document.querySelector('.search-input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const chatItems = document.querySelectorAll('.chat-item');
        
        chatItems.forEach(item => {
            const chatName = item.querySelector('.chat-name').textContent.toLowerCase();
            const lastMessage = item.querySelector('.last-message').textContent.toLowerCase();
            
            if (chatName.includes(searchTerm) || lastMessage.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// Handle message action button click (arrow icon)
function handleMessageActionClick(e) {
    if (e.target.closest('.message-actions-btn')) {
        e.preventDefault();
        e.stopPropagation();
        
        const messageElement = e.target.closest('.message');
        if (messageElement && messageElement.dataset.messageId) {
            selectedMessage = messageElement;
            const rect = e.target.closest('.message-actions-btn').getBoundingClientRect();
            const isSentMessage = messageElement.classList.contains('sent');
            
            
            // Position context menu near the arrow button
            contextMenu.style.display = 'block';
            contextMenu.style.left = (rect.left - 75) + 'px';
            contextMenu.style.top = (rect.bottom + 5) + 'px';
            
            // Adjust position if menu goes off screen
            setTimeout(() => {
                const menuRect = contextMenu.getBoundingClientRect();
                if (menuRect.right > window.innerWidth) {
                    contextMenu.style.left = (window.innerWidth - menuRect.width - 10) + 'px';
                }
                if (menuRect.bottom > window.innerHeight) {
                    contextMenu.style.top = (rect.top - menuRect.height - 5) + 'px';
                }
            }, 10);
        }
    }
}

// Context menu handlers
function handleReply() {
    if (selectedMessage) {
        const messageContent = selectedMessage.querySelector('.message-content').textContent;
        const isReceived = selectedMessage.classList.contains('received');
        
        currentReplyingTo = {
            id: selectedMessage.dataset.messageId,
            content: messageContent,
            sender: isReceived ? chatName.textContent : 'You'
        };
        
        showReplyBar();
        contextMenu.style.display = 'none';
        messageInput.focus();
    }
}


function handleCopy() {
    if (selectedMessage) {
        const messageContent = selectedMessage.querySelector('.message-content').textContent;
        navigator.clipboard.writeText(messageContent).then(() => {
            showNotification('Message copied to clipboard');
        });
    }
    contextMenu.style.display = 'none';
}

function handleDelete() {
    if (selectedMessage) {
        const messageId = selectedMessage.dataset.messageId;
        selectedMessage.style.animation = 'messageSlide 0.3s ease-out reverse';
        
        setTimeout(() => {
            selectedMessage.remove();
            removeMessageFromData(messageId);
            showNotification('Message deleted');
            
            // Check if chat is empty after deletion
            const remainingMessages = chatMessages.querySelectorAll('.message');
            if (remainingMessages.length === 0) {
                showEmptyChatState();
            }
        }, 300);
    }
    contextMenu.style.display = 'none';
}

// Reply bar functions
function showReplyBar() {
    replyToName.textContent = currentReplyingTo.sender;
    replyBarContent.textContent = currentReplyingTo.content;
    replyBar.classList.add('show');
}

function closeReplyBar() {
    replyBar.classList.remove('show');
    currentReplyingTo = null;
}

// File handling
function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    files.forEach(file => {
        sendFileMessage(file);
    });
    e.target.value = '';
}

function sendFileMessage(file) {
    const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const messageId = ++messageIdCounter;
    
    let fileContent = '';
    
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            fileContent = `
                <div class="image-message">
                    <img src="${e.target.result}" alt="${file.name}" />
                </div>
                <div>${file.name}</div>
            `;
            addMessageToChat(fileContent, true, currentTime, true, messageId);
            saveMessageToData(fileContent, true, currentTime, messageId);
        };
        reader.readAsDataURL(file);
    } else {
        const fileSize = formatFileSize(file.size);
        const fileIcon = getFileIcon(file.type);
        
        fileContent = `
            <div class="file-message">
                <div class="file-icon">
                    <i class="${fileIcon}"></i>
                </div>
                <div class="file-info">
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${fileSize}</div>
                </div>
            </div>
        `;
        addMessageToChat(fileContent, true, currentTime, true, messageId);
        saveMessageToData(fileContent, true, currentTime, messageId);
    }
    
    showNotification(`${file.name} sent`);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFileIcon(fileType) {
    if (fileType.startsWith('image/')) return 'fas fa-image';
    if (fileType.startsWith('video/')) return 'fas fa-video';
    if (fileType.startsWith('audio/')) return 'fas fa-music';
    if (fileType.includes('pdf')) return 'fas fa-file-pdf';
    if (fileType.includes('word')) return 'fas fa-file-word';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'fas fa-file-excel';
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return 'fas fa-file-powerpoint';
    if (fileType.includes('zip') || fileType.includes('rar')) return 'fas fa-file-archive';
    return 'fas fa-file';
}

// Data management functions
function updateMessageInData(messageId, newContent) {
    const currentChatName = chatName.textContent;
    const messages = currentChatData.messages[currentChatName];
    const message = messages.find(msg => msg.id == messageId);
    if (message) {
        message.content = newContent;
        message.edited = true;
    }
}

function removeMessageFromData(messageId) {
    const currentChatName = chatName.textContent;
    const messages = currentChatData.messages[currentChatName];
    const index = messages.findIndex(msg => msg.id == messageId);
    if (index > -1) {
        messages.splice(index, 1);
    }
}

function saveMessageToData(content, isSent, time, messageId, replyTo = null) {
    const currentChatName = chatName.textContent;
    if (!currentChatData.messages[currentChatName]) {
        currentChatData.messages[currentChatName] = [];
    }
    
    const messageData = {
        id: messageId,
        type: isSent ? 'sent' : 'received',
        content: content,
        time: time
    };
    
    if (replyTo) {
        messageData.replyTo = replyTo;
    }
    
    currentChatData.messages[currentChatName].push(messageData);
}

// Handle chat item click
function handleChatClick(element) {
    const name = element.getAttribute('data-name');
    const avatar = element.getAttribute('data-avatar');
    const status = element.getAttribute('data-status');
    const gradient = element.getAttribute('data-gradient');
    
    if (name && avatar && status) {
        openChat(name, avatar, status, gradient);
    }
}

// Open chat function
function openChat(name, avatar, status, gradient = '#ff6b6b, #feca57') {
    try {
        welcomeScreen.style.display = 'none';
        chatInterface.style.display = 'flex';
        
        chatName.textContent = name;
        chatStatus.textContent = status;
        chatAvatar.textContent = avatar;
        chatAvatar.style.background = `linear-gradient(45deg, ${gradient})`;
        
        // Set current chat info for profile
        currentChatInfo = currentChatData.profiles[name] || {
            type: 'contact',
            name: name,
            avatar: avatar,
            avatarGradient: `linear-gradient(45deg, ${gradient})`,
            status: status,
            isOnline: status === 'Online'
        };
        
        loadChatMessages(name);
        closeChatSearch();
        closeReplyBar();
        chatDropdownMenu.classList.remove('show');
        
        if (isMobileDevice()) {
            setTimeout(() => {
                sidebar.classList.add('hide');
                mainChat.classList.add('show');
            }, 50);
        }
        
        document.querySelectorAll('.chat-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const clickedItem = document.querySelector(`[data-name="${name}"]`);
        if (clickedItem) {
            clickedItem.classList.add('active');
        }
        
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 100);
        
    } catch (error) {
        console.error('Error opening chat:', error);
    }
}

// Load chat messages
function loadChatMessages(chatName) {
    const messages = chatMessages.querySelectorAll('.message, .empty-chat');
    messages.forEach(msg => msg.remove());
    
    const messages_data = currentChatData.messages[chatName] || [];
    
    if (messages_data.length > 0) {
        messages_data.forEach(msg => {
            addMessageToChat(msg.content, msg.type === 'sent', msg.time, false, msg.id, msg.replyTo);
        });
    } else {
        showEmptyChatState();
    }
}

// Go back to chats
function goBackToChats() {
    if (isMobileDevice()) {
        sidebar.classList.remove('hide');
        mainChat.classList.remove('show');
        
        setTimeout(() => {
            chatInterface.style.display = 'none';
            welcomeScreen.style.display = 'flex';
        }, 300);
        
        closeChatSearch();
        closeReplyBar();
        chatDropdownMenu.classList.remove('show');
        
        document.querySelectorAll('.chat-item').forEach(item => {
            item.classList.remove('active');
        });
    }
}

// Chat search functionality
function toggleChatSearch() {
    if (isSearchActive) {
        closeChatSearch();
    } else {
        openChatSearch();
    }
}

function openChatSearch() {
    chatSearchContainer.classList.add('show');
    chatSearchInput.focus();
    isSearchActive = true;
}

function closeChatSearch() {
    chatSearchContainer.classList.remove('show');
    chatSearchInput.value = '';
    clearSearchResults();
    isSearchActive = false;
}

function clearSearchResults() {
    searchResults = [];
    currentSearchIndex = -1;
    updateSearchCount();
    
    const messages = chatMessages.querySelectorAll('.message');
    messages.forEach(message => {
        message.classList.remove('highlighted');
        const content = message.querySelector('.message-content');
        if (content) {
            content.innerHTML = content.textContent;
        }
    });
}

function searchInChat(query) {
    if (!query.trim()) {
        clearSearchResults();
        return;
    }

    searchResults = [];
    const messages = chatMessages.querySelectorAll('.message');
    
    messages.forEach((message, index) => {
        const content = message.querySelector('.message-content');
        if (content) {
            const text = content.textContent.toLowerCase();
            const searchQuery = query.toLowerCase();
            
            if (text.includes(searchQuery)) {
                searchResults.push({
                    element: message,
                    index: index,
                    content: content
                });
            }
        }
    });

    if (searchResults.length > 0) {
        currentSearchIndex = 0;
        highlightSearchResults(query);
        scrollToSearchResult(0);
    } else {
        currentSearchIndex = -1;
        clearHighlights();
    }

    updateSearchCount();
}

function highlightSearchResults(query) {
    const searchQuery = query.toLowerCase();
    
    searchResults.forEach((result, index) => {
        const content = result.content;
        const text = content.textContent;
        const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
        const highlightedText = text.replace(regex, '<span class="highlight">$1</span>');
        content.innerHTML = highlightedText;
        
        if (index === currentSearchIndex) {
            result.element.classList.add('highlighted');
        } else {
            result.element.classList.remove('highlighted');
        }
    });
}

function clearHighlights() {
    const messages = chatMessages.querySelectorAll('.message');
    messages.forEach(message => {
        message.classList.remove('highlighted');
        const content = message.querySelector('.message-content');
        if (content) {
            content.innerHTML = content.textContent;
        }
    });
}

function navigateSearch(direction) {
    if (searchResults.length === 0) return;

    if (direction === 'next') {
        currentSearchIndex = (currentSearchIndex + 1) % searchResults.length;
    } else if (direction === 'prev') {
        currentSearchIndex = currentSearchIndex > 0 ? currentSearchIndex - 1 : searchResults.length - 1;
    }

    searchResults.forEach((result, index) => {
        if (index === currentSearchIndex) {
            result.element.classList.add('highlighted');
        } else {
            result.element.classList.remove('highlighted');
        }
    });

    scrollToSearchResult(currentSearchIndex);
    updateSearchCount();
}

function scrollToSearchResult(index) {
    if (searchResults[index]) {
        const element = searchResults[index].element;
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}

function updateSearchCount() {
    if (searchResults.length > 0) {
        searchCount.textContent = `${currentSearchIndex + 1} of ${searchResults.length}`;
        prevSearchBtn.disabled = false;
        nextSearchBtn.disabled = false;
    } else {
        searchCount.textContent = chatSearchInput.value.trim() ? '0 of 0' : '';
        prevSearchBtn.disabled = true;
        nextSearchBtn.disabled = true;
    }
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Add message function
function addMessage(text, isSent = true) {
    const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const messageId = ++messageIdCounter;
    
    // Remove empty state if present
    const emptyState = chatMessages.querySelector('.empty-chat');
    if (emptyState) {
        emptyState.remove();
    }
    
    addMessageToChat(text, isSent, currentTime, true, messageId, currentReplyingTo);
    saveMessageToData(text, isSent, currentTime, messageId, currentReplyingTo);

    if (currentReplyingTo) {
        closeReplyBar();
    }

    if (isSearchActive && chatSearchInput.value.trim()) {
        setTimeout(() => {
            searchInChat(chatSearchInput.value);
        }, 100);
    }
}

function addMessageToChat(text, isSent, time, animate = true, messageId = null, replyTo = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isSent ? 'sent' : 'received'}`;
    if (messageId) {
        messageDiv.setAttribute('data-message-id', messageId);
    }
    if (animate) {
        messageDiv.style.animation = 'messageSlide 0.3s ease-out';
    }
    
    const statusIcon = isSent ? '<i class="fas fa-check-double message-status"></i>' : '';
    
    let replyHtml = '';
    if (replyTo) {
        replyHtml = `
            <div class="reply-info">
                <div class="reply-to">${replyTo.sender}</div>
                <div class="reply-text">${replyTo.content}</div>
            </div>
        `;
    }
    
    // Add message actions (arrow icon)
    const actionsHtml = `
        <div class="message-actions">
            <div class="message-actions-btn">
                <i class="fas fa-chevron-down"></i>
            </div>
        </div>
    `;
    
    if (isSent) {
        messageDiv.innerHTML = `
           
            <div class="message-bubble">
                ${actionsHtml}
                ${replyHtml}
                <div class="message-content">${text}</div>
                <div class="message-time">
                    ${time}
                    ${statusIcon}
                </div>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-bubble">
                ${replyHtml}
                <div class="message-content">${text}</div>
                <div class="message-time">${time}</div>
                 ${actionsHtml}
            </div>
           
        `;
    }
    
    chatMessages.insertBefore(messageDiv, typingIndicator);
    if (animate) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function sendMessage() {
    const text = messageInput.value.trim();
    if (text) {
        addMessage(text, true);
        messageInput.value = '';
        
        typingIndicator.style.display = 'flex';
        
        setTimeout(() => {
            typingIndicator.style.display = 'none';
            const responses = [
                "That's interesting! Tell me more. 🤔",
                "I completely agree with you! 👍",
                "Thanks for sharing that with me. 😊",
                "That sounds like a great idea! 💡",
                "I'll definitely consider that. 🤝",
                "Awesome! Let's do it! 🚀",
                "Haha, that's funny! 😂",
                "Sure thing! No problem. ✅",
                "Interesting perspective! 🧠",
                "I love that idea! ❤️",
                "You're absolutely right! 💯",
                "That makes perfect sense. 🎯"
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessage(randomResponse, false);
        }, Math.random() * 2000 + 1000);
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        sidebar.classList.remove('hide');
        mainChat.classList.remove('show');
    } else {
        if (chatInterface.style.display === 'flex') {
            sidebar.classList.add('hide');
            mainChat.classList.add('show');
        } else {
            sidebar.classList.remove('hide');
            mainChat.classList.remove('show');
        }
    }
});

// Touch gestures for mobile
let touchStartX = 0;
let touchEndX = 0;

function handleGesture() {
    if (isMobileDevice() && chatInterface.style.display === 'flex') {
        if (touchEndX > touchStartX + 50) {
            goBackToChats();
        }
    }
}

chatMessages.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

chatMessages.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
}, { passive: true });

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
   
    initializeEventListeners();
    
    setTimeout(() => {
        if (chatMessages.children.length > 0) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }, 100);

    if (isMobileDevice()) {
        chatInterface.style.display = 'none';
        welcomeScreen.style.display = 'flex';
        sidebar.classList.remove('hide');
        mainChat.classList.remove('show');
    }
});

// Initialize on window load as backup
window.addEventListener('load', () => {
    if (isMobileDevice()) {
        chatInterface.style.display = 'none';
        welcomeScreen.style.display = 'flex';
        sidebar.classList.remove('hide');
        mainChat.classList.remove('show');
    }
});
