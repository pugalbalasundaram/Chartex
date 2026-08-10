export default function HeroBackground() {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.18),transparent_55%)]" />

      <div className="absolute left-20 top-32 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="absolute right-20 bottom-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
    </>
  );
}