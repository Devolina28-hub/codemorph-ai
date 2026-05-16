"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";
import { Terminal, Play, Loader2, Code2, Keyboard, AlignLeft } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const LANGUAGES = [
  { id: "c", name: "C", defaultCode: '#include <stdio.h>\n\nint main() {\n    printf("Hello World!\\n");\n    return 0;\n}' },
  { id: "cpp", name: "C++", defaultCode: '#include <iostream>\n\nint main() {\n    std::cout << "Hello World!\\n";\n    return 0;\n}' },
  { id: "java", name: "Java", defaultCode: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World!");\n    }\n}' },
  { id: "python", name: "Python", defaultCode: 'print("Hello World!")' },
  { id: "javascript", name: "JavaScript", defaultCode: 'console.log("Hello World!");' },
];

export default function Compiler() {
  const [language, setLanguage] = useState(LANGUAGES[4].id);
  const [code, setCode] = useState(LANGUAGES[4].defaultCode);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const langId = e.target.value;
    setLanguage(langId);
    const langDef = LANGUAGES.find(l => l.id === langId);
    if (langDef) setCode(langDef.defaultCode);
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      toast.error("Code cannot be empty");
      return;
    }

    setIsExecuting(true);
    setOutput("");
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, input }),
      });

      if (!response.ok) throw new Error("Failed to execute code");

      const data = await response.json();
      
      if (data.run && data.run.stderr) {
        setError(data.run.stderr);
      }
      if (data.run && data.run.stdout) {
        setOutput(data.run.stdout);
      }
      if (!data.run.stdout && !data.run.stderr) {
        setOutput("Code executed successfully (no output).");
      }

    } catch (err) {
      toast.error("Execution failed");
      console.error(err);
      setError("An error occurred while connecting to the execution server.");
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Toaster position="top-right" />
      
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Terminal className="text-emerald-400" /> Code Compiler
          </h1>
          <p className="text-slate-400 mt-2">Write, compile, and execute code directly in your browser.</p>
        </div>
        
        <button 
          onClick={handleRunCode}
          disabled={isExecuting}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isExecuting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
          {isExecuting ? "Executing..." : "Run Code"}
        </button>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Editor Area (Takes up 2 columns) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 glass-panel rounded-2xl border border-white/10 flex flex-col overflow-hidden h-[calc(100vh-160px)]"
        >
          <div className="p-4 border-b border-white/10 bg-black/20 flex justify-between items-center">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <Code2 className="w-4 h-4 text-emerald-400" />
              main.{language === "python" ? "py" : language === "javascript" ? "js" : language === "java" ? "java" : language === "c" ? "c" : "cpp"}
            </div>
            <select 
              value={language}
              onChange={handleLanguageChange}
              className="bg-slate-800 text-white font-semibold outline-none cursor-pointer rounded-lg px-3 py-1 text-sm border border-white/10"
            >
              {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 15,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace"
              }}
            />
          </div>
        </motion.div>

        {/* Input/Output Area */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-6 h-[calc(100vh-160px)]"
        >
          {/* Custom Input */}
          <div className="glass-panel rounded-2xl border border-white/10 flex flex-col flex-1 overflow-hidden">
             <div className="p-3 border-b border-white/10 bg-black/20 flex items-center gap-2 font-bold text-sm text-slate-300">
                <Keyboard className="w-4 h-4 text-violet-400" />
                Custom Input (STDIN)
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter input here..."
                className="flex-1 bg-transparent text-slate-300 p-4 outline-none resize-none font-mono text-sm"
              />
          </div>

          {/* Output Terminal */}
          <div className="glass-panel rounded-2xl border border-white/10 flex flex-col flex-[2] overflow-hidden">
             <div className="p-3 border-b border-white/10 bg-black/20 flex items-center gap-2 font-bold text-sm text-slate-300">
                <AlignLeft className="w-4 h-4 text-pink-400" />
                Output (STDOUT)
              </div>
              <div className="flex-1 bg-[#0a0a0a] p-4 overflow-y-auto font-mono text-sm relative group border-t border-black/50 shadow-inner">
                {isExecuting && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
                    <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                  </div>
                )}
                
                {output && <pre className="text-slate-300 whitespace-pre-wrap font-mono">{output}</pre>}
                {error && <pre className="text-red-400 whitespace-pre-wrap font-mono mt-2">{error}</pre>}
                
                {!output && !error && !isExecuting && (
                  <div className="text-slate-600 italic">Run code to see output...</div>
                )}
              </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
