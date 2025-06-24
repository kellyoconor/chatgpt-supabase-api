document.addEventListener('DOMContentLoaded', function() {
    const topicInput = document.getElementById('topic');
    const categorySelect = document.getElementById('category');
    const prioritySelect = document.getElementById('priority');
    const saveBtn = document.getElementById('saveBtn');
    const statusDiv = document.getElementById('status');
  
    // Check if we're on ChatGPT and try to get topic
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const currentUrl = tabs[0].url;
      
      if (!currentUrl.includes('chatgpt.com') && !currentUrl.includes('chat.openai.com')) {
        showStatus('⚠️ Please use this extension on ChatGPT pages', 'error');
        saveBtn.disabled = true;
        return;
      }
  
      // Try to inject content script if not already injected
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['content.js']
      }, () => {
        // Now try to get suggested topic
        setTimeout(() => {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'suggestTopic' }, function(response) {
            if (chrome.runtime.lastError) {
              console.log('Could not get topic suggestion:', chrome.runtime.lastError);
              topicInput.value = 'ChatGPT Conversation';
            } else if (response && response.topic) {
              topicInput.value = response.topic;
            }
          });
        }, 100);
      });
    });
  
    saveBtn.addEventListener('click', function() {
      const topic = topicInput.value.trim();
      const category = categorySelect.value;
      const priority = prioritySelect.value;
  
      if (!topic) {
        showStatus('Please enter a topic', 'error');
        return;
      }
  
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';
      showStatus('Extracting conversation...', 'info');
  
      // Get the conversation from the current tab
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'extractConversation' }, function(response) {
          if (chrome.runtime.lastError) {
            showStatus('❌ Could not connect to page. Try refreshing ChatGPT and the extension.', 'error');
            resetButton();
            return;
          }
  
          if (response && response.conversation) {
            saveConversation(topic, response.conversation, category, priority);
          } else {
            showStatus('❌ Could not extract conversation. Make sure there are messages on the page.', 'error');
            resetButton();
          }
        });
      });
    });
  
    function saveConversation(topic, content, category, priority) {
      const data = {
        topic: topic,
        content: content,
        category: category,
        priority: priority
      };
  
      fetch('https://chatgpt-supabase-api.onrender.com/save-conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          showStatus('✅ Conversation saved successfully!', 'success');
          setTimeout(() => {
            window.close();
          }, 2000);
        } else {
          showStatus('❌ Error saving conversation: ' + data.error, 'error');
          resetButton();
        }
      })
      .catch(error => {
        showStatus('❌ Network error: ' + error.message, 'error');
        resetButton();
      });
    }
  
    function showStatus(message, type) {
      statusDiv.textContent = message;
      statusDiv.className = 'status ' + type;
    }
  
    function resetButton() {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Conversation';
    }
  });