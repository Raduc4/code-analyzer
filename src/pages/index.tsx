import { useState } from "react";

import { Code2, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="h-screen flex flex-col">
      <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-3">
        <Code2 className="w-6 h-6 text-primary" />
        {/* <h1 className="text-lg font-semibold">{projectName}</h1> */}
        <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>AI Code Review</span>
        </div>
      </header>

    
    </div>
  );
};

export default Index;