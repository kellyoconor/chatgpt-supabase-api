// Function to extract conversation from ChatGPT page
function extractConversation() {
    let conversation = '';
    
    // Try multiple selectors for ChatGPT messages
    const possibleSelectors = [
      '[data-message-author-role]',
      '.group\\/conversation-turn',
      '[class*="group"][class*="conversation"]',
      '.flex.flex-col.items-start',
      '.group.w-full',
      '.text-base'
    ];
    
    let messages = [];
    
    // Try each selector until we find messages
    for (const selector of possibleSelectors) {
      messages = document.querySelectorAll(selector);
      if (messages.length > 0) {
        console.log(`Found ${messages.length} messages with selector: ${selector}`);
        break;
      }
    }
    
    // If still no messages, try a more generic approach
    if (messages.length === 0) {
      // Look for the main conversation container and get all text content
      const mainContent = document.querySelector('main') || document.querySelector('.conversation-turn') || document.body;
      const allText = mainContent.innerText;
      
      if (allText && allText.length > 100) {
        return allText.trim();
      }
      
      return null;
    }
    
    // Process found messages
    messages.forEach((message, index) => {
      const role = message.getAttribute('data-message-author-role') || 
                   (index % 2 === 0 ? 'User' : 'Assistant');
      
      const textContent = message.innerText || message.textContent;
      
      if (textContent && textContent.trim()) {
        const cleanText = textContent.trim();
        // Skip very short messages (likely UI elements)
        if (cleanText.length > 10) {
          conversation += `${role}: ${cleanText}\n\n`;
        }
      }
    });
    
    return conversation.trim() || null;
  }
  
  // Better auto-suggest topic based on conversation content
  function suggestTopic() {
    // Look for user input or first message
    const inputSelectors = [
      'textarea[placeholder*="Message"]',
      'input[placeholder*="Message"]',
      '[data-message-author-role="user"]',
      '.user-message'
    ];
    
    let firstUserText = '';
    
    for (const selector of inputSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        firstUserText = element.value || element.innerText || element.textContent;
        if (firstUserText && firstUserText.trim()) {
          break;
        }
      }
    }
    
    // If no specific user text, try to get any text from the page
    if (!firstUserText) {
      const allMessages = document.querySelectorAll('[class*="message"], .text-base, .group');
      for (const message of allMessages) {
        const text = message.innerText || message.textContent;
        if (text && text.length > 20 && text.length < 200) {
          firstUserText = text;
          break;
        }
      }
    }
    
    if (firstUserText) {
      let text = firstUserText.trim();
      
      // Clean up the text
      text = text.replace(/^(User:|You:|Assistant:)/i, '').trim();
      
      // Get first sentence or first 8 words, whichever is shorter
      const firstSentence = text.split(/[.!?]/)[0];
      const firstWords = text.split(' ').slice(0, 8).join(' ');
      
      let topic = firstSentence.length < firstWords.length ? firstSentence : firstWords;
      
      // Truncate if too long
      if (topic.length > 60) {
        topic = topic.substring(0, 57) + '...';
      }
      
      return topic;
    }
    
    // Fallback: try to get page title
    const title = document.title;
    if (title && title !== 'ChatGPT') {
      return title.replace('ChatGPT', '').replace(' - ', '').trim().substring(0, 60);
    }
    
    return 'ChatGPT Conversation';
  }
  
  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractConversation') {
      console.log('Extracting conversation...');
      const conversation = extractConversation();
      console.log('Extracted conversation:', conversation ? conversation.substring(0, 100) + '...' : 'null');
      sendResponse({ conversation: conversation });
    }
    
    if (request.action === 'suggestTopic') {
      console.log('Suggesting topic...');
      const topic = suggestTopic();
      console.log('Suggested topic:', topic);
      sendResponse({ topic: topic });
    }
  });