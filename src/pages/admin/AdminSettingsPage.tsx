import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Save, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface FormData {
  company_name: string;
  company_tagline: string;
  company_phone: string;
  company_email: string;
  company_address: string;
  social_instagram: string;
  social_whatsapp: string;
  social_twitter: string;
  social_linkedin: string;
  google_maps_embed: string;
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, reset } = useForm<FormData>();

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('site_settings').select('*');

      if (data) {
        const settings: Partial<FormData> = {};
        data.forEach((item) => {
          settings[item.key as keyof FormData] = item.value || '';
        });
        reset(settings);
      }
      setLoading(false);
    }
    fetchSettings();
  }, [reset]);

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setSaved(false);

    const updates = Object.entries(data).map(([key, value]) => ({
      key,
      value: value || null,
      updated_at: new Date().toISOString(),
    }));

    for (const update of updates) {
      await supabase
        .from('site_settings')
        .upsert(update, { onConflict: 'key' });
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-steel-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal-900 mb-2">Settings</h1>
        <p className="text-charcoal-600">Manage your site configuration</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white border border-charcoal-200 mb-6">
          <div className="px-6 py-4 border-b border-charcoal-200">
            <h2 className="font-semibold text-charcoal-900">Company Information</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Company Name</label>
                <input
                  type="text"
                  className="input-field"
                  {...register('company_name')}
                />
              </div>
              <div>
                <label className="label">Tagline</label>
                <input
                  type="text"
                  className="input-field"
                  {...register('company_tagline')}
                />
              </div>
              <div>
                <label className="label">Phone Number</label>
                <input
                  type="tel"
                  className="input-field"
                  {...register('company_phone')}
                />
              </div>
              <div>
                <label className="label">Email Address</label>
                <input
                  type="email"
                  className="input-field"
                  {...register('company_email')}
                />
              </div>
            </div>
            <div>
              <label className="label">Address</label>
              <textarea
                rows={2}
                className="input-field resize-none"
                {...register('company_address')}
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-charcoal-200 mb-6">
          <div className="px-6 py-4 border-b border-charcoal-200">
            <h2 className="font-semibold text-charcoal-900">Social Media Links</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Instagram URL</label>
                <input
                  type="url"
                  className="input-field"
                  placeholder="https://instagram.com/..."
                  {...register('social_instagram')}
                />
              </div>
              <div>
                <label className="label">WhatsApp URL</label>
                <input
                  type="url"
                  className="input-field"
                  placeholder="https://wa.me/..."
                  {...register('social_whatsapp')}
                />
              </div>
              <div>
                <label className="label">X (Twitter) URL</label>
                <input
                  type="url"
                  className="input-field"
                  placeholder="https://twitter.com/..."
                  {...register('social_twitter')}
                />
              </div>
              <div>
                <label className="label">LinkedIn URL</label>
                <input
                  type="url"
                  className="input-field"
                  placeholder="https://linkedin.com/company/..."
                  {...register('social_linkedin')}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-charcoal-200 mb-6">
          <div className="px-6 py-4 border-b border-charcoal-200">
            <h2 className="font-semibold text-charcoal-900">Google Maps</h2>
          </div>
          <div className="p-6">
            <div>
              <label className="label">Embed URL</label>
              <input
                type="url"
                className="input-field"
                placeholder="https://www.google.com/maps/embed?pb=..."
                {...register('google_maps_embed')}
              />
              <p className="mt-2 text-xs text-charcoal-500">
                Get this URL from Google Maps by clicking Share then Embed a map
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Settings
              </>
            )}
          </button>
          {saved && (
            <span className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle2 className="w-5 h-5" />
              Settings saved successfully
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
