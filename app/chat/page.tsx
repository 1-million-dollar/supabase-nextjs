'use client'; // Mark this as a Client Component

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function Home() {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<{ id: number; user_name: string; message: string }[]>([]);
  const [userName, setUserName] = useState<string>('');

  const supabase = createClient()

  useEffect(() => {
    // Prompt the user to enter their name
    const name = prompt('Enter your name:');
    if (name) {
      setUserName(name);
    }

    // Fetch initial messages
    fetchMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          setMessages((prevMessages) => [...prevMessages, payload.new as any]);
        }
      )
      .subscribe();

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (data) {
      setMessages(data);
    }
  };

  const sendMessage = async () => {
    if (message.trim() && userName) {
      const { error } = await supabase
        .from('messages')
        .insert([{ user_name: userName, message }]);

      if (!error) {
        setMessage('');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Chat App</h1>
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-4">
        <div className="h-64 overflow-y-auto mb-4">
          {messages.map((msg) => (
            <div key={msg.id} className="mb-2">
              <strong>{msg.user_name}:</strong> {msg.message}
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-l-lg focus:outline-none"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}