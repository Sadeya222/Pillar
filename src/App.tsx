import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  ChartNoAxesCombined,
  Code2,
  Menu,
  Megaphone,
  Orbit,
  Quote,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from "react";
import { AIAssistant } from "./components/AIAssistant";
import { HeroScene } from "./components/HeroScene";
import { MagneticButton } from "./components/MagneticButton";
import { useMediaPreferences } from "./hooks/useMediaPreferences";

gsap.registerPlugin(ScrollTrigger);

interface Service {
  id: string;
  index: string;
  title: string;
  shortTitle: string;
  description: string;
  perspective: string;
  capabilities: string[];
  icon: LucideIcon;
}

const services: Service[] = [
  {
    id: "paid-social",
    index: "01",
    title: "Paid Social & Meta Ads",
    shortTitle: "Paid Social",
    description:
      "Data-driven campaign management, precision audience targeting, creative asset optimization, and scalable ROI tracking across Meta and TikTok.",
    perspective:
      "We turn acquisition into a controlled learning system, pairing daily media decisions with creative intelligence so your budget compounds rather than plateaus.",
    capabilities: ["Media architecture", "Creative testing systems", "Attribution and reporting"],
    icon: Megaphone,
  },
  {
    id: "brand-strategy",
    index: "02",
    title: "Social Growth & Brand Strategy",
    shortTitle: "Brand Growth",
    description:
      "End-to-end content architecture, visual identity positioning, community engagement strategies, and organic audience development.",
    perspective:
      "We define the signals your brand should own, then build a repeatable editorial engine that earns relevance, trust, and long-term audience equity.",
    capabilities: ["Brand positioning", "Content ecosystems", "Community growth"],
    icon: Orbit,
  },
  {
    id: "web-engineering",
    index: "03",
    title: "Web Engineering & Digital Products",
    shortTitle: "Web Engineering",
    description:
      "High-conversion web platforms, custom digital experiences, performant full-stack applications, and interactive WebGL interfaces.",
    perspective:
      "Strategy, design, and engineering work as one product team. Every interaction is made to feel considered, load quickly, and move a customer forward.",
    capabilities: ["Product strategy and UX", "Full-stack development", "WebGL and interaction"],
    icon: Code2,
  },
  {
    id: "growth-consulting",
    index: "04",
    title: "Performance Strategy & Growth Consulting",
    shortTitle: "Growth Strategy",
    description:
      "Full-funnel conversion rate optimization, analytics auditing, digital attribution modeling, and growth architecture.",
    perspective:
      "We locate the friction between attention and revenue, align your data around decisions, and give internal teams a pragmatic roadmap for durable growth.",
    capabilities: ["CRO experimentation", "Analytics and attribution", "Growth operating models"],
    icon: ChartNoAxesCombined,
  },
];

const testimonials = [
  {
    metric: "4.7x",
    metricLabel: "blended return",
    quote:
      "Digital Pillars gave us more than a campaign. They rebuilt the decision system behind our growth and made every channel smarter.",
    name: "Maya Chen",
    title: "VP Growth, Luma Health",
  },
  {
    metric: "+186%",
    metricLabel: "qualified pipeline",
    quote:
      "The rare partner that can hold brand nuance and commercial performance in the same room. The work was beautiful, fast, and accountable.",
    name: "Julian Foster",
    title: "Co-founder, Northstar Labs",
  },
  {
    metric: "38%",
    metricLabel: "higher conversion",
    quote:
      "Their product team found the friction we had stopped seeing. Our new platform feels radically simpler and performs on another level.",
    name: "Amara Okafor",
    title: "Chief Digital Officer, Vela",
  },
];

function useAnimatedNumber(end: number, decimals: number, reducedMotion: boolean) {
  const [value, setValue] = useState(reducedMotion ? end : 0);

  useEffect(() => {
    if (reducedMotion) {
      setValue(end);
      return;
    }
    let frame = 0;
    const delay = window.setTimeout(() => {
      const start = performance.now();
      const animate = (time: number) => {
        const progress = Math.min((time - start) / 1500, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        setValue(Number((end * eased).toFixed(decimals)));
        if (progress < 1) frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
    }, 850);

    return () => {
      window.clearTimeout(delay);
      cancelAnimationFrame(frame);
    };
  }, [decimals, end, reducedMotion]);

  return value.toFixed(decimals);
}

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

function HeroMetric({
  value,
  decimals,
  prefix,
  label,
  path,
  reducedMotion,
}: {
  value: number;
  decimals: number;
  prefix?: string;
  label: string;
  path: string;
  reducedMotion: boolean;
}) {
  const animatedValue = useAnimatedNumber(value, decimals, reducedMotion);
  return (
    <div className="hero-metric hero-reveal">
      <div className="hero-metric__topline">
        <span className="hero-metric__dot" aria-hidden="true" />
        <span>Live performance</span>
      </div>
      <div className="hero-metric__value">
        {prefix}{animatedValue}<span>%</span>
      </div>
      <div className="hero-metric__footer">
        <p>{label}</p>
        <svg viewBox="0 0 112 35" role="img" aria-label={`${label} upward trend`}>
          <defs>
            <linearGradient id={`gradient-${value}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#7c3aed" stopOpacity="0.2" />
              <stop offset="1" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
          <path d={path} fill="none" stroke={`url(#gradient-${value})`} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
    </div>
  );
}

function ServicePanel({ service, disableTilt }: { service: Service; disableTilt: boolean }) {
  const panel = useRef<HTMLAnchorElement>(null);
  const Icon = service.icon;

  const handleMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (disableTilt || !panel.current) return;
    const bounds = panel.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    panel.current.style.transform = `perspective(1200px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg) translate3d(0,-3px,0)`;
    panel.current.style.setProperty("--glow-x", `${(x + 0.5) * 100}%`);
    panel.current.style.setProperty("--glow-y", `${(y + 0.5) * 100}%`);
  };

  const handleLeave = () => {
    if (panel.current) panel.current.style.transform = "perspective(1200px) rotateX(0) rotateY(0) translate3d(0,0,0)";
  };

  return (
    <div className="service-panel-wrap" data-reveal data-perspective>
      <a
        ref={panel}
        id={service.id}
        className="service-panel"
        href="#contact"
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        aria-label={`Discuss ${service.title}`}
      >
        <span className="service-panel__glow" aria-hidden="true" />
        <div className="service-panel__number">{service.index}</div>
        <div className="service-panel__heading">
          <span className="service-panel__icon"><Icon size={19} strokeWidth={1.5} aria-hidden="true" /></span>
          <h3>{service.title}</h3>
        </div>
        <div className="service-panel__copy">
          <p className="service-panel__lead">{service.description}</p>
          <p>{service.perspective}</p>
        </div>
        <ul className="service-panel__capabilities" aria-label={`${service.title} capabilities`}>
          {service.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
        </ul>
        <span className="service-panel__arrow" aria-hidden="true"><ArrowUpRight size={21} /></span>
      </a>
    </div>
  );
}

function Header({ reducedMotion, coarsePointer }: { reducedMotion: boolean; coarsePointer: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <a href="#top" className="site-logo" aria-label="Digital Pillars home">
        <BrandMark />
        <span>Digital Pillars</span>
      </a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        <a href="#services">Services</a>
        <a href="#approach">Approach</a>
        <a href="#testimonials">Client stories</a>
      </nav>
      <MagneticButton
        href="#contact"
        className="header-cta"
        disabled={reducedMotion || coarsePointer}
      >
        Start a project <ArrowUpRight size={15} aria-hidden="true" />
      </MagneticButton>
      <button
        type="button"
        className="menu-button"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <div
        className={`mobile-nav ${menuOpen ? "mobile-nav--open" : ""}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <nav aria-label="Mobile navigation">
          <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#approach" onClick={() => setMenuOpen(false)}>Approach</a>
          <a href="#testimonials" onClick={() => setMenuOpen(false)}>Client stories</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Start a project <ArrowUpRight size={18} /></a>
        </nav>
      </div>
    </header>
  );
}

function App() {
  const root = useRef<HTMLDivElement>(null);
  const { isCoarsePointer, prefersReducedMotion } = useMediaPreferences();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.08,
      easing: (time: number) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
      smoothWheel: true,
      syncTouch: false,
    });
    const update = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, [prefersReducedMotion]);

  useLayoutEffect(() => {
    if (!root.current) return;

    if (prefersReducedMotion) {
      gsap.set(".loading-screen", { display: "none" });
      gsap.set(".hero-reveal", { opacity: 1, y: 0 });
      return;
    }

    const context = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .to(".loader-progress__fill", { scaleX: 1, duration: 0.7, ease: "power2.inOut" })
        .to(".loading-screen", { yPercent: -100, duration: 0.8, ease: "power4.inOut" })
        .fromTo(".site-header", { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.65 }, "-=0.34")
        .fromTo(
          ".hero-copy > *",
          { opacity: 0, y: 34 },
          { opacity: 1, y: 0, duration: 0.78, stagger: 0.09 },
          "-=0.45",
        )
        .fromTo(
          ".hero-metric",
          { opacity: 0, y: 24, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.62, stagger: 0.13 },
          "-=0.5",
        );

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 48, rotateX: element.hasAttribute("data-perspective") ? 3 : 0 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 86%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
        gsap.fromTo(
          element,
          { yPercent: -7 },
          {
            yPercent: 7,
            ease: "none",
            scrollTrigger: { trigger: element, start: "top bottom", end: "bottom top", scrub: 0.8 },
          },
        );
      });
    }, root);

    return () => context.revert();
  }, [prefersReducedMotion]);

  const motionDisabled = prefersReducedMotion || isCoarsePointer;

  return (
    <div ref={root} className="site-shell" id="top">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="loading-screen" aria-hidden="true">
        <div className="loading-screen__brand"><BrandMark /> Digital Pillars</div>
        <div className="loader-progress"><span className="loader-progress__fill" /></div>
      </div>

      <Header reducedMotion={prefersReducedMotion} coarsePointer={isCoarsePointer} />

      <main id="main-content">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__scene hero-reveal">
            <HeroScene
              isCoarsePointer={isCoarsePointer}
              prefersReducedMotion={prefersReducedMotion}
            />
          </div>
          <div className="hero__vignette" aria-hidden="true" />
          <div className="hero-copy">
            <div className="hero-copy__signal"><span /> Independent growth studio / 2026</div>
            <h1 id="hero-title"><span>Digital</span><span>Pillars.</span></h1>
            <p>We engineer category-defining brands, products, and growth systems for ambitious companies.</p>
            <div className="hero-actions">
              <MagneticButton
                href="#contact"
                className="button button--primary"
                disabled={motionDisabled}
              >
                Build what is next <ArrowUpRight size={17} aria-hidden="true" />
              </MagneticButton>
              <a className="button button--text" href="#services">
                Explore our work <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="hero-metrics" aria-label="Selected performance metrics">
            <HeroMetric
              value={340}
              decimals={0}
              prefix="+"
              label="Return on ad spend"
              path="M1 30 C 15 29, 18 23, 30 25 S 48 18, 58 20 S 72 13, 82 15 S 97 6, 111 3"
              reducedMotion={prefersReducedMotion}
            />
            <HeroMetric
              value={99.4}
              decimals={1}
              label="Client retention"
              path="M1 29 C 12 27, 19 29, 29 22 S 45 24, 57 17 S 70 20, 81 12 S 99 11, 111 4"
              reducedMotion={prefersReducedMotion}
            />
          </div>
          <div className="hero__scroll-cue hero-reveal" aria-hidden="true">
            <span>Scroll to explore</span><i />
          </div>
        </section>

        <section className="manifesto section-shell" id="approach" aria-labelledby="manifesto-title">
          <div className="section-label" data-reveal><span>Our point of view</span><span>Strategy / Design / Technology</span></div>
          <div className="manifesto__content">
            <h2 id="manifesto-title" data-reveal>
              Growth is not a channel.<br />
              It is an <span>engineered system.</span>
            </h2>
            <div className="manifesto__aside" data-reveal>
              <p>
                Digital Pillars unifies the disciplines that usually compete for context. One senior team,
                from the first strategic question to the final performance signal.
              </p>
              <a href="#services">See how we work <ArrowRight size={16} aria-hidden="true" /></a>
            </div>
          </div>
        </section>

        <section className="services section-shell" id="services" aria-labelledby="services-title">
          <div className="services__intro">
            <div>
              <p className="eyebrow" data-reveal>Integrated expertise</p>
              <h2 id="services-title" data-reveal>Four disciplines.<br />One growth architecture.</h2>
            </div>
            <p data-reveal>
              Engage one capability or bring the whole studio to your hardest growth problem.
              Every partnership is senior-led and built around measurable progress.
            </p>
          </div>

          <nav className="service-index" aria-label="Service destinations" data-reveal>
            {services.map((service) => (
              <a href={`#${service.id}`} key={service.id}>
                <span>{service.index}</span>{service.shortTitle}
              </a>
            ))}
          </nav>

          <div className="service-list">
            {services.map((service) => (
              <ServicePanel service={service} disableTilt={motionDisabled} key={service.id} />
            ))}
          </div>
        </section>

        <section className="outcome" aria-labelledby="outcome-title">
          <div className="outcome__orb" data-parallax aria-hidden="true" />
          <div className="outcome__inner section-shell">
            <div className="section-label section-label--light" data-reveal>
              <span>Built for the inflection point</span><span>Selected client outcome</span>
            </div>
            <div className="outcome__content">
              <div data-reveal>
                <span className="outcome__number">4.7</span><span className="outcome__unit">x</span>
              </div>
              <div className="outcome__statement" data-reveal>
                <BarChart3 size={25} strokeWidth={1.4} aria-hidden="true" />
                <h2 id="outcome-title">Blended return, after rebuilding the full acquisition journey.</h2>
                <p>Strategy, creative, media, and landing experience operating as one compounding system.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="testimonials section-shell" id="testimonials" aria-labelledby="testimonials-title">
          <div className="testimonials__header">
            <div>
              <p className="eyebrow" data-reveal>Client stories</p>
              <h2 id="testimonials-title" data-reveal>Trusted where the<br />stakes are highest.</h2>
            </div>
            <p data-reveal>Long-term partners to leaders building the next version of their business.</p>
          </div>

          <div className="testimonial-grid">
            {testimonials.map((testimonial, index) => (
              <article className="testimonial" data-reveal key={testimonial.name}>
                <div className="testimonial__top">
                  <span className="testimonial__metric">{testimonial.metric}</span>
                  <span className="testimonial__label">{testimonial.metricLabel}</span>
                  <Quote size={22} strokeWidth={1.25} aria-hidden="true" />
                </div>
                <blockquote>&quot;{testimonial.quote}&quot;</blockquote>
                <footer>
                  <div className={`testimonial__avatar testimonial__avatar--${index + 1}`} aria-hidden="true">
                    {testimonial.name.split(" ").map((part) => part[0]).join("")}
                  </div>
                  <div><strong>{testimonial.name}</strong><span>{testimonial.title}</span></div>
                </footer>
              </article>
            ))}
          </div>
        </section>

        <section className="contact section-shell" id="contact" aria-labelledby="contact-title">
          <div className="contact__signal" data-reveal><span /> Accepting select partnerships for Q2 2026</div>
          <div className="contact__main">
            <h2 id="contact-title" data-reveal>Let's build your<br /><span>next pillar.</span></h2>
            <MagneticButton
              href="mailto:hello@digitalpillars.agency"
              className="contact__button"
              ariaLabel="Email Digital Pillars to start a project"
              disabled={motionDisabled}
            >
              <span>Start a project</span><ArrowUpRight size={25} aria-hidden="true" />
            </MagneticButton>
          </div>
          <div className="contact__footer">
            <a href="mailto:hello@digitalpillars.agency">hello@digitalpillars.agency</a>
            <div><a href="#top">Instagram</a><a href="#top">LinkedIn</a><a href="#top">Privacy</a></div>
            <p>Digital Pillars Ltd. / 2026</p>
          </div>
        </section>
      </main>

      <AIAssistant />
    </div>
  );
}

export default App;
