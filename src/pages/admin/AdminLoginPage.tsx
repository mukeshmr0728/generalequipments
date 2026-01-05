import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Loader2, Cog, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface FormData {
  email: string;
  password: string;
}

export default function AdminLoginPage() {
  const { user, loading: authLoading, signIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-charcoal-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-steel-400" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    const { error: signInError } = await signIn(data.email, data.password);

    if (signInError) {
      setError('Invalid email or password');
      setIsSubmitting(false);
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-steel-700 flex items-center justify-center mx-auto mb-4">
            <Cog className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-charcoal-400 text-sm">
            Sign in to access the General Equipments CMS
          </p>
        </div>

        <div className="bg-charcoal-900 border border-charcoal-800 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-800 text-red-300 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-semibold text-charcoal-300 mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className={`w-full px-4 py-3 bg-charcoal-800 border ${
                  errors.email ? 'border-red-500' : 'border-charcoal-700'
                } text-white placeholder-charcoal-500 focus:border-steel-500 focus:ring-2 focus:ring-steel-500 focus:ring-opacity-20 focus:outline-none`}
                placeholder="admin@company.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-semibold text-charcoal-300 mb-2 uppercase tracking-wider">
                Password
              </label>
              <input
                id="password"
                type="password"
                className={`w-full px-4 py-3 bg-charcoal-800 border ${
                  errors.password ? 'border-red-500' : 'border-charcoal-700'
                } text-white placeholder-charcoal-500 focus:border-steel-500 focus:ring-2 focus:ring-steel-500 focus:ring-opacity-20 focus:outline-none`}
                placeholder="Enter your password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-steel-600 text-white py-3 font-semibold text-sm uppercase tracking-wider hover:bg-steel-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-charcoal-500 text-sm">
          Return to{' '}
          <a href="/" className="text-steel-400 hover:text-steel-300">
            Main Website
          </a>
        </p>
      </div>
    </div>
  );
}
