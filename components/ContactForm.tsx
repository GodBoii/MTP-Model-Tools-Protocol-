"use client";

import { ArrowUpRight } from "lucide-react";
import { FormEvent, useState } from "react";
import { contactOptions } from "@/content/site";

export function ContactForm() {
  const [status, setStatus] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("success");
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <OptionGroup number="01" title="What MTPX surface are you working on?" name="service" options={contactOptions.services} multi />
      <OptionGroup number="02" title="Project stage" name="stage" options={contactOptions.budgets} />
      <Field number="03" label="Your name" name="name" required />
      <Field number="04" label="Your email" name="email" type="email" required />
      <label className="form-row">
        <span>05</span>
        <span>Runtime details</span>
        <textarea name="details" placeholder="Provider, tools, session store, errors, logs, and what you expected to happen." required />
      </label>
      <Field number="06" label="Preferred debugging date" name="start" type="date" />
      <OptionGroup number="07" title="How urgent is it?" name="deadline" options={contactOptions.deadlines} />
      <OptionGroup number="08" title="Where did you hear about us?" name="source" options={contactOptions.sources} />
      <button className="submit-cta" type="submit">
        Send runtime note <ArrowUpRight size={28} />
      </button>
      <p className={`form-status ${status}`}>{status === "success" ? "Received. Bring logs; we will bring a debugger." : " "}</p>
    </form>
  );
}

function Field({ number, label, name, type = "text", required = false }: { number: string; label: string; name: string; type?: string; required?: boolean }) {
  return (
    <label className="form-row">
      <span>{number}</span>
      <span>{label}</span>
      <input name={name} type={type} required={required} placeholder={label.toLowerCase()} />
    </label>
  );
}

function OptionGroup({ number, title, name, options, multi = false }: { number: string; title: string; name: string; options: string[]; multi?: boolean }) {
  return (
    <fieldset className="form-row">
      <legend><span>{number}</span><span>{title}</span></legend>
      <div className="option-grid">
        {options.map((option) => (
          <label className="choice" key={option}>
            <input type={multi ? "checkbox" : "radio"} name={multi ? `${name}-${option}` : name} value={option} />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
