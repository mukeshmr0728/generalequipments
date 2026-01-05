import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

interface ProductInquiryFormProps {
  productId: string;
  productName: string;
}

export default function ProductInquiryForm({ productId, productName }: ProductInquiryFormProps) {
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
            message: data.message || null,
            inquiry_type: 'product_inquiry',
            source_page: `/products/${productName}`,
            product_id: productId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit inquiry');
      }

      setIsSuccess(true);
      reset();
    } catch (err) {
      setError('Failed to submit inquiry. Please try again.');
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white border border-charcoal-200 p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-charcoal-900 mb-2">
          Inquiry Submitted
        </h3>
        <p className="text-charcoal-600 mb-6">
          Thank you for your interest in {productName}. Our team will respond within
          one business day.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="btn-outline"
        >
          Submit Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-charcoal-200 p-8">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

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
      </div>

      <div className="mt-6">
        <label htmlFor="message" className="label">
          Message
        </label>
        <textarea
          id="message"
          rows={4}
          className="input-field resize-none"
          placeholder="Please include any specific requirements, quantities, or questions about this product..."
          {...register('message')}
        />
      </div>

      <div className="mt-6">
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
            'Submit Inquiry'
          )}
        </button>
      </div>

      <p className="mt-4 text-xs text-charcoal-500 text-center">
        By submitting this form, you agree to our Privacy Policy and consent to
        being contacted regarding your inquiry.
      </p>
    </form>
  );
}
