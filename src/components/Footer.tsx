import { Github, Code } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t mt-8 py-6 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 text-gray-600 text-sm">
            <span>تم التطوير بواسطة</span>
            <a 
              href="https://github.com/tillawiy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Code className="w-4 h-4" />
              <span>tillawiy</span>
            </a>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/tillawiy/realstate" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Github className="w-5 h-5" />
              <span className="text-sm">المستودع</span>
            </a>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t text-center text-gray-500 text-xs">
          <p>© {new Date().getFullYear()} تطبيق العقارات - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
}

