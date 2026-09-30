export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#12343b] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <img 
        src="/splash.png" 
        alt="Artistary Crafts" 
        className="absolute inset-0 w-full h-full object-cover opacity-40 animate-pulse"
      />
      
      {/* Loading Spinner & Text */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-[#e1b382] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(225,179,130,0.5)]"></div>
        <h2 className="mt-6 text-[#e1b382] text-2xl font-serif font-bold tracking-[0.2em] uppercase drop-shadow-lg">
          Artistary Crafts
        </h2>
        <p className="mt-2 text-[#fdfbf9] font-light tracking-wide text-sm">
          Crafting your experience...
        </p>
      </div>
    </div>
  );
}
