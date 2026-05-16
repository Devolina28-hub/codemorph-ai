"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Box, Car, Shield, Fingerprint, Repeat, Puzzle, Zap, ChevronRight, Terminal } from "lucide-react";

const OOPS_CONCEPTS = [
  {
    id: "class",
    title: "Class",
    icon: Box,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "border-blue-400/20",
    gradient: "from-blue-600/20 to-transparent",
    definition: "A blueprint or template for creating objects. It defines the properties (attributes) and behaviors (methods) that the objects will have.",
    analogy: "Think of a Class as an architectural blueprint for a house. You can't live inside a blueprint, but it tells the builders exactly how to construct the actual house.",
    visual: (
      <div className="flex justify-center items-center p-8 bg-black/30 rounded-xl border border-white/5">
        <div className="border-2 border-dashed border-blue-400 rounded-lg p-6 w-64 text-center relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0f172a] px-2 text-blue-400 font-bold text-sm">Blueprint (Class)</div>
          <div className="text-slate-300 text-sm mb-4 bg-white/5 py-1 px-2 rounded">Attributes: color, model</div>
          <div className="text-slate-300 text-sm bg-white/5 py-1 px-2 rounded">Methods: drive(), stop()</div>
        </div>
      </div>
    ),
    codeSnippet: `class Car {
  string color;
  string model;

  void drive() {
    cout << "Vroom!" << endl;
  }
}`
  },
  {
    id: "object",
    title: "Object",
    icon: Car,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    borderColor: "border-emerald-400/20",
    gradient: "from-emerald-600/20 to-transparent",
    definition: "An instance of a class. It is a real-world entity that takes up space in memory and has the specific values defined by the class blueprint.",
    analogy: "If the Class is the blueprint, the Object is the actual, physical house built from that blueprint. You can build many houses (objects) from one blueprint (class).",
    visual: (
      <div className="flex justify-center items-center p-8 bg-black/30 rounded-xl border border-white/5 gap-8">
        <div className="border border-emerald-500 bg-emerald-500/20 rounded-lg p-4 w-48 text-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <div className="text-white font-bold mb-2">Object 1</div>
          <div className="text-emerald-200 text-xs">color: "Red"</div>
          <div className="text-emerald-200 text-xs">model: "Mustang"</div>
        </div>
        <div className="border border-emerald-500 bg-emerald-500/20 rounded-lg p-4 w-48 text-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <div className="text-white font-bold mb-2">Object 2</div>
          <div className="text-emerald-200 text-xs">color: "Blue"</div>
          <div className="text-emerald-200 text-xs">model: "Civic"</div>
        </div>
      </div>
    ),
    codeSnippet: `// Creating objects from the Car class
Car myMustang = new Car();
myMustang.color = "Red";

Car myCivic = new Car();
myCivic.color = "Blue";`
  },
  {
    id: "inheritance",
    title: "Inheritance",
    icon: Repeat,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    borderColor: "border-purple-400/20",
    gradient: "from-purple-600/20 to-transparent",
    definition: "A mechanism where one class acquires the properties and behaviors of another class. It promotes code reusability.",
    analogy: "Just like a child inherits traits (like eye color) from their parents, a 'Child Class' inherits attributes and methods from a 'Parent Class'.",
    visual: (
      <div className="flex flex-col justify-center items-center p-8 bg-black/30 rounded-xl border border-white/5 gap-4">
        <div className="border border-purple-500 bg-purple-500/20 rounded-lg p-3 w-48 text-center">
          <div className="text-white font-bold text-sm">Parent: Animal</div>
          <div className="text-purple-200 text-xs">eat(), sleep()</div>
        </div>
        <div className="w-[2px] h-6 bg-purple-500"></div>
        <div className="flex gap-4">
          <div className="border border-purple-400 border-t-4 rounded-lg p-3 w-32 text-center">
            <div className="text-white font-bold text-sm">Dog</div>
            <div className="text-purple-200 text-xs">bark()</div>
          </div>
          <div className="border border-purple-400 border-t-4 rounded-lg p-3 w-32 text-center">
            <div className="text-white font-bold text-sm">Cat</div>
            <div className="text-purple-200 text-xs">meow()</div>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-2">Dog & Cat both automatically can eat() and sleep()!</p>
      </div>
    ),
    codeSnippet: `class Animal {
  void eat() { cout << "Eating"; }
}

// Dog inherits from Animal
class Dog extends Animal {
  void bark() { cout << "Woof!"; }
}

Dog d1 = new Dog();
d1.eat(); // Inherited method!`
  },
  {
    id: "encapsulation",
    title: "Encapsulation",
    icon: Shield,
    color: "text-red-400",
    bgColor: "bg-red-400/10",
    borderColor: "border-red-400/20",
    gradient: "from-red-600/20 to-transparent",
    definition: "The bundling of data (attributes) and methods that operate on the data into a single unit (class), and restricting direct access to some of the object's components.",
    analogy: "Think of a medical capsule. The medicine (data) is hidden and protected inside the shell (methods). You just swallow the capsule, you don't mess with the powder inside directly.",
    visual: (
      <div className="flex justify-center items-center p-8 bg-black/30 rounded-xl border border-white/5">
        <div className="relative w-48 h-48 rounded-full border-4 border-red-500 bg-red-500/10 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <div className="absolute top-2 bg-black px-2 text-red-400 text-xs font-bold">Public Methods (Get/Set)</div>
          <div className="w-24 h-24 rounded-full bg-red-500/40 flex items-center justify-center border border-red-500">
            <div className="text-center">
              <Shield className="w-6 h-6 mx-auto text-white mb-1" />
              <span className="text-white text-xs font-bold">Private Data</span>
            </div>
          </div>
        </div>
      </div>
    ),
    codeSnippet: `class BankAccount {
  private:
    double balance; // Hidden data

  public:
    void deposit(double amount) { // Public method to access data safely
      if(amount > 0) balance += amount;
    }
}`
  },
  {
    id: "polymorphism",
    title: "Polymorphism",
    icon: Puzzle,
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
    borderColor: "border-orange-400/20",
    gradient: "from-orange-600/20 to-transparent",
    definition: "The ability of different objects to respond in their own way to the same method call.",
    analogy: "Think of the command 'Speak!'. If you tell a Dog to speak, it barks. If you tell a Duck to speak, it quacks. Same command, different behaviors depending on who receives it.",
    visual: (
      <div className="flex flex-col justify-center items-center p-8 bg-black/30 rounded-xl border border-white/5 gap-6">
        <div className="bg-orange-500/20 px-6 py-2 rounded-full border border-orange-500 text-orange-400 font-bold">
          Command: speak()
        </div>
        <div className="flex gap-8 w-full justify-center">
          <div className="flex flex-col items-center">
             <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl mb-2 border border-white/20">🐶</div>
             <div className="bg-black border border-orange-500/50 text-slate-300 text-xs px-3 py-1 rounded">"Woof Woof!"</div>
          </div>
          <div className="flex flex-col items-center">
             <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl mb-2 border border-white/20">🦆</div>
             <div className="bg-black border border-orange-500/50 text-slate-300 text-xs px-3 py-1 rounded">"Quack!"</div>
          </div>
        </div>
      </div>
    ),
    codeSnippet: `class Animal {
  virtual void speak() = 0;
}

class Dog : public Animal {
  void speak() { cout << "Woof!"; }
}

class Duck : public Animal {
  void speak() { cout << "Quack!"; }
}`
  }
];

export default function OOPS() {
  const [activeId, setActiveId] = useState(OOPS_CONCEPTS[0].id);

  const activeConcept = OOPS_CONCEPTS.find(c => c.id === activeId)!;

  return (
    <div className="h-full flex flex-col pb-10">
      <header className="mb-8">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <Layers className="text-violet-400 w-10 h-10" /> 
          Visual OOPS Learning System
        </h1>
        <p className="text-slate-400 mt-2">Master Object-Oriented Programming concepts through interactive visual analogies.</p>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        {/* Sidebar */}
        <div className="w-full lg:w-72 flex flex-col gap-2">
          {OOPS_CONCEPTS.map((concept) => {
            const isActive = concept.id === activeId;
            const Icon = concept.icon;
            return (
              <button
                key={concept.id}
                onClick={() => setActiveId(concept.id)}
                className={`flex items-center justify-between p-4 rounded-xl transition-all border ${
                  isActive 
                    ? `${concept.bgColor} ${concept.borderColor} border` 
                    : 'bg-black/20 border-white/5 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-black/40 shadow-inner' : 'bg-black/20'}`}>
                    <Icon className={`w-5 h-5 ${isActive ? concept.color : 'text-slate-500'}`} />
                  </div>
                  <span className={`font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>
                    {concept.title}
                  </span>
                </div>
                {isActive && <ChevronRight className={`w-5 h-5 ${concept.color}`} />}
              </button>
            )
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 relative overflow-hidden glass-panel rounded-2xl border border-white/10 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeConcept.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 overflow-y-auto"
            >
              {/* Header Gradient */}
              <div className={`h-32 bg-gradient-to-b ${activeConcept.gradient} relative`}>
                <div className={`absolute -bottom-6 left-8 p-4 rounded-2xl bg-black border ${activeConcept.borderColor} shadow-xl`}>
                   <activeConcept.icon className={`w-8 h-8 ${activeConcept.color}`} />
                </div>
              </div>

              <div className="p-8 pt-12">
                <h2 className="text-3xl font-bold text-white mb-6">{activeConcept.title}</h2>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Definition</h3>
                      <p className="text-slate-300 leading-relaxed text-lg">{activeConcept.definition}</p>
                    </div>
                    
                    <div className={`${activeConcept.bgColor} border ${activeConcept.borderColor} rounded-xl p-6`}>
                      <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${activeConcept.color}`}>
                        <Zap className="w-4 h-4" /> Real-Life Analogy
                      </h3>
                      <p className="text-white leading-relaxed italic">"{activeConcept.analogy}"</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                     <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Visual Representation</h3>
                     {activeConcept.visual}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Terminal className="w-4 h-4" /> Code Example
                  </h3>
                  <div className="bg-[#1e1e1e] border border-white/10 rounded-xl p-6 overflow-x-auto shadow-inner">
                    <pre className="font-mono text-sm text-slate-300">
                      <code>{activeConcept.codeSnippet}</code>
                    </pre>
                  </div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
