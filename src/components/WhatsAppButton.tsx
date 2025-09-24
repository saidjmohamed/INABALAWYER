import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton = () => {
  return (
    <Link
      to="https://wa.me/213558357689"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg bg-[#25D366] hover:bg-[#128C7E] transition-all duration-300 hover:scale-110 animate-bounce"
      style={{
        animation: 'bounce 1s infinite'
      }}
    >
      <div className="w-full h-full flex items-center justify-center">
        <MessageCircle className="h-6 w-6 text-white" />
      </div>
    </Link>
  );
};