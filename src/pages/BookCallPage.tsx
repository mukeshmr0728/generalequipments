import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import {
  Loader2,
  CheckCircle2,
  Phone,
  Clock,
  Shield,
  Users,
} from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  preferred_date: string;
  preferred_time: string;
  topic: string;
  message: string;
}

const topics = [
  'General Equipment Inquiry',
  'Product Selection Assistance',
  'Technical Specifications',
  'Pricing and Quotation',
  'Application Engineering',
  'After-Sales Support',
  'Partnership Opportunities',
  'Other',
];

const timeSlots = [
  '9:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '1:00 PM - 2:00 PM',
  '2:00 PM - 3:00 PM',
  '3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM',
];

const benefits = [
  {
    icon: Users,
    title: 'Expert Engineers',
    description: 'Speak directly with engineers who understand your industry.',
  },
  {
    icon: Clock,
    title: 'No Obligation',
    description: 'Free consultation with no pressure to purchase.',
  },
  {
    icon: Shield,
    title: 'Confidential',
    description: 'Your project details remain strictly confidential.',
  },
];

export default function BookCallPage() {
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
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-booking`,
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
            preferred_date: data.preferred_date || null,
            preferred_time: data.preferred_time || null,
            topic: data.topic || null,
            message: data.message || null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit booking request');
      }

      setIsSuccess(true);
      reset();
    } catch (err) {
      setError('Failed to submit booking request. Please try again.');
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (isSuccess) {
    return (
      <>
        <section className="bg-charcoal-950 text-white py-16">
          <div className="container-wide">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Book a Call</h1>
            <p className="text-xl text-charcoal-400">
              Schedule a consultation with our engineering team.
            </p>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="container-wide">
            <div className="max-w-xl mx-auto text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-charcoal-900 mb-4">
                Booking Request Received
              </h2>
              <p className="text-lg text-charcoal-600 mb-8">
                Thank you for your interest. A member of our team will contact you
                within one business day to confirm your consultation time.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/products" className="btn-primary">
                  Browse Products
                </Link>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="btn-outline"
                >
                  Book Another Call
                </button>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="bg-charcoal-950 text-white py-16">
        <div className="container-wide">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Book a Call</h1>
          <p className="text-xl text-charcoal-400 max-w-2xl">
            Schedule a consultation with our engineering team to discuss your
            equipment requirements.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="bg-charcoal-50 border border-charcoal-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-steel-700 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-charcoal-900">
                      Schedule Your Consultation
                    </h2>
                    <p className="text-sm text-charcoal-600">
                      Fill out the form and we will confirm your appointment
                    </p>
                  </div>
                </div>

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
                        placeholder="John Smith"
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
                        placeholder="john@company.com"
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
                        placeholder="+1 (555) 123-4567"
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
                        placeholder="ABC Industries"
                        {...register('company')}
                      />
                    </div>

                    <div>
                      <label htmlFor="preferred_date" className="label">
                        Preferred Date
                      </label>
                      <input
                        id="preferred_date"
                        type="date"
                        min={today}
                        className="input-field"
                        {...register('preferred_date')}
                      />
                    </div>

                    <div>
                      <label htmlFor="preferred_time" className="label">
                        Preferred Time (CST)
                      </label>
                      <select
                        id="preferred_time"
                        className="input-field"
                        {...register('preferred_time')}
                      >
                        <option value="">Select a time slot</option>
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label htmlFor="topic" className="label">
                      Topic of Discussion
                    </label>
                    <select
                      id="topic"
                      className="input-field"
                      {...register('topic')}
                    >
                      <option value="">Select a topic</option>
                      {topics.map((topic) => (
                        <option key={topic} value={topic}>
                          {topic}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-6">
                    <label htmlFor="message" className="label">
                      Additional Details
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="input-field resize-none"
                      placeholder="Please describe what you would like to discuss..."
                      {...register('message')}
                    />
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
                          Submitting...
                        </>
                      ) : (
                        'Request Consultation'
                      )}
                    </button>
                  </div>

                  <p className="mt-4 text-xs text-charcoal-500 text-center">
                    By submitting this form, you agree to our Privacy Policy.
                  </p>
                </form>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal-500 mb-6">
                What to Expect
              </h3>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 bg-charcoal-100 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-6 h-6 text-steel-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal-900 mb-1">
                        {benefit.title}
                      </h4>
                      <p className="text-sm text-charcoal-600">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-6 bg-charcoal-950 text-white">
                <h4 className="font-semibold mb-2">Need Immediate Assistance?</h4>
                <p className="text-sm text-charcoal-400 mb-4">
                  Call us directly during business hours.
                </p>
                <a
                  href="tel:+15551234567"
                  className="text-xl font-bold text-steel-400 hover:text-steel-300"
                >
                  +1 (555) 123-4567
                </a>
                <p className="text-xs text-charcoal-500 mt-2">
                  Monday - Friday, 8:00 AM - 6:00 PM CST
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
