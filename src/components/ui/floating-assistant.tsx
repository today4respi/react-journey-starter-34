import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { ChatButton } from '@/components/chat/ChatButton';

interface Message {
  text: string;
  isUser: boolean;
  imageUrl?: string;
  imageName?: string;
}

interface FloatingAssistantProps {
  onClose?: () => void;
}

export const FloatingAssistant: React.FC<FloatingAssistantProps> = ({
  onClose
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [agentsOnline, setAgentsOnline] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [userInfoCollected, setUserInfoCollected] = useState(false);
  const [isPollingMessages, setIsPollingMessages] = useState(false);
  const [tempSessionId, setTempSessionId] = useState<string>('');
  const [unreadCount, setUnreadCount] = useState(0);
  const isMobile = useIsMobile();
  const messagePollingRef = useRef<NodeJS.Timeout | null>(null);
  
  // Notification sound using Web Audio API
  const playNotificationSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Could not play notification sound:', error);
    }
  }, []);

  // Check agent status
  const checkAgentStatus = useCallback(async () => {
    try {
      const response = await fetch('https://draminesaid.com/lucci/api/agent_status.php', {
        method: 'GET',
        headers: { 
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.status) {
          const isOnline = data.status.is_online === '1' || data.status.is_online === 1 || data.status.is_online === true;
          setAgentsOnline(isOnline);
        }
      } else {
        setAgentsOnline(false);
      }
    } catch (error) {
      setAgentsOnline(false);
    }
  }, []);

  // Initial setup
  useEffect(() => {
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setTempSessionId(tempId);
    
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 4000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Check agent status periodically
  useEffect(() => {
    checkAgentStatus();
    const interval = setInterval(checkAgentStatus, 30000);
    return () => clearInterval(interval);
  }, [checkAgentStatus]);
  
  // Clear unread count when chat is opened
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      setUnreadCount(0);
    }
  }, [isOpen, unreadCount]);

  // Store initial message before contact form
  const storeInitialMessage = async (messageContent: string, messageType: string = 'text') => {
    try {
      await fetch('https://draminesaid.com/lucci/api/store_initial_message.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temp_session_id: tempSessionId,
          message_content: messageContent,
          message_type: messageType
        }),
      });
    } catch (error) {
      console.error('Error storing initial message:', error);
    }
  };

  // Start polling for new messages
  const startMessagePolling = useCallback(() => {
    if (isPollingMessages || !sessionId) return;
    
    setIsPollingMessages(true);
    messagePollingRef.current = setInterval(async () => {
      try {
        const response = await fetch(`https://draminesaid.com/lucci/api/chat_messages.php?session_id=${sessionId}`);
        const data = await response.json();
        
        if (data.success && data.messages?.length > 0) {
          const agentMessages = data.messages.filter((msg: any) => msg.sender_type === 'agent');
          
          if (agentMessages.length > 0) {
            setMessages(prev => {
              const newMessages = agentMessages.filter((msg: any) => 
                !prev.some(existingMsg => existingMsg.text === msg.message_content)
              );
              
              if (newMessages.length === 0) return prev;
              
              playNotificationSound();
              
              if (!isOpen) {
                setUnreadCount(prevCount => prevCount + newMessages.length);
              }
              
              return [...prev, ...newMessages.map((msg: any) => ({
                text: msg.message_content,
                isUser: false,
                imageUrl: msg.image_url ? `https://draminesaid.com/lucci/${msg.image_url}` : undefined,
                imageName: msg.image_name
              }))];
            });
          }
        }
      } catch (error) {
        console.error('Error polling messages:', error);
      }
    }, 3000);
  }, [sessionId, isPollingMessages, playNotificationSound, isOpen]);

  const stopMessagePolling = useCallback(() => {
    if (messagePollingRef.current) {
      clearInterval(messagePollingRef.current);
      messagePollingRef.current = null;
    }
    setIsPollingMessages(false);
  }, []);

  // Handle message input change
  const handleMessageChange = (value: string) => {
    setMessage(value);
  };

  // Handle contact form change
  const handleContactFormChange = (field: keyof typeof contactForm, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  // Handle send message
  const handleSendMessage = useCallback(() => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;
    
    setMessage('');
    setMessages(prev => [...prev, { text: trimmedMessage, isUser: true }]);

    if (!userInfoCollected && !showContactForm) {
      storeInitialMessage(trimmedMessage, 'text');
      
      setTimeout(() => {
        setShowContactForm(true);
        setMessages(prev => [...prev, {
          text: "Pour mieux vous aider, pouvez-vous nous donner vos coordonnées ?",
          isUser: false
        }]);
      }, 1000);
      return;
    }

    if (userInfoCollected && sessionId) {
      fetch('https://draminesaid.com/lucci/api/chat_messages.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          sender_type: 'client',
          sender_name: contactForm.name,
          message_content: trimmedMessage,
          message_type: 'text'
        }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.success && !isPollingMessages) {
          startMessagePolling();
        }
      })
      .catch(error => console.error('Error sending message:', error));
    }
  }, [message, userInfoCollected, showContactForm, sessionId, contactForm.name, isPollingMessages, startMessagePolling, storeInitialMessage]);

  // Handle key press
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // Handle contact form submit
  const handleContactSubmit = async () => {
    if (!contactForm.name || !contactForm.email || !contactForm.phone) return;
    
    try {
      const sessionResponse = await fetch('https://draminesaid.com/lucci/api/chat_sessions.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          client_name: contactForm.name,
          client_email: contactForm.email,
          client_phone: contactForm.phone
        }),
      });
      
      const sessionData = await sessionResponse.json();
      
      if (sessionData.success) {
        setSessionId(sessionData.session_id);
        setUserInfoCollected(true);
        setShowContactForm(false);
        
        if (tempSessionId) {
          await fetch('https://draminesaid.com/lucci/api/transfer_temp_messages.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              temp_session_id: tempSessionId,
              real_session_id: sessionData.session_id,
              client_name: contactForm.name
            }),
          });
        }
        
        startMessagePolling();
        
        setTimeout(() => {
          setMessages(prev => [...prev, {
            text: `Merci ${contactForm.name} ! Comment puis-je vous aider aujourd'hui ?`,
            isUser: false
          }]);
        }, 1000);
      }
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMessagePolling();
    };
  }, [stopMessagePolling]);

  if (!isVisible) return null;

  return (
    <>
      {!isMobile && (
        <div className="fixed bottom-6 right-6 z-50">
          {isOpen ? (
            <div className="w-80">
              <ChatWindow
                messages={messages}
                message={message}
                showContactForm={showContactForm}
                contactForm={contactForm}
                agentsOnline={agentsOnline}
                onClose={() => setIsOpen(false)}
                onMessageChange={handleMessageChange}
                onSendMessage={handleSendMessage}
                onKeyDown={handleKeyPress}
                onContactFormChange={handleContactFormChange}
                onContactSubmit={handleContactSubmit}
              />
            </div>
          ) : (
            <ChatButton
              agentsOnline={agentsOnline}
              unreadCount={unreadCount}
              onClick={() => setIsOpen(true)}
            />
          )}
        </div>
      )}

      {isMobile && (
        <div className="fixed bottom-6 right-6 z-50">
          {isOpen ? (
            <div className="w-72">
              <ChatWindow
                messages={messages}
                message={message}
                showContactForm={showContactForm}
                contactForm={contactForm}
                agentsOnline={agentsOnline}
                onClose={() => setIsOpen(false)}
                onMessageChange={handleMessageChange}
                onSendMessage={handleSendMessage}
                onKeyDown={handleKeyPress}
                onContactFormChange={handleContactFormChange}
                onContactSubmit={handleContactSubmit}
              />
            </div>
          ) : (
            <ChatButton
              agentsOnline={agentsOnline}
              unreadCount={unreadCount}
              onClick={() => setIsOpen(true)}
              isMobile={true}
            />
          )}
        </div>
      )}
    </>
  );
};