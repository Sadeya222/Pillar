import { ArrowUpRight, Bot, ChevronDown, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const faqs = [
  {
    question: "What services do you offer?",
    answer:
      "We connect paid acquisition, brand strategy, web engineering, and growth consulting into one accountable growth system. Each engagement is shaped around the constraint holding your next stage back.",
  },
  {
    question: "How do I get started?",
    answer:
      "Book a 30-minute discovery call. We will map your current stack, identify the highest-leverage opportunity, and send a focused scope with milestones within two business days.",
  },
  {
    question: "What is your typical turnaround?",
    answer:
      "Strategy sprints typically take 2-3 weeks, campaign launches 3-5 weeks, and engineered digital products 8-14 weeks. You will receive a precise delivery plan before work begins.",
  },
  {
    question: "What is your pricing structure?",
    answer:
      "We use fixed project scopes for builds and monthly partnerships for continuous growth. Most engagements begin at $8k, with investment tied to team depth, speed, and measurable outcomes.",
  },
];

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<number | null>(0);
  const panel = useRef<HTMLElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const triggerButton = useRef<HTMLButtonElement>(null);
  const hasOpened = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      if (hasOpened.current) triggerButton.current?.focus({ preventScroll: true });
      return;
    }

    hasOpened.current = true;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }

      if (event.key === "Tab" && panel.current) {
        const focusable = Array.from(
          panel.current.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]"),
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    closeButton.current?.focus();
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  return (
    <>
      <button
        ref={triggerButton}
        type="button"
        className={`assistant-trigger ${isOpen ? "assistant-trigger--hidden" : ""}`}
        aria-label="Open AI Assistant"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        <Sparkles size={16} aria-hidden="true" />
        <span>AI Assistant</span>
        <span className="assistant-trigger__status" aria-hidden="true" />
      </button>

      <div
        className={`assistant-backdrop ${isOpen ? "assistant-backdrop--open" : ""}`}
        aria-hidden="true"
        onClick={() => setIsOpen(false)}
      />
      <aside
        ref={panel}
        className={`assistant-panel ${isOpen ? "assistant-panel--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
        aria-labelledby="assistant-title"
        inert={!isOpen}
      >
        <div className="assistant-panel__header">
          <div className="assistant-panel__identity">
            <span className="assistant-panel__icon"><Bot size={19} aria-hidden="true" /></span>
            <div>
              <p className="assistant-panel__eyebrow">Digital Pillars</p>
              <h2 id="assistant-title">How can we help?</h2>
            </div>
          </div>
          <button
            ref={closeButton}
            type="button"
            className="icon-button"
            aria-label="Close AI Assistant"
            onClick={() => setIsOpen(false)}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <p className="assistant-panel__intro">
          Explore the essentials. Select a question for a quick answer from our studio team.
        </p>

        <div className="assistant-faqs">
          {faqs.map((faq, index) => {
            const isActive = activeQuestion === index;
            return (
              <div className={`assistant-faq ${isActive ? "assistant-faq--active" : ""}`} key={faq.question}>
                <button
                  type="button"
                  aria-expanded={isActive}
                  aria-controls={`faq-answer-${index}`}
                  onClick={() => setActiveQuestion(isActive ? null : index)}
                >
                  <span>{faq.question}</span>
                  <ChevronDown size={17} aria-hidden="true" />
                </button>
                <div id={`faq-answer-${index}`} className="assistant-faq__answer" aria-hidden={!isActive}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>

        <a href="#contact" className="assistant-panel__cta" onClick={() => setIsOpen(false)}>
          Start a conversation <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </aside>
    </>
  );
}