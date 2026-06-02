const windowData = {
  about: { 
    title: 'About Me', 
    icon: '👤',
    content: 'Hi! I\'m Niel Cericos!, I\'m a student passionate about Games, Coding, And Music. This portfolio is a creative way to introduce myself to my classmates and show them who I am.'
  },
  story: { 
    title: 'My Story', 
    icon: '📖',
    content: 'Growing up, I\'ve always wanted to make my own website. to just make something that expresses who I really am and what I\'m capable of I am hoping to be friends with my Classmates this school year 2026-2027.'
  },
  personality: { 
    title: 'Personality', 
    icon: '✨',
    content: 'I love thinking about the whats and the what ifs. If I wasnt Niel I would be Socrates with the amount of questions that I ask everyday, I am naturally curious and I love getting to know the truths of things'
  },
  gallery: { 
    title: 'Photo Gallery', 
    icon: '🖼️',
    content: 'This is where I can share photos of myself, my projects, or things I find inspiring. You can add images by uploading them below.'
  },
  interests: { 
    title: 'My Interests', 
    icon: '🎯',
    content: 'I\'m interested in alot of things mostly Games, Socializing, Anime and Manga but the thing I\'m most passionate about is Writing, it gives me the freedom that I need to express what my heart wants to say and it feels peaceful'
  },
  skills: { 
    title: 'Skills', 
    icon: '⚡',
    content: 'I\'m skilled in Creativity and Communication and studying to do more!'
  },
  projects: { 
    title: 'My Projects', 
    icon: '🚀',
    content: 'I\'ve worked on: This portfolio website, [Project 1], [Project 2]. I\'m proud of what I\'ve created and excited to share more.'
  },
  music: { 
    title: 'Music & Vibes', 
    icon: '🎵',
    content: 'I listen to: [Your music genre]. Music I recommend: [Song 1], [Song 2], [Song 3]. What\'s your favorite song?'
  },
  contact: { 
    title: 'Contact Me', 
    icon: '💌',
    content: 'Email: lokigt52@gmail.com\nInstagram: @s3nika4\nDiscord: maximus0294\nFeel free to reach out anytime!'
  },
  journal: { 
    title: 'Personal Journal', 
    icon: '📓',
    content: '(Private - Password Protected)\nThis is my personal space for thoughts and reflections.'
  },
  chat: {
    title: 'Chat Room',
    icon: '💬',
    content: null // Special handling for chat
  }
};

const desktop = document.querySelector('.desktop-shell');
const icons = Array.from(document.querySelectorAll('.desktop-icon'));
const taskbar = document.getElementById('taskbarIndicators');
const windowContainer = document.querySelector('.window-container');
const template = document.getElementById('windowTemplate');
const taskbarButtons = new Map();
let activeWindow = null;
let positionStore = localStorage.getItem('windowPositions') ? JSON.parse(localStorage.getItem('windowPositions')) : {};
let contentStore = localStorage.getItem('windowContent') ? JSON.parse(localStorage.getItem('windowContent')) : {};
let zCounter = 10;

function savePositions() {
  localStorage.setItem('windowPositions', JSON.stringify(positionStore));
}

function saveContent() {
  localStorage.setItem('windowContent', JSON.stringify(contentStore));
}

function createWindow(id) {
  if (document.querySelector(`.window[data-window="${id}"]`)) {
    return document.querySelector(`.window[data-window="${id}"]`);
  }

  const data = windowData[id];
  const clone = template.content.firstElementChild.cloneNode(true);
  clone.dataset.window = id;
  clone.style.top = '4rem';
  clone.style.left = '8rem';
  clone.style.opacity = '0';
  clone.querySelector('.window-title').textContent = data.title;

  const contentDiv = clone.querySelector('.window-content');
  
  // Special handling for chatroom
  if (id === 'chat') {
    contentDiv.innerHTML = `
      <div style="display: flex; flex-direction: column; height: 100%; gap: 0.75rem;">
        <div style="flex: 1; overflow-y: auto; border: 1px solid rgba(0,0,0,0.08); border-radius: 8px; background: rgba(250,248,244,0.8); padding: 0.75rem;" id="chat-messages"></div>
        <input type="text" id="chat-name" placeholder="Your name..." style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1); border-radius: 8px; font-size: 0.9rem;">
        <textarea id="chat-input" placeholder="Type your message..." style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1); border-radius: 8px; font-size: 0.9rem; resize: none; height: 70px;"></textarea>
        <button id="chat-send" style="padding: 0.6rem; background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Send Message</button>
      </div>
    `;
    
    const messagesDiv = contentDiv.querySelector('#chat-messages');
    const nameInput = contentDiv.querySelector('#chat-name');
    const chatInput = contentDiv.querySelector('#chat-input');
    const sendBtn = contentDiv.querySelector('#chat-send');
    
    let messages = JSON.parse(localStorage.getItem('chat-messages') || '[]');
    
    function displayMessages() {
      messagesDiv.innerHTML = messages.map(msg => `
        <div style="margin-bottom: 0.75rem; padding: 0.5rem; background: rgba(168, 85, 247, 0.1); border-radius: 6px;">
          <strong style="color: #7e22ce;">${msg.name}</strong>
          <p style="margin: 0.25rem 0 0 0; color: #4a4239;">${msg.text}</p>
          <small style="color: #999;">${new Date(msg.time).toLocaleTimeString()}</small>
        </div>
      `).join('');
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
    
    function sendMessage() {
      const name = nameInput.value.trim() || 'Anonymous';
      const text = chatInput.value.trim();
      if (text) {
        messages.push({ name, text, time: new Date().toISOString() });
        localStorage.setItem('chat-messages', JSON.stringify(messages));
        chatInput.value = '';
        displayMessages();
      }
    }
    
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
    
    displayMessages();
  } else {
    // Regular windows with permanent content
    contentDiv.innerHTML = `
      <div style="margin-bottom: 1.5rem; padding: 0.75rem; background: rgba(168, 85, 247, 0.08); border-radius: 8px; border-left: 3px solid #a855f7;">
        <p style="margin: 0; color: #3e3024; line-height: 1.6;">${data.content}</p>
      </div>
      <div style="margin-top: 1.5rem;">
        <h3 style="color: #7e22ce; margin-top: 0; margin-bottom: 0.75rem;">Your Personal Notes:</h3>
        <div class="editable-content" contenteditable="true" data-placeholder="Add your own notes here..."></div>
        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(0,0,0,0.08);">
          <label style="display: block; margin-bottom: 0.5rem; color: #5f5b56; font-size: 0.9rem;">Add Photos:</label>
          <input type="file" class="image-upload" accept="image/*" style="display: block; margin-bottom: 0.5rem; padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1); border-radius: 8px; background: rgba(245,241,236,0.8);">
          <div class="image-preview"></div>
        </div>
      </div>
    `;

    const editableContent = contentDiv.querySelector('.editable-content');
    const imageUpload = contentDiv.querySelector('.image-upload');
    const imagePreview = contentDiv.querySelector('.image-preview');

    editableContent.style.cssText = 'min-height: 100px; padding: 0.75rem; border: 1px solid rgba(0,0,0,0.08); border-radius: 8px; background: rgba(250,248,244,0.8); outline: none; line-height: 1.6;';

    // Restore saved personal notes
    if (contentStore[id]) {
      editableContent.innerHTML = contentStore[id].text || '';
      if (contentStore[id].image) {
        imagePreview.innerHTML = `<img src="${contentStore[id].image}" style="max-width: 100%; height: auto; border-radius: 12px; margin-top: 0.75rem;">`;
      }
    }

    editableContent.addEventListener('input', () => {
      if (!contentStore[id]) contentStore[id] = {};
      contentStore[id].text = editableContent.innerHTML;
      saveContent();
    });

    imageUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imgSrc = event.target.result;
          imagePreview.innerHTML = `<img src="${imgSrc}" style="max-width: 100%; height: auto; border-radius: 12px; margin-top: 0.75rem;">`;
          if (!contentStore[id]) contentStore[id] = {};
          contentStore[id].image = imgSrc;
          saveContent();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  const closeButton = clone.querySelector('.window-close');
  const minimizeButton = clone.querySelector('.window-minimize');
  const header = clone.querySelector('.window-header');

  closeButton.addEventListener('click', () => closeWindow(id));
  minimizeButton.addEventListener('click', () => minimizeWindow(id));
  clone.addEventListener('mousedown', () => bringToFront(clone));
  header.addEventListener('mousedown', (event) => startDrag(event, clone));
  header.addEventListener('touchstart', (event) => startDrag(event, clone, true), { passive: false });

  windowContainer.appendChild(clone);
  requestAnimationFrame(() => {
    clone.style.opacity = '1';
  });

  if (positionStore[id]) {
    clone.style.transform = `translate(${positionStore[id].x}px, ${positionStore[id].y}px)`;
  }

  updateTaskbar(id, data.title);
  setTimeout(() => bringToFront(clone), 10);
  return clone;
}

function openWindow(id) {
  // Journal password protection
  if (id === 'journal') {
    const journalPassword = 'secret'; // Change this to your desired password
    const isAuthenticated = sessionStorage.getItem('journal-authenticated') === 'true';
    
    if (!isAuthenticated) {
      const password = prompt('This journal is private. Enter password:');
      if (password !== journalPassword) {
        alert('Incorrect password');
        return;
      }
      sessionStorage.setItem('journal-authenticated', 'true');
    }
  }
  
  const win = createWindow(id);
  win.classList.remove('minimized');
  win.style.display = 'block';
  bringToFront(win);
  setTaskbarActive(id, true);
}

function closeWindow(id) {
  const win = document.querySelector(`.window[data-window="${id}"]`);
  if (!win) return;
  win.remove();
  removeTaskbar(id);
}

function minimizeWindow(id) {
  const win = document.querySelector(`.window[data-window="${id}"]`);
  if (!win) return;
  win.style.display = 'none';
  setTaskbarActive(id, false);
}

function bringToFront(win) {
  if (activeWindow) {
    activeWindow.classList.remove('active');
  }
  activeWindow = win;
  win.classList.add('active');
  zCounter += 1;
  win.style.zIndex = zCounter;
}

function updateTaskbar(id, title) {
  if (taskbarButtons.has(id)) return;
  const btn = document.createElement('button');
  btn.className = 'taskbar-button';
  btn.type = 'button';
  btn.textContent = title;
  btn.addEventListener('click', () => {
    const win = document.querySelector(`.window[data-window="${id}"]`);
    if (win?.style.display === 'none') {
      openWindow(id);
    } else if (win) {
      bringToFront(win);
    }
  });
  taskbar.appendChild(btn);
  taskbarButtons.set(id, btn);
}

function removeTaskbar(id) {
  const btn = taskbarButtons.get(id);
  if (btn) {
    btn.remove();
    taskbarButtons.delete(id);
  }
}

function setTaskbarActive(id, active) {
  const btn = taskbarButtons.get(id);
  if (btn) {
    btn.style.background = active ? 'rgba(206, 139, 90, 0.13)' : 'rgba(255,255,255,0.88)';
  }
}

const dragState = {
  active: false,
  window: null,
  startX: 0,
  startY: 0,
  origX: 0,
  origY: 0,
};

function startDrag(event, win, touch = false) {
  event.preventDefault();
  const point = touch ? event.touches[0] : event;
  dragState.active = true;
  dragState.window = win;
  dragState.startX = point.clientX;
  dragState.startY = point.clientY;
  const transform = window.getComputedStyle(win).transform;
  if (transform && transform !== 'none') {
    const match = transform.match(/matrix\(([^)]+)\)/);
    if (match) {
      const values = match[1].split(', ').map(Number);
      dragState.origX = values[4];
      dragState.origY = values[5];
    }
  } else {
    dragState.origX = 0;
    dragState.origY = 0;
  }
  document.addEventListener(touch ? 'touchmove' : 'mousemove', dragMove);
  document.addEventListener(touch ? 'touchend' : 'mouseup', endDrag);
}

function dragMove(event) {
  if (!dragState.active) return;
  const point = event.touches ? event.touches[0] : event;
  const dx = point.clientX - dragState.startX;
  const dy = point.clientY - dragState.startY;
  const nextX = dragState.origX + dx;
  const nextY = dragState.origY + dy;
  dragState.window.style.transform = `translate(${nextX}px, ${nextY}px)`;
  positionStore[dragState.window.dataset.window] = { x: nextX, y: nextY };
}

function endDrag() {
  if (!dragState.active) return;
  document.removeEventListener('mousemove', dragMove);
  document.removeEventListener('mouseup', endDrag);
  document.removeEventListener('touchmove', dragMove);
  document.removeEventListener('touchend', endDrag);
  dragState.active = false;
  savePositions();
}

icons.forEach((icon) => {
  icon.addEventListener('click', () => {
    const id = icon.dataset.window;
    openWindow(id);
  });
});

// Update clock
const clock = document.getElementById('desktopClock');
function updateClock() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  clock.textContent = `${hours}:${minutes}`;
}
updateClock();
setInterval(updateClock, 1000);
