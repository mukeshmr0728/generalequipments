import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, CheckCircle2, Phone, Mail, MapPin, Clock } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  inquiry_type: string;
  message: string;
}

const inquiryTypes = [
  'General Inquiry',
  'Request for Quote',
  'Technical Support',
  'Product Information',
  'Partnership',
  'Other',
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-lead`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            phone: data.phone || null,
            company: data.company || null,
            inquiry_type: data.inquiry_type || 'general',
            source_page: '/contact',
            message: data.message || null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit message');
      }

      setIsSuccess(true);
      reset();
    } catch (err) {
      setError('Failed to submit your message. Please try again.');
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="bg-charcoal-950 text-white py-16">
        <div className="container-wide">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-charcoal-400 max-w-2xl">
            Get in touch with our team for quotes, technical support, or general
            inquiries within 12 hrs.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {isSuccess ? (
                <div className="bg-charcoal-50 border border-charcoal-200 p-12 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-charcoal-900 mb-4">
                    Message Sent
                  </h2>
                  <p className="text-charcoal-600 mb-8">
                    Thank you for contacting us. A member of our team will respond
                    within one business day.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="btn-outline"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div className="bg-charcoal-50 border border-charcoal-200 p-8">
                  <h2 className="text-2xl font-bold text-charcoal-900 mb-6">
                    Send Us a Message
                  </h2>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="label">
                          Full Name *
                        </label>
                        <input
                          id="name"
                          type="text"
                          className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                          placeholder="Enter your name"
                          {...register('name', { required: 'Name is required' })}
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="label">
                          Email Address *
                        </label>
                        <input
                          id="email"
                          type="email"
                          className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                          placeholder="generalequipments@company.com"
                          {...register('email', {
                            required: 'Email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address',
                            },
                          })}
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="phone" className="label">
                          Phone Number
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          className="input-field"
                          placeholder="+91 98765 43210"
                          {...register('phone')}
                        />
                      </div>

                      <div>
                        <label htmlFor="company" className="label">
                          Company Name
                        </label>
                        <input
                          id="company"
                          type="text"
                          className="input-field"
                          placeholder="Industries"
                          {...register('company')}
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <label htmlFor="inquiry_type" className="label">
                        Inquiry Type
                      </label>
                      <select
                        id="inquiry_type"
                        className="input-field"
                        {...register('inquiry_type')}
                      >
                        <option value="">Select inquiry type</option>
                        {inquiryTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-6">
                      <label htmlFor="message" className="label">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        rows={6}
                        className={`input-field resize-none ${errors.message ? 'border-red-500' : ''}`}
                        placeholder="Please describe your inquiry in detail..."
                        {...register('message', { required: 'Message is required' })}
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                      )}
                    </div>

                    <div className="mt-8">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            Sending...
                          </>
                        ) : (
                          'Send Message'
                        )}
                      </button>
                    </div>

                    <p className="mt-4 text-xs text-charcoal-500 text-center">
                      By submitting this form, you agree to our Privacy Policy.
                    </p>
                  </form>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal-500 mb-6">
                Contact Information
              </h3>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-steel-700 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal-900 mb-1">Address</h4>
                    <p className="text-sm text-charcoal-600">
                      1234 Industrial Boulevard<br />
                      Manufacturing District, TX 75001<br />
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-steel-700 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal-900 mb-1">Phone</h4>
                    <a
                      href="tel:+15551234567"
                      className="text-sm text-charcoal-600 hover:text-steel-700"
                    >
                      +1 (555) 123-4567
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-steel-700 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal-900 mb-1">Email</h4>
                    <a
                      href="mailto:info@generalequipments.com"
                      className="text-sm text-charcoal-600 hover:text-steel-700"
                    >
                      info@generalequipments.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-steel-700 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal-900 mb-1">Business Hours</h4>
                    <p className="text-sm text-charcoal-600">
                      Monday - Friday<br />
                      8:00 AM - 6:00 PM CST
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal-500 mb-4">
                  Location
                </h3>
                <div className="aspect-square bg-charcoal-200">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3354.8!2d-96.8!3d32.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDU0JzAwLjAiTiA5NsKwNDgnMDAuMCJX!5e0!3m2!1sen!2sus!4v1600000000000!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="General Equipments Location"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
