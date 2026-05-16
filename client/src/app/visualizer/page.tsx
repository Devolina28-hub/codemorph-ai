"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ChevronRight, ChevronLeft, SkipForward, Loader2, Code2, Database, Terminal } from "lucide-react";
import Editor from "@monaco-editor/react";
import toast, { Toaster } from "react-hot-toast";

type Step = {
  lineNumber: number;
  variables: Record<string, string>;
  output: string;
  explanation: string;
};

const LANGUAGES = ["Python", "JavaScript", "C", "C++", "Java"];

const DEFAULT_CODE: Record<string, string> = {
  Python: `x = 5
y = 10
total = x + y
print(total)`,
  JavaScript: `let x = 5;
let y = 10;
let total = x + y;
console.log(total);`,
  C: `#include <stdio.h>
int main() {
  int x = 5;
  int y = 10;
  int total = x + y;
  printf("%d\\n", total);
  return 0;
}`,
  "C++": `#include <iostream>
using namespace std;
int main() {
  int x = 5;
  int y = 10;
  int total = x + y;
  cout << total << endl;
  return 0;
}`,
  Java: `public class Main {
  public static void main(String[] args) {
    int x = 5;
    int y = 10;
    int total = x + y;
    System.out.println(total);
  }
}`,
};

export default function Visualizer() {
  const [language, setLanguage] = useState("Python");
  const [code, setCode] = useState(DEFAULT_CODE["Python"]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasTrace, setHasTrace] = useState(false);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setCode(DEFAULT_CODE[lang] || "");
    setHasTrace(false);
    setSteps([]);
  };

  const handleGenerateTrace = async () => {
    if (!code.trim()) return;
    setIsLoading(true);
    setHasTrace(false);
    setSteps([]);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/visualize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });
      if (!response.ok) throw new Error("Server error");
      const data = await response.json();
      if (!data.steps || data.steps.length === 0) throw new Error("No steps returned");
      setSteps(data.steps);
      setCurrentStep(0);
      setHasTrace(true);
      toast.success(`${data.steps.length} execution steps generated!`);
    } catch (err) {
      toast.error("Failed to generate trace. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const step = steps[currentStep];
  const progress = steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0;

  const codeLines = code.split("\n");

  return (
    <div className="h-full flex flex-col pb-4">
      <Toaster position="top-right" />

      <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Play className="text-violet-400" /> Execution Flow Visualizer
          </h1>
          <p className="text-slate-400 mt-1">Step through your code and watch variables change in real-time.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-1 p-1 glass-panel rounded-xl">
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                  language === lang
                    ? "bg-violet-500/30 text-violet-300 border border-violet-500/50"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerateTrace}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 text-white font-bold rounded-xl transition-all shadow-lg"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {isLoading ? "Tracing..." : "Generate Trace"}
          </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        {/* Code Editor Panel */}
        <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2 text-sm text-slate-400 font-medium">
            <Code2 className="w-4 h-4" /> Code Editor
          </div>
          <div className="flex-1 flex">
            {/* Line numbers highlight */}
            <div className="w-10 flex-shrink-0 bg-black/20 border-r border-white/5 pt-4 pb-4">
              {codeLines.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-[19px] flex items-center justify-center text-xs transition-all ${
                    hasTrace && step && step.lineNumber === idx + 1
                      ? "bg-violet-500/30 text-violet-300 font-bold"
                      : "text-slate-600"
                  }`}
                >
                  {idx + 1}
                </div>
              ))}
            </div>
            <div className="flex-1">
              <Editor
                language={language === "C++" ? "cpp" : language.toLowerCase()}
                value={code}
                onChange={(val) => { setCode(val || ""); setHasTrace(false); }}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: "off",
                  padding: { top: 16 },
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col gap-4 min-h-0">
          {/* Explanation + Controls */}
          <div className="glass-panel rounded-2xl border border-white/10 p-5">
            {hasTrace && step ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">
                      Step {currentStep + 1} of {steps.length} — Line {step.lineNumber}
                    </span>
                  </div>
                  <p className="text-white leading-relaxed mb-4">{step.explanation}</p>
                  {/* Progress bar */}
                  <div className="w-full bg-white/5 rounded-full h-1.5 mb-4">
                    <div
                      className="bg-violet-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  {/* Controls */}
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => setCurrentStep(0)}
                      disabled={currentStep === 0}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-all"
                    >
                      <SkipForward className="w-4 h-4 rotate-180 text-white" />
                    </button>
                    <button
                      onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
                      disabled={currentStep === 0}
                      className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-all text-white font-medium text-sm"
                    >
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </button>
                    <button
                      onClick={() => setCurrentStep(s => Math.min(steps.length - 1, s + 1))}
                      disabled={currentStep === steps.length - 1}
                      className="flex items-center gap-1 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-30 transition-all text-white font-bold text-sm"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentStep(steps.length - 1)}
                      disabled={currentStep === steps.length - 1}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-all"
                    >
                      <SkipForward className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="text-center text-slate-500 py-4">
                <Play className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Click "Generate Trace" to start the visualization.</p>
              </div>
            )}
          </div>

          {/* Variables Panel */}
          <div className="glass-panel rounded-2xl border border-white/10 flex-1 flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2 text-sm text-slate-400 font-medium">
              <Database className="w-4 h-4" /> Memory — Variables
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {hasTrace && step && Object.keys(step.variables).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(step.variables).map(([key, val]) => (
                    <motion.div
                      key={key}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 bg-black/30 rounded-xl border border-white/5"
                    >
                      <span className="font-mono text-violet-300 font-bold text-sm">{key}</span>
                      <span className="font-mono text-emerald-400 text-sm bg-emerald-400/10 px-2 py-0.5 rounded">{val}</span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-slate-600 text-sm py-6">
                  No variables in scope yet.
                </div>
              )}
            </div>
          </div>

          {/* Output Panel */}
          <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2 text-sm text-slate-400 font-medium">
              <Terminal className="w-4 h-4" /> Console Output
            </div>
            <div className="p-4 font-mono text-sm text-emerald-400 bg-black/30 min-h-[60px]">
              {hasTrace && step && step.output ? (
                <pre className="whitespace-pre-wrap">{step.output}</pre>
              ) : (
                <span className="text-slate-600">No output yet.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
