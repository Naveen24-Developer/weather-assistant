import React from 'react';
import ChatInterface from './components/ChatInterface';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4 md:p-8">
      {/* Background Decor */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-sky-300/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-300/20 rounded-full blur-3xl pointer-events-none"></div>
      
      <ChatInterface />
    </div>
  );
}

export default App;
