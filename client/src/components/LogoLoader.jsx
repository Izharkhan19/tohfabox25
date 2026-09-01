export default function LogoLoader({ label = 'Loading...', compact = false }) {
    return (
        <div className={`flex flex-col items-center justify-center ${compact ? 'gap-2' : 'gap-4'}`} role="status" aria-live="polite">
            <div className={`relative flex items-center justify-center ${compact ? 'h-12 w-12' : 'h-24 w-24'}`}>
                <span className="absolute inset-0 rounded-full border-2 border-resin-gold/25 border-t-resin-gold animate-spin" aria-hidden="true" />
                <span className="absolute inset-2 rounded-full border border-resin-blue/15" aria-hidden="true" />
                <img
                    src="/logo.png"
                    alt=""
                    className={`relative rounded-full bg-white object-contain shadow-lg logo-loader-mark ${compact ? 'h-8 w-8' : 'h-16 w-16'}`}
                />
            </div>
            <span className={`font-semibold uppercase tracking-[0.2em] text-resin-blue ${compact ? 'text-[10px]' : 'text-xs'}`}>
                {label}
            </span>
        </div>
    );
}
