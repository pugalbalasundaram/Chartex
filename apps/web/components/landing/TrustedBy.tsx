import Container from "@/components/common/Container";

const companies = [
  "Microsoft",
  "Amazon",
  "Google",
  "Netflix",
  "Spotify",
];

export default function TrustedBy() {
  return (
    <section className="border-y border-white/5 bg-slate-950 py-16">
      <Container>
        <p className="mb-10 text-center text-sm uppercase tracking-[0.35em] text-slate-500">
          Inspired by modern data teams
        </p>

        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-5">
          {companies.map((company) => (
            <div
              key={company}
              className="text-lg font-semibold text-slate-400 transition hover:text-cyan-400"
            >
              {company}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}