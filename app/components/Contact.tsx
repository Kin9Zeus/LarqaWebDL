'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, ArrowUpRight } from 'lucide-react';
import Reveal, { RevealWords } from './Reveal';
import { sectionIds, site, whatsappLink } from '../lib/site';
import type { Dictionary, Locale } from '../lib/i18n';

const COUNTRY_CODES = [
  { code: '+57', flag: '🇨🇴' },
  { code: '+1', flag: '🇺🇸' },
  { code: '+52', flag: '🇲🇽' },
  { code: '+34', flag: '🇪🇸' },
  { code: '+44', flag: '🇬🇧' },
  { code: '+971', flag: '🇦🇪' },
  { code: '+54', flag: '🇦🇷' },
  { code: '+56', flag: '🇨🇱' },
  { code: '+51', flag: '🇵🇪' },
  { code: '+593', flag: '🇪🇨' },
  { code: '+58', flag: '🇻🇪' },
  { code: '+507', flag: '🇵🇦' },
  { code: '+506', flag: '🇨🇷' },
  { code: '+55', flag: '🇧🇷' },
  { code: '+33', flag: '🇫🇷' },
  { code: '+39', flag: '🇮🇹' },
  { code: '+49', flag: '🇩🇪' },
  { code: '+61', flag: '🇦🇺' },
];

type FormState = 'idle' | 'loading' | 'success' | 'error';

const FIELD =
  'w-full border-b border-ink-line bg-transparent py-3 text-bone placeholder:text-bone-faint transition-colors duration-300 focus:border-render focus:outline-none';

export default function Contact({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const f = dict.contact.form;
  const [state, setState] = useState<FormState>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const initial = {
    nombre: '',
    apellido: '',
    email: '',
    countryCode: '+57',
    whatsapp: '',
    service: f.serviceOptions[0],
    preference: 'email',
    message: '',
  };
  const [data, setData] = useState(initial);

  const set = (name: string, value: string) => {
    setData((d) => ({ ...d, [name]: value }));
    setErrors((e) => (e[name] ? { ...e, [name]: '' } : e));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    for (const key of ['nombre', 'apellido', 'email', 'whatsapp', 'message'] as const) {
      if (!data[key].trim()) next[key] = f.errorRequired;
    }
    if (data.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) {
      next.email = f.errorEmail;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setState('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          whatsapp: `${data.countryCode} ${data.whatsapp}`,
          locale,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState('success');
      setData(initial);
    } catch {
      setState('error');
    }
  };

  const directLinks = [
    { label: dict.contact.whatsapp, value: 'WhatsApp', href: whatsappLink(dict.common.whatsappMessage) },
    { label: dict.contact.email, value: site.email, href: `mailto:${site.email}` },
    { label: dict.contact.instagram, value: site.instagramHandle, href: site.instagram },
  ];

  return (
    <section
      id={sectionIds.contact}
      className="border-t border-ink-line bg-ink py-24 md:py-36"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <Reveal>
          <p className="eyebrow mb-8">{dict.contact.eyebrow}</p>
        </Reveal>

        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Argument + direct channels */}
          <div className="lg:col-span-5">
            <h2 className="display max-w-[14ch] text-display-lg">
              <RevealWords text={dict.contact.title} />
            </h2>

            <Reveal delay={0.15}>
              <p className="mt-8 max-w-md text-base leading-relaxed text-bone/70">
                {dict.contact.body}
              </p>
              <p className="mono-label mt-6 text-render">{dict.contact.responseTime}</p>
            </Reveal>

            <Reveal delay={0.25}>
              <p className="eyebrow mt-14 mb-6">{dict.contact.directLabel}</p>
              <ul className="border-t border-ink-line">
                {directLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="group flex items-center justify-between gap-4 border-b border-ink-line py-5 transition-colors duration-300 hover:text-render"
                    >
                      <span className="mono-label text-bone-faint">{link.label}</span>
                      <span className="flex items-center gap-2 text-sm text-bone transition-colors duration-300 group-hover:text-render">
                        {link.value}
                        <ArrowUpRight
                          size={15}
                          strokeWidth={1.25}
                          className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Form */}
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.1}>
              <div className="border border-ink-line bg-ink-raised p-7 md:p-10">
                <AnimatePresence mode="wait">
                  {state === 'success' ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="flex min-h-[520px] flex-col items-start justify-center"
                    >
                      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-render/40 text-render">
                        <Check size={26} strokeWidth={1.25} />
                      </span>
                      <h3 className="display mt-8 text-display-sm text-bone">
                        {f.successTitle}
                      </h3>
                      <p className="mt-4 max-w-sm text-sm leading-relaxed text-bone/60">
                        {f.successBody}
                      </p>
                      <button
                        type="button"
                        onClick={() => setState('idle')}
                        className="mono-label link-wipe mt-10 text-bone-dim hover:text-bone"
                      >
                        {f.successAgain}
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={submit}
                      noValidate
                      className="space-y-7"
                    >
                      <div className="grid gap-7 sm:grid-cols-2">
                        <Field
                          id="nombre"
                          label={f.firstName}
                          placeholder={f.firstNamePlaceholder}
                          value={data.nombre}
                          error={errors.nombre}
                          onChange={set}
                        />
                        <Field
                          id="apellido"
                          label={f.lastName}
                          placeholder={f.lastNamePlaceholder}
                          value={data.apellido}
                          error={errors.apellido}
                          onChange={set}
                        />
                      </div>

                      <Field
                        id="email"
                        type="email"
                        label={f.email}
                        placeholder={f.emailPlaceholder}
                        value={data.email}
                        error={errors.email}
                        onChange={set}
                      />

                      <div>
                        <label htmlFor="whatsapp" className="eyebrow mb-3 block">
                          {f.phone}
                        </label>
                        <div className="flex gap-4">
                          <select
                            aria-label={f.countryCode}
                            value={data.countryCode}
                            onChange={(e) => set('countryCode', e.target.value)}
                            className={`${FIELD} w-[104px] shrink-0 cursor-pointer`}
                          >
                            {COUNTRY_CODES.map((c) => (
                              <option key={c.code} value={c.code} className="bg-ink text-bone">
                                {c.flag} {c.code}
                              </option>
                            ))}
                          </select>
                          <input
                            id="whatsapp"
                            type="tel"
                            inputMode="tel"
                            value={data.whatsapp}
                            placeholder={f.phonePlaceholder}
                            onChange={(e) => set('whatsapp', e.target.value)}
                            aria-invalid={!!errors.whatsapp}
                            className={FIELD}
                          />
                        </div>
                        {errors.whatsapp && <ErrorText>{errors.whatsapp}</ErrorText>}
                      </div>

                      <div>
                        <label htmlFor="service" className="eyebrow mb-3 block">
                          {f.service}
                        </label>
                        <select
                          id="service"
                          value={data.service}
                          onChange={(e) => set('service', e.target.value)}
                          className={`${FIELD} cursor-pointer`}
                        >
                          {f.serviceOptions.map((option) => (
                            <option key={option} value={option} className="bg-ink text-bone">
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      <fieldset>
                        <legend className="eyebrow mb-4">{f.preference}</legend>
                        <div className="flex flex-wrap gap-6">
                          {[
                            { value: 'email', label: f.preferenceEmail },
                            { value: 'whatsapp', label: f.preferenceWhatsapp },
                            { value: 'both', label: f.preferenceBoth },
                          ].map((option) => (
                            <label
                              key={option.value}
                              className="flex cursor-pointer items-center gap-2.5 text-sm text-bone/70 transition-colors duration-300 hover:text-bone"
                            >
                              <input
                                type="radio"
                                name="preference"
                                value={option.value}
                                checked={data.preference === option.value}
                                onChange={(e) => set('preference', e.target.value)}
                                className="h-4 w-4 accent-render"
                              />
                              {option.label}
                            </label>
                          ))}
                        </div>
                      </fieldset>

                      <div>
                        <label htmlFor="message" className="eyebrow mb-3 block">
                          {f.message}
                        </label>
                        <textarea
                          id="message"
                          rows={4}
                          value={data.message}
                          placeholder={f.messagePlaceholder}
                          onChange={(e) => set('message', e.target.value)}
                          aria-invalid={!!errors.message}
                          className={`${FIELD} resize-none`}
                        />
                        {errors.message && <ErrorText>{errors.message}</ErrorText>}
                      </div>

                      {state === 'error' && (
                        <p role="alert" className="text-sm text-red-400">
                          {f.errorGeneric}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={state === 'loading'}
                        className="mono-label flex w-full items-center justify-center gap-3 bg-bone py-4.5 text-ink transition-colors duration-500 hover:bg-render disabled:cursor-wait disabled:opacity-60"
                      >
                        {state === 'loading' ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            {f.submitting}
                          </>
                        ) : (
                          f.submit
                        )}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="mt-2 text-xs text-red-400">
      {children}
    </p>
  );
}

function Field({
  id,
  label,
  placeholder,
  value,
  error,
  type = 'text',
  onChange,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  type?: string;
  onChange: (name: string, value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow mb-3 block">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(id, e.target.value)}
        aria-invalid={!!error}
        className={FIELD}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}
