import React, { useState, useRef, useEffect } from 'react';
import { Card, Input, Button, Spinner } from '../components/common/UI';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Languages, 
  Sparkles, 
  Mic, 
  Paperclip,
  Trash2,
  Info,
  Shield as ShieldIcon,
  Search
} from 'lucide-react';
import { apiFetch } from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';

const Chat = () => {
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Namaste! I am Verdantix AI. How can I help you navigate your carbon portfolio today?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [input, setInput] = useState('');
  const [isHindi, setIsHindi] = useState(false);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setMessages(prev => [...prev, { role: 'user', content: userMsg, time }]);
    setInput('');
    setLoading(true);

    try {
      const res = await apiFetch('/chat', {
        method: 'POST',
        body: JSON.stringify({ 
          message: userMsg,
          language: isHindi ? 'hi' : 'en'
        })
      });
      // Neural delay for premium feel
      await new Promise(r => setTimeout(r, 1200));
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: res.data.reply, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: 'I encountered a connection disruption. Redirecting focus to primary protocols. Please retry.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 max-w-5xl mx-auto h-[calc(100vh-180px)] flex flex-col gap-6 py-4">
      {/* Header Area */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <div className="p-3 glass rounded-2xl border border-primary/20 text-primary bg-primary/5">
            <MessageSquare size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">AI PROTOCOL</h1>
            <div className="flex items-center gap-2 overflow-hidden">
               <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">Intelligence Online // v4.2</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsHindi(!isHindi)}
            className={`group relative flex items-center gap-2 px-6 py-2 rounded-2xl border transition-all duration-500 overflow-hidden ${
              isHindi 
                ? 'bg-primary/10 border-primary/30 text-primary font-black' 
                : 'bg-white/5 border-white/10 text-gray-500 font-bold'
            }`}
          >
            <div className={`absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity`} />
            <Languages size={14} className="relative z-10" />
            <span className="text-[10px] tracking-widest uppercase relative z-10">
              {isHindi ? 'हिन्दी (Active)' : 'ENGLISH'}
            </span>
          </button>
          
          <button 
             onClick={() => setMessages([messages[0]])}
             className="p-2 glass rounded-xl border border-white/5 text-gray-600 hover:text-red-400 hover:border-red-400/20 transition-all"
             title="Clear Protocol"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col overflow-hidden p-0 border-white/10 shadow-2xl relative">
        {/* Background mesh for chat */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(16,185,129,0.05),transparent)] pointer-events-none" />
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth custom-scrollbar">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] md:max-w-[70%] group`}>
                   <div className={`flex items-end gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      {/* Avatar */}
                      <div className={`flex-shrink-0 p-2.5 rounded-2xl border transition-all duration-500 ${
                        msg.role === 'user' 
                          ? 'bg-primary/20 border-primary/20 text-primary' 
                          : 'bg-white/10 border-white/10 text-white'
                      }`}>
                        {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                      </div>

                      {/* Message Bubble */}
                      <div className="space-y-1">
                         <div className={`p-5 rounded-3xl relative overflow-hidden transition-all duration-300 ${
                            msg.role === 'user' 
                              ? 'bg-primary text-black font-bold rounded-br-none bg-glow-primary' 
                              : 'glass border border-white/10 text-gray-200 rounded-bl-none'
                         }`}>
                           <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                           {msg.role === 'bot' && (
                              <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-10 transition-opacity">
                                <Sparkles size={48} />
                              </div>
                           )}
                         </div>
                         <p className={`text-[8px] font-black tracking-widest uppercase text-gray-600 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                            {msg.role === 'bot' ? 'System' : 'Client'} • {msg.time}
                         </p>
                      </div>
                   </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
               <div className="flex items-end gap-3">
                  <div className="p-2.5 rounded-2xl border border-primary/30 bg-primary/10 text-primary animate-pulse">
                     <Bot size={16} />
                  </div>
                  <div className="glass border border-white/10 p-5 rounded-3xl rounded-bl-none flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></span>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest ml-2">Analyzing Inputs</span>
                  </div>
               </div>
            </motion.div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input Control */}
        <div className="p-6 border-t border-white/10 bg-black/20 backdrop-blur-xl">
           <form onSubmit={handleSend} className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex gap-3 text-gray-500 z-10">
                 <button type="button" className="hover:text-primary transition-colors"><Paperclip size={18} /></button>
                 <button type="button" className="hover:text-primary transition-colors"><Mic size={18} /></button>
              </div>
              <input
                placeholder={isHindi ? "प्रोटोकॉल यहाँ टाइप करें..." : "Initialize neural query..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-white/5 border-2 border-white/5 rounded-[2rem] py-4 pl-16 pr-16 text-white focus:outline-none focus:border-primary/40 focus:bg-white/10 transition-all duration-300 font-medium placeholder:text-gray-600 shadow-2xl"
              />
              <button 
                  type="submit" 
                  disabled={!input.trim() || loading}
                  className="absolute right-2 top-2 bottom-2 px-6 rounded-[1.5rem] bg-primary text-black font-black uppercase tracking-widest text-[10px] disabled:opacity-30 transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-primary/20" 
              >
                Send <Send size={14} />
              </button>
           </form>
           <div className="mt-4 flex justify-center items-center gap-4">
              <div className="flex items-center gap-1.5 text-[8px] font-black text-gray-600 uppercase tracking-widest">
                 <ShieldIcon size={10} /> Encryption Active
              </div>
              <div className="h-1 w-1 rounded-full bg-gray-700" />
              <div className="flex items-center gap-1.5 text-[8px] font-black text-gray-600 uppercase tracking-widest">
                 <Sparkles size={10} /> AI Enhanced Mode
              </div>
           </div>
        </div>
      </Card>
    </div>
  );
};

export default Chat;
