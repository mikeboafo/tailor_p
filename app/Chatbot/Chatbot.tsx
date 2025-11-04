'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  MessageCircle,
  X,
  Send,
  User,
  Bot,
  Minimize2,
  Maximize2,
  Trash2,
  MapPin,
  Download,
  Loader2,
  ExternalLink
} from "lucide-react";

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  quickReplies?: string[];
  meta?: Record<string, any>;
  type?: 'text' | 'order_status' | 'tailor_list' | 'location_request' | 'download_prompt';
};

type OrderStatus = {
  orderId: string;
  status: 'processing' | 'in_progress' | 'ready' | 'completed' | 'cancelled';
  tailorName: string;
  customerName: string;
  customerPhone: string;
  garmentType: string;
  price: number;
  dueAmount: number;
  dueDate: string;
  estimatedCompletion?: string;
  lastUpdated: string;
  items: string[];
  measurements?: {
    name: string;
    value: number;
  }[];
};

type Tailor = {
  id: string;
  name: string;
  rating: number;
  specialty: string[];
  distance: number;
  priceRange: string;
  available: boolean;
};

type ChatbotProps = {
  position?: 'bottom-right' | 'bottom-left';
  primaryColor?: string;
};

const STORAGE_KEY = "tailorlink_chat_v5";
const SESSION_KEY = "tailorlink_session_v5";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.wgghana.tailorsuite&pcampaignid=web_share";

const uid = (prefix = "") => `${prefix}${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const detectIntentHeuristic = (text: string) => {
  const s = text.toLowerCase().trim();
  
  const patterns = {
    greeting: /\b(hello|hi|hey|sup|wossop|whatsapp|good morning|good afternoon|good evening)\b/i,
    farewell: /\b(bye|goodbye|see you|farewell|thanks|thank you|appreciate)\b/i,
    order_tracking: /(track.*order|order.*status|status.*order|where.*order|ORD-[A-Z0-9]{6,15}|#\s*[A-Z0-9]{6,15})/i,
    find_tailor: /(tailor|find.*tailor|seamstress|alteration|repair|custom|bespoke|clothing.*made|stitch|sew)/i,
    pricing: /(price|cost|how much|fee|charge|expensive|cheap|pricing|estimate|rate)/i,
    measurement: /(measure|measurement|size|fitting|hemming|too big|too small|alter.*fit)/i,
    delivery: /(deliver|delivery|pickup|shipping|when ready|completion|timeframe|how long)/i,
    support: /(app|download|install|bug|crash|login|account|password|technical|help)/i,
    urgent: /(emergency|urgent|asap|immediately|today|tomorrow|rush|quick)/i,
    download: /(download|install|get.*app|mobile.*app|app.*store|play.*store|google.*play)/i,
    location: /(location|near me|nearby|close to me|in my area|local)/i,
  };

  for (const [intent, pattern] of Object.entries(patterns)) {
    if (pattern.test(s)) {
      return { 
        intent, 
        confidence: intent === 'order_tracking' || intent === 'find_tailor' ? 0.9 : 0.8 
      };
    }
  }
  return { intent: "unknown", confidence: 0.3 };
};

const apiService = {
  async trackOrder(orderNumber: string): Promise<any> {
    try {
      const cleanOrderNumber = orderNumber.replace(/[#\s]/g, '').trim();

      const apiUrl = `http://192.168.100.145:8000/api/v2/customers/orders/${cleanOrderNumber}`;
      
      console.log(`Track Order Direct API: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log('API Response Status:', response.status);
      console.log('API Response OK:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('API Error Response:', errorText);
        throw new Error(`Order not found - Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Full API Result:', result);
      
      if (result && result.data) {
        const transformedData = this.transformOrderData(result.data);
        console.log('Transformed Order Data:', transformedData);
        return transformedData;
      } else {
        throw new Error('Order data not available in response');
      }
    } catch (error) {
      console.error('Error tracking order:', error);
      return null;
    }
  },

  transformOrderData(data: any): OrderStatus {
    const statusMap: Record<string, 'processing' | 'in_progress' | 'ready' | 'completed' | 'cancelled'> = {
      'pending': 'processing',
      'in_progress': 'in_progress',
      'ready': 'ready',
      'completed': 'completed',
      'cancelled': 'cancelled'
    };

    // Debug: Log the incoming data structure
    console.log('Transforming order data:', {
      order_number: data.order_number,
      status: data.status,
      customer: data.customer,
      garment_type: data.garment_type,
      price: data.price,
      due_amount: data.due_amount,
      due_date: data.due_date,
      order_measurements: data.order_measurements
    });

    const orderStatus: OrderStatus = {
      orderId: data.order_number,
      status: statusMap[data.status] || 'processing',
      tailorName: `Tailor #${data.tailor_id}`,
      customerName: data.customer?.name || 'N/A',
      customerPhone: data.customer?.phone || 'N/A',
      garmentType: data.garment_type?.name || 'Custom garment',
      price: data.price || 0,
      dueAmount: data.due_amount || 0,
      dueDate: data.due_date || 'N/A',
      lastUpdated: data.updated_at || new Date().toISOString(),
      items: [data.garment_type?.name || 'Custom garment'],
      measurements: data.order_measurements?.map((m: any) => ({
        name: m.measurement_name,
        value: m.value
      })) || []
    };

    console.log('Final transformed order:', orderStatus);
    return orderStatus;
  },


  async findTailors(latitude: number, longitude: number, serviceType?: string): Promise<Tailor[]> {
    try {
      const response = await fetch('http://192.168.100.145:8000/api/v2/tailors/nearby', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude, longitude, serviceType, radius: 10 }),
      });

      if (!response.ok) {
        throw new Error('Failed to find tailors');
      }

      const data = await response.json();
      return data.tailors || [];
    } catch (error) {
      console.error('Error finding tailors:', error);
      return [];
    }
  },

  // Get user location
  async getUserLocation(): Promise<{ latitude: number; longitude: number } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          resolve(null);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  },
};


const OrderStatusComponent: React.FC<{ order: OrderStatus }> = ({ order }) => {
  const statusColors = {
    processing: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    ready: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    processing: 'Processing',
    in_progress: 'In Progress',
    ready: 'Ready for Pickup',
    completed: 'Completed',
    cancelled: 'Cancelled'
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mt-2 shadow-sm">
      <div className="flex justify-between items-start mb-3">
       
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
          {statusLabels[order.status]}
        </span>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Tailor:</span>
          <span className="font-medium">{order.tailorName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Customer:</span>
          <span className="font-medium">{order.customerName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Garment:</span>
          <span className="font-medium">{order.garmentType}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Total Price:</span>
          <span className="font-medium">GH₵ {order.price.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Due Amount:</span>
          <span className="font-medium">GH₵ {order.dueAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Due Date:</span>
          <span className="font-medium">{new Date(order.dueDate).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Last Updated:</span>
          <span className="font-medium">{new Date(order.lastUpdated).toLocaleDateString()}</span>
        </div>
      </div>

      {order.measurements && order.measurements.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">Measurements:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {order.measurements.map((measurement, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-600">{measurement.name}:</span>
                <span className="font-medium">{measurement.value} cm</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Fallback responses for different intents
const FALLBACK_RESPONSES: Record<string, { text: string; quickReplies?: string[] }> = {
  greeting: {
    text: "Hello! How can I assist you today?",
    quickReplies: ["Find tailors near me", "Track my order", "Pricing information", "Download the app"]
  },
  farewell: {
    text: "Thank you for chatting with TailorLink! If you need anything else, just let me know.",
    quickReplies: ["Main menu", "Download the app"]
  },
  order_tracking: {
    text: "I'd be happy to help track your order. Please provide your order number (e.g., ORD-XXXXXXX).",
    quickReplies: ["Where to find order number?", "Download app for tracking", "Contact support", "Main menu"]
  },
  find_tailor: {
    text: "I can help you find expert tailors near you. Would you like to use your current location?",
    quickReplies: ["Yes, use my location", "No, skip location", "Download app instead"]
  },
  pricing: {
    text: "For pricing information, please specify the type of garment or service you're interested in.",
    quickReplies: ["Find tailors", "Download app", "Main menu"]
  },
  measurement: {
    text: "I can provide a measurement guide or connect you with a tailor for fittings. What would you like?",
    quickReplies: ["Measurement guide", "Find tailors", "Main menu"]
  },
  delivery: {
    text: "Delivery times depend on the tailor and service. Would you like to track an order or find tailors?",
    quickReplies: ["Track my order", "Find tailors", "Download app"]
  },
  support: {
    text: "For technical support, please describe your issue or download our app for more help.",
    quickReplies: ["Download app", "Contact support", "Main menu"]
  },
  urgent: {
    text: "For urgent tailoring needs, I recommend finding tailors near you or contacting support.",
    quickReplies: ["Find tailors", "Contact support", "Download app"]
  },
  download: {
    text: "You can download the TailorLink app from the Google Play Store for the best experience!",
    quickReplies: ["Download Now", "Find tailors", "Track order", "Main menu"]
  },
  location: {
    text: "To find tailors near you, may I use your current location?",
    quickReplies: ["Yes, use my location", "No, skip location", "Download app instead"]
  },
  unknown: {
    text: "I'm not sure I understand. Could you please rephrase or select an option below?",
    quickReplies: ["Find tailors", "Track my order", "Download the app", "Main menu"]
  }
};


type ChatHeaderProps = {
  onMinimize: () => void;
  onClose: () => void;
  isMinimized: boolean;
};

const ChatHeader: React.FC<ChatHeaderProps> = ({ onMinimize, onClose, isMinimized }) => (
  <div className="flex items-center justify-between px-4 py-2 border-b bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl">
    <div className="flex items-center gap-2">
      <Bot className="w-6 h-6 text-white" />
      <span className="text-white font-semibold text-lg">TailorLink Assistant</span>
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={onMinimize}
        className="text-white hover:text-blue-200 p-1 rounded"
        aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
        type="button"
      >
        {isMinimized ? <Maximize2 className="w-5 h-5" /> : <Minimize2 className="w-5 h-5" />}
      </button>
      <button
        onClick={onClose}
        className="text-white hover:text-red-400 p-1 rounded"
        aria-label="Close chat"
        type="button"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  </div>
);


const TypingIndicator: React.FC = () => (
  <div className="flex items-center gap-2 my-2 animate-fade-in">
    <Bot className="w-5 h-5 text-blue-500" />
    <div className="flex gap-1">
      <span className="block w-2 h-2 bg-blue-400 rounded-full animate-typing-bounce" style={{ animationDelay: '0ms' }}></span>
      <span className="block w-2 h-2 bg-blue-400 rounded-full animate-typing-bounce" style={{ animationDelay: '150ms' }}></span>
      <span className="block w-2 h-2 bg-blue-400 rounded-full animate-typing-bounce" style={{ animationDelay: '300ms' }}></span>
    </div>
    <span className="text-xs text-gray-400 ml-2">TailorLink is typing...</span>
  </div>
);


type ChatInputProps = {
  inputText: string;
  onInputChange: (text: string) => void;
  onSend: () => void;
  onClear: () => void;
  isSending: boolean;
};

const ChatInput: React.FC<ChatInputProps> = ({
  inputText,
  onInputChange,
  onSend,
  onClear,
  isSending,
}) => (
  <div className="flex items-center gap-2 p-2 border-t bg-white">
    <input
      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none"
      type="text"
      value={inputText}
      onChange={e => onInputChange(e.target.value)}
      onKeyDown={e => {
        if (e.key === "Enter" && !isSending) onSend();
      }}
      placeholder="Type your message..."
      disabled={isSending}
    />
    <button
      className="px-3 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
      onClick={onSend}
      disabled={isSending || !inputText.trim()}
      aria-label="Send message"
    >
      <Send className="w-4 h-4" />
    </button>
    <button
      className="px-2 py-2 text-gray-400 hover:text-red-500"
      onClick={onClear}
      aria-label="Clear chat"
      type="button"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  </div>
);


export default function Chatbot({ position = 'bottom-right' }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [sessionId] = useState(() => {
    if (typeof window === 'undefined') return uid("sess_");
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) return stored;
    const newId = uid("sess_");
    localStorage.setItem(SESSION_KEY, newId);
    return newId;
  });
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: "smooth",
        block: "end"
      });
    };

    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, isTyping]);


  useEffect(() => {
    if (typeof window === 'undefined') return;

    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch (error) {
        console.warn('Failed to save chat history:', error);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0 && typeof window !== 'undefined') {
      const welcomeMessage: Message = {
        id: uid("welcome_"),
        text: "Hello! I'm your TailorLink assistant. I can help you:\n\n• Find expert tailors near you\n• Track your orders in real-time\n• Get pricing estimates\n• Schedule fittings\n• Answer measurement questions\n\nHow can I assist you today?",
        isUser: false,
        timestamp: new Date().toISOString(),
        quickReplies: [
          "Find tailors near me",
          "Track my order",
          "Pricing information", 
          "Measurement guide",
          "Download the app"
        ],
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length]);


  const simulateTyping = useCallback((callback: () => void, delay = 800) => {
    setIsTyping(true);
    const timeoutId = setTimeout(() => {
      setIsTyping(false);
      callback();
    }, delay);
    return () => clearTimeout(timeoutId);
  }, []);


  const handleDownloadApp = useCallback(() => {
    window.open(PLAY_STORE_URL, '_blank', 'noopener,noreferrer');
    
 
    simulateTyping(() => {
      const botMsg: Message = {
        id: uid("bot_"),
        text: "Perfect! I've opened the Play Store for you. Download the app to unlock all features:\n\n• Instant tailor booking\n• Real-time order tracking\n• Exclusive discounts\n• Full tailor profiles and reviews\n\nHappy tailoring! 🪡",
        isUser: false,
        timestamp: new Date().toISOString(),
        type: 'download_prompt',
        quickReplies: ["Find tailors", "Track order", "Pricing", "Support"],
      };
      setMessages(prev => [...prev, botMsg]);
    });
  }, [simulateTyping]);


  const processOrderTracking = useCallback(async (orderInput: string) => {
    setIsSending(true);
    
 
    let orderNumber = orderInput;
    const orderMatch = orderInput.match(/(ORD-[A-Z0-9]{6,15}|[A-Z0-9]{6,15})/i);
    if (orderMatch) {
      orderNumber = orderMatch[1];
    }

    const order = await apiService.trackOrder(orderNumber);
    
   simulateTyping(() => {
  if (order) {
    const botMsg: Message = {
      id: uid("bot_"),
      text: `Here's the current status of your order **${order.orderId}**:`,
      isUser: false,
      timestamp: new Date().toISOString(),
      type: 'order_status',
      meta: { order },
      quickReplies: ["Track another order", "Contact tailor", "Download app for live tracking", "Main menu"],
    };
    setMessages(prev => [...prev, botMsg]);
  } else {
    const botMsg: Message = {
      id: uid("bot_"),
      text: `I couldn't find order "${orderNumber}". Please check that:\n\n• The order number is correct (format: ORD-XXXXXXX)\n• The order exists in our system\n\nYou can also download our app for real-time order tracking!`,
      isUser: false,
      timestamp: new Date().toISOString(),
      quickReplies: ["Try again", "Download app", "Contact support", "Main menu"],
    };
    setMessages(prev => [...prev, botMsg]);
  }
  setIsSending(false);
});
  }, [simulateTyping]);

  const processFindTailors = useCallback(async (userText: string) => {
    setIsSending(true);

    if (userText.toLowerCase().includes('download') || userText.toLowerCase().includes('app')) {
      handleDownloadApp();
      setIsSending(false);
      return;
    }

    if (userText.toLowerCase().includes('yes') || userText.toLowerCase().includes('use my location')) {
      const location = await apiService.getUserLocation();
      
      if (location) {
        setUserLocation(location);
        const tailors = await apiService.findTailors(location.latitude, location.longitude);
        
        simulateTyping(() => {
          if (tailors.length > 0) {
            const botMsg: Message = {
              id: uid("bot_"),
              text: `I found ${tailors.length} expert tailors near your location! Here are the top results:`,
              isUser: false,
              timestamp: new Date().toISOString(),
              type: 'tailor_list',
              meta: { tailors },
              quickReplies: ["Download app to book", "Find different service", "Get pricing", "Main menu"],
            };
            setMessages(prev => [...prev, botMsg]);
          } else {
            const botMsg: Message = {
              id: uid("bot_"),
              text: "I couldn't find any tailors in your immediate area. Try expanding your search radius or download our app to see more options and book instantly!",
              isUser: false,
              timestamp: new Date().toISOString(),
              quickReplies: ["Download app", "Try different location", "Contact support"],
            };
            setMessages(prev => [...prev, botMsg]);
          }
          setIsSending(false);
        });
      } else {
        simulateTyping(() => {
          const botMsg: Message = {
            id: uid("bot_"),
            text: "I couldn't access your location. Please enable location permissions in your browser settings, or download our app for the best experience finding and booking local tailors!",
            isUser: false,
            timestamp: new Date().toISOString(),
            type: 'location_request',
            quickReplies: ["Download app", "Enter location manually", "Skip location"],
          };
          setMessages(prev => [...prev, botMsg]);
          setIsSending(false);
        });
      }
    } else {

      simulateTyping(() => {
        const botMsg: Message = {
          id: uid("bot_"),
          text: "To find the best tailors near you, I'll need your location. This helps me show you tailors who are actually available in your area. Is it okay to use your current location?",
          isUser: false,
          timestamp: new Date().toISOString(),
          type: 'location_request',
          quickReplies: ["Yes, use my location", "No, skip location", "Download app instead"],
        };
        setMessages(prev => [...prev, botMsg]);
        setIsSending(false);
      });
    }
  }, [simulateTyping, handleDownloadApp]);


  const sendMessage = useCallback(async (rawInput: string) => {
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: uid("msg_"),
      text: trimmed,
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsSending(true);

    const heuristic = detectIntentHeuristic(trimmed);

    if (heuristic.intent === 'order_tracking') {

      const orderMatch = trimmed.match(/(ORD-[A-Z0-9]{6,15}|[A-Z0-9]{6,15})/i);
      if (orderMatch) {
        await processOrderTracking(orderMatch[1]);
      } else {

        simulateTyping(() => {
          const botMsg: Message = {
            id: uid("bot_"),
            text: "I'd be happy to track your order! Please provide your order number (it usually looks like ORD-6902011D56DA9). You can find it in your order confirmation or in the app.",
            isUser: false,
            timestamp: new Date().toISOString(),
            quickReplies: ["Where to find order number?", "Download app for tracking", "Contact support", "Main menu"],
          };
          setMessages(prev => [...prev, botMsg]);
          setIsSending(false);
        });
      }
      return;
    }

    if (heuristic.intent === 'find_tailor' || heuristic.intent === 'location') {
      await processFindTailors(trimmed);
      return;
    }

    if (heuristic.intent === 'download') {
      handleDownloadApp();
      return;
    }


    const response = FALLBACK_RESPONSES[heuristic.intent] || FALLBACK_RESPONSES.unknown;


    const lastBotMessages = messages.filter(m => !m.isUser).slice(-3);
    const isDuplicateResponse = lastBotMessages.some(msg => 
      msg.text === response.text || 
      (msg.quickReplies && JSON.stringify(msg.quickReplies) === JSON.stringify(response.quickReplies))
    );

    if (isDuplicateResponse) {
      const alternativeResponse = FALLBACK_RESPONSES.unknown;
      simulateTyping(() => {
        const botMsg: Message = {
          id: uid("bot_"),
          text: alternativeResponse.text,
          isUser: false,
          timestamp: new Date().toISOString(),
          quickReplies: alternativeResponse.quickReplies,
        };
        setMessages(prev => [...prev, botMsg]);
        setIsSending(false);
      });
      return;
    }

    simulateTyping(() => {
      const botMsg: Message = {
        id: uid("bot_"),
        text: response.text,
        isUser: false,
        timestamp: new Date().toISOString(),
        quickReplies: response.quickReplies,
      };
      setMessages(prev => [...prev, botMsg]);
      setIsSending(false);
    });
  }, [messages, processOrderTracking, processFindTailors, simulateTyping, handleDownloadApp]);


  const handleQuickReply = useCallback((reply: string) => {
    if (reply.toLowerCase().includes('download') || reply === "Download Now" || reply === "Download app") {
      handleDownloadApp();
    } else {
      sendMessage(reply);
    }
  }, [sendMessage, handleDownloadApp]);

  const handleClearChat = useCallback(() => {
    if (window.confirm("Clear all chat history? This action cannot be undone.")) {
      setMessages([]);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.warn('Failed to clear chat history:', error);
      }
    }
  }, []);

  const toggleChat = useCallback(() => {
    const newState = !isOpen;
    setIsOpen(newState);
    setIsMinimized(false);
  }, [isOpen]);

  const toggleMinimize = useCallback(() => {
    setIsMinimized(prev => !prev);
  }, []);


  type MessageBubbleProps = {
    message: Message;
    onQuickReply: (reply: string) => void;
  };

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onQuickReply }) => {

  const renderTextWithFormatting = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2);
        return (
          <span key={index} className="font-semibold">
            {boldText}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div
      className={`flex ${message.isUser ? "justify-end" : "justify-start"} my-2 animate-message-in`}
    >
      <div
        className={`max-w-[80%] px-4 py-2 rounded-2xl shadow ${
          message.isUser
            ? "bg-blue-600 text-white rounded-br-md"
            : "bg-white text-gray-900 border border-gray-200 rounded-bl-md"
        }`}
      >
        <div className="whitespace-pre-line">
          {renderTextWithFormatting(message.text)}
        </div>
        
        {message.type === 'order_status' && message.meta?.order && (
          <div className="mt-3">
            <OrderStatusComponent order={message.meta.order} />
          </div>
        )}
        
        {message.quickReplies && message.quickReplies.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 animate-quick-replies">
            {message.quickReplies.map((reply, idx) => (
              <button
                key={idx}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition"
                onClick={() => onQuickReply(reply)}
                type="button"
              >
                {reply}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

  const messageList = useMemo(() => (
    <div 
      ref={chatContainerRef}
      className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-blue-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400"
    >
      <div className="max-w-4xl mx-auto">
        {messages.map((message) => (
          <MessageBubble 
            key={message.id} 
            message={message} 
            onQuickReply={handleQuickReply}
          />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} className="h-4" />
      </div>
    </div>
  ), [messages, isTyping, handleQuickReply]);

  const positionClass = position === 'bottom-left' 
    ? 'left-4 sm:left-6' 
    : 'right-4 sm:right-6';

  return (
    <>
      <button
        onClick={toggleChat}
        className={`fixed bottom-4 sm:bottom-6 ${positionClass} bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-2xl shadow-2xl transition-all duration-300 z-50 group hover:scale-110 hover:shadow-3xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 active:scale-95`}
        aria-label="Open TailorLink chat assistant"
        aria-expanded={isOpen}
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse ring-2 ring-white"></div>
        <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      </button>

      {isOpen && (
        <div
          className={`fixed bottom-20 ${positionClass} w-[calc(100vw-2rem)] sm:w-96 max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col transform transition-all duration-300 ${
            isMinimized ? "opacity-80 scale-95 h-32" : "opacity-100 scale-100 h-[min(600px,80vh)]"
          }`}
          role="dialog"
          aria-label="TailorLink chat window"
          style={{ 
            maxWidth: 'calc(100vw - 2rem)',
          }}
        >
          <ChatHeader 
            onMinimize={toggleMinimize}
            onClose={toggleChat}
            isMinimized={isMinimized}
          />

          {!isMinimized && (
            <>
              {messageList}
              
              <ChatInput
                inputText={inputText}
                onInputChange={setInputText}
                onSend={() => sendMessage(inputText)}
                onClear={handleClearChat}
                isSending={isSending}
              />
            </>
          )}
        </div>
      )}

      {/* Enhanced global styles */}
      <style jsx global>{`
        @keyframes message-in {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes quick-replies {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes typing-bounce {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-4px);
          }
        }

        .animate-message-in {
          animation: message-in 0.3s ease-out forwards;
        }

        .animate-quick-replies {
          animation: quick-replies 0.4s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        .animate-typing-bounce {
          animation: typing-bounce 1.4s ease-in-out infinite;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 3px;
        }

        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb:hover {
          background-color: #9ca3af;
        }

        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }

        @media (max-width: 640px) {
          .scrollbar-thin::-webkit-scrollbar {
            width: 4px;
          }
        }
      `}</style>
    </>
  );
}