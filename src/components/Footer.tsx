import { Code, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t py-4 px-4 md:px-8 mt-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-col md:flex-row items-center gap-2 text-gray-600 text-sm">
            <span>تم التطوير بواسطة</span>
            <a 
              href="https://ali-samir-ali.vercel.app/index.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <Code className="w-4 h-4" />
              <span>tillawiy</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t text-center text-gray-500 text-xs">
          <p>© {new Date().getFullYear()} تطبيق العقارات - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
}

