import { useState, type FormEvent } from "react";
import { ExternalLink } from "lucide-react";
import type { AppWindowProps } from "@/features/desktop/types";
import type { ContactFormField } from "@/types";
import { AppFrame, AppSection } from "./components/AppLayout";
import { AppGate } from "./components/AppGate";
import { buildMailtoUrl, resolveMailtoTemplate } from "./utils";
import "./apps.css";

function ContactField({
  field,
  value,
  onChange,
}: {
  field: ContactFormField;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = `contact-${field.name}`;

  return (
    <div className="contact-form__field">
      <label htmlFor={id}>
        {field.label}
        {field.required && " *"}
      </label>
      {field.type === "textarea" ? (
        <textarea
          id={id}
          name={field.name}
          rows={field.rows ?? 5}
          placeholder={field.placeholder}
          required={field.required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          id={id}
          name={field.name}
          type={field.type}
          placeholder={field.placeholder}
          required={field.required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

export function ContactApp(_props: AppWindowProps) {
  return (
    <AppGate>
      {(document) => {
        const { contact, social, applications } = document;
        const appConfig = applications.contact;

        if (!appConfig.enabled) {
          return (
            <AppFrame>
              <p className="akshaya-type-body-sm text-muted-foreground">
                Contact application is disabled in portfolio configuration.
              </p>
            </AppFrame>
          );
        }

        return (
          <ContactFormInner
            contact={contact}
            social={social}
            formFields={appConfig.form.fields}
            submitTo={resolveMailtoTemplate(
              appConfig.form.submitAction.to,
              contact.email,
            )}
            submitSubject={appConfig.form.submitAction.subject}
            description={appConfig.description}
          />
        );
      }}
    </AppGate>
  );
}

function ContactFormInner({
  contact,
  social,
  formFields,
  submitTo,
  submitSubject,
  description,
}: {
  contact: import("@/types").ContactInfo;
  social: import("@/types").SocialLink[];
  formFields: ContactFormField[];
  submitTo: string;
  submitSubject: string;
  description: string;
}) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(formFields.map((f) => [f.name, ""])),
  );
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const body: Record<string, string> = {};
    for (const field of formFields) {
      const val = values[field.name]?.trim();
      if (val) body[field.label] = val;
    }

    window.location.href = buildMailtoUrl(submitTo, submitSubject, body);
    setSubmitted(true);
  };

  const setField = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <AppFrame>
      <AppSection title="Contact" eyebrow={description}>
        <div className="contact-grid">
          <div className="akshaya-glass-subtle rounded-xl p-4 space-y-3">
            <div className="contact-info-row">
              <span className="contact-info-row__label">Email</span>
              <a
                href={`mailto:${contact.email}`}
                className="contact-info-row__value contact-info-row__value--link"
              >
                {contact.email}
              </a>
            </div>
            {contact.phone && (
              <div className="contact-info-row">
                <span className="contact-info-row__label">Phone</span>
                <span className="contact-info-row__value">{contact.phone}</span>
              </div>
            )}
            <div className="contact-info-row">
              <span className="contact-info-row__label">Availability</span>
              <span className="contact-info-row__value">{contact.availability}</span>
            </div>
            <div className="contact-info-row">
              <span className="contact-info-row__label">Response time</span>
              <span className="contact-info-row__value">{contact.responseTime}</span>
            </div>
            {contact.preferredChannels.length > 0 && (
              <div className="contact-info-row">
                <span className="contact-info-row__label">Preferred channels</span>
                <span className="contact-info-row__value">
                  {contact.preferredChannels.join(", ")}
                </span>
              </div>
            )}
          </div>

          {social.length > 0 && (
            <div className="profile-social-list">
              {social.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="profile-social-link akshaya-focus-ring"
                >
                  <span className="akshaya-type-body-sm">{link.platform}</span>
                  <ExternalLink className="h-4 w-4 opacity-60" />
                </a>
              ))}
            </div>
          )}
        </div>
      </AppSection>

      <AppSection title="Send a message">
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          {formFields.map((field) => (
            <ContactField
              key={field.name}
              field={field}
              value={values[field.name] ?? ""}
              onChange={(v) => setField(field.name, v)}
            />
          ))}
          <button type="submit" className="contact-form__submit akshaya-focus-ring">
            Send via Email
          </button>
          {submitted && (
            <p className="akshaya-type-caption text-muted-foreground">
              Opening your email client…
            </p>
          )}
        </form>
      </AppSection>
    </AppFrame>
  );
}
