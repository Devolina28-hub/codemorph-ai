"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";
import { ArrowRightLeft, Copy, Download, Zap, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const LANGUAGES = [
  { id: "c", name: "C" },
  { id: "cpp", name: "C++" },
  { id: "java", name: "Java" },
  { id: "python", name: "Python" },
  { id: "javascript", name: "JavaScript" },
];

export default function Converter() {
  const [sourceLang, setSourceLang] = useState("python");
  const [targetLang, setTargetLang] = useState("javascript");
  const [sourceCode, setSourceCode] = useState("# Write your code here...");
  const [targetCode, setTargetCode] = useState("// Converted code will appear here...");
  const [isConverting, setIsConverting] = useState(false);

  const handleConvert = async () => {
    if (!sourceCode.trim()) {
      toast.error("Please enter some code to convert");
      return;
    }

    setIsConverting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceCode, sourceLang, targetLang }),
      });

      if (!response.ok) throw new Error("Failed to convert code");

      const data = await response.json();
      setTargetCode(data.convertedCode);
      toast.success("Code converted successfully!");
    } catch (error) {
      toast.error("An error occurred during conversion");
      console.error(error);
    } finally {
      setIsConverting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(targetCode);
    toast.success("Copied to clipboard!");
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([targetCode], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    const extMap: Record<string, string> = {
      c: "c", cpp: "cpp", java: "java", python: "py", javascript: "js"
    };
    element.download = `converted_code.${extMap[targetLang]}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="h-full flex flex-col">
      <Toaster position="top-right" />
      
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Zap className="text-violet-400" /> AI Code Converter
          </h1>
          <p className="text-slate-400 mt-2">Instantly translate code between languages without losing logic.</p>
        </div>
        
        <button 
          onClick={handleConvert}
          disabled={isConverting}
          className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-violet-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isConverting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRightLeft className="w-5 h-5" />}
          {isConverting ? "Converting..." : "Convert Code"}
        </button>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        {/* Source Editor */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel rounded-2xl border border-white/10 flex flex-col overflow-hidden"
        >
          <div className="p-4 border-b border-white/10 bg-black/20 flex justify-between items-center">
            <select 
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="bg-transparent text-white font-semibold outline-none cursor-pointer"
            >
              {LANGUAGES.map(l => <option key={l.id} value={l.id} className="bg-slate-800">{l.name}</option>)}
            </select>
          </div>
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={sourceLang}
              theme="vs-dark"
              value={sourceCode}
              onChange={(value) => setSourceCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
              }}
            />
          </div>
        </motion.div>

        {/* Target Editor */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel rounded-2xl border border-white/10 flex flex-col overflow-hidden"
        >
          <div className="p-4 border-b border-white/10 bg-black/20 flex justify-between items-center">
            <select 
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="bg-transparent text-white font-semibold outline-none cursor-pointer"
            >
              {LANGUAGES.map(l => <option key={l.id} value={l.id} className="bg-slate-800">{l.name}</option>)}
            </select>
            
            <div className="flex items-center gap-3">
              <button onClick={handleCopy} className="text-slate-400 hover:text-white transition-colors" title="Copy Code">
                <Copy className="w-5 h-5" />
              </button>
              <button onClick={handleDownload} className="text-slate-400 hover:text-white transition-colors" title="Download Code">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={targetLang}
              theme="vs-dark"
              value={targetCode}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                padding: { top: 16 },
                readOnly: true,
                scrollBeyondLastLine: false,
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
