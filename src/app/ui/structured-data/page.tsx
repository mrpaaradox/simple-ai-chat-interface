"use client";

import { useState } from "react";
import Link from "next/link";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { recipeSchema } from "@/app/api/structured-data/schema";

import { 
  MessageSquare, 
  Table, 
  Zap, 
  ChefHat, 
  Info,
  ArrowLeft,
  Loader2,
  StopCircle,
  SendHorizontal
} from "lucide-react";

export default function StructuredDataPage() {
  const [dishName, setDishName] = useState("");

  const { submit, object, isLoading, error, stop } = useObject({
    api: "/api/structured-data",
    schema: recipeSchema,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName || isLoading) return;
    submit({ dish: dishName });
    setDishName("");
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Header / Navigation */}
      <header className="flex-none border-b border-border bg-background/95 backdrop-blur-sm z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="p-2 hover:bg-accent rounded-full transition-colors"
              title="Back to Home"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-2">
              <Table className="text-primary w-5 h-5" />
              <h1 className="font-semibold text-lg hidden sm:block">Structured Data</h1>
            </div>
          </div>


          <nav className="flex items-center gap-2">

          </nav>
        </div>
      </header>

      {/* Scrollable Main Area */}
      <main className="flex-1 overflow-y-auto scroll-smooth">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          {/* Error State */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3">
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error.message}</p>
            </div>
          )}

          {/* Recipe Results */}
          {object?.recipe ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground text-sm uppercase tracking-wider font-semibold">
                  <ChefHat size={14} />
                  <span>Generated Recipe</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{object.recipe.name}</h2>
              </div>

              {/* Ingredients Card */}
              {object.recipe.ingredients && (
                <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    Ingredients
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {object.recipe.ingredients.map((ingredient, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50"
                      >
                        <span className="font-medium">{ingredient?.name}</span>
                        <span className="text-muted-foreground text-sm">{ingredient?.amount}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Steps Card */}
              {object.recipe.steps && (
                <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-6">Preparation Steps</h3>
                  <div className="space-y-4">
                    {object.recipe.steps.map((step, index) => (
                      <div key={index} className="flex gap-4 p-2">
                        <div className="flex-none w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <p className="text-muted-foreground leading-relaxed pt-1">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 text-muted-foreground">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                <Table size={32} className="opacity-50" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-medium text-foreground">No recipe generated</h3>
                <p className="text-sm max-w-[250px]">
                  Enter a dish name below to get a structured recipe with ingredients and steps.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Input Area (Bottom docked) */}
      <div className="flex-none border-t border-border bg-background/80 backdrop-blur-lg p-4 md:p-6">
        <form
          onSubmit={handleSubmit}
          className="container mx-auto max-w-3xl relative"
        >
          <div className="relative group">
            <input
              type="text"
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              placeholder="What recipe are you looking for?"
              autoFocus
              className="w-full h-14 pl-4 pr-32 bg-secondary/50 border border-input rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base placeholder:text-muted-foreground"
            />
            <div className="absolute right-2 top-2 flex gap-2">
              {isLoading ? (
                <button
                  type="button"
                  onClick={stop}
                  className="h-10 px-4 bg-destructive text-destructive-foreground rounded-xl flex items-center gap-2 hover:bg-destructive/90 transition-colors shadow-lg"
                >
                  <StopCircle size={18} />
                  <span className="text-sm font-medium hidden sm:inline">Stop</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!dishName || isLoading}
                  className="h-10 px-4 bg-primary text-primary-foreground rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <SendHorizontal size={18} />
                  )}
                  <span className="text-sm font-medium hidden sm:inline">
                    {isLoading ? "Thinking..." : "Generate"}
                  </span>
                </button>
              )}
            </div>
          </div>
          <p className="mt-2 text-[10px] text-center text-muted-foreground uppercase tracking-widest sm:hidden">
            Press enter to generate
          </p>
        </form>
      </div>
    </div>
  );
}