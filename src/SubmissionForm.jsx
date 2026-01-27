import { useState, useEffect } from 'react';
import { X } from './Icons';

function SubmissionForm({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    state: '',
    city: '',
    bio: '',
    website: '',
    instagram: '',
    videoUrl: '',
    posterUrl: '',
    preferredMonth: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'
  const [captchaToken, setCaptchaToken] = useState(null);
  const [rateLimitError, setRateLimitError] = useState(false);

  // TODO: Replace this with your actual Google Apps Script Web App URL after deployment
  const SUBMISSION_URL = 'https://script.google.com/macros/s/AKfycbzJGzFrjxV9OJ9dVTabOTLmKdtbJOm06ilhoj74ajhnL1vuq5hrOaETJDdwROFiKbd_Uw/exec';
  
  // TODO: Replace with your Cloudflare Turnstile site key
  const TURNSTILE_SITE_KEY = 'YOUR_TURNSTILE_SITE_KEY';

  // Load Cloudflare Turnstile
  useEffect(() => {
    if (isOpen && !window.turnstile) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, [isOpen]);

  // Check rate limit (client-side prevention)
  const checkRateLimit = () => {
    const lastSubmission = localStorage.getItem('motionmap-last-submit');
    if (lastSubmission) {
      const timeSince = Date.now() - parseInt(lastSubmission);
      const cooldownMinutes = 10;
      const cooldownMs = cooldownMinutes * 60 * 1000;
      
      if (timeSince < cooldownMs) {
        const minutesLeft = Math.ceil((cooldownMs - timeSince) / 60000);
        setRateLimitError(`Please wait ${minutesLeft} minutes before submitting again.`);
        return false;
      }
    }
    return true;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRateLimitError(false);
    
    // Check rate limit
    if (!checkRateLimit()) {
      return;
    }
    
    // Check captcha
    if (!captchaToken) {
      setSubmitStatus('error');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Auto-add https:// to URLs if missing
    const cleanedData = {
      ...formData,
      captchaToken, // Include captcha for server-side verification
      website: formData.website && !formData.website.match(/^https?:\/\//) 
        ? `https://${formData.website}` 
        : formData.website,
      videoUrl: formData.videoUrl && !formData.videoUrl.match(/^https?:\/\//) 
        ? `https://${formData.videoUrl}` 
        : formData.videoUrl,
      posterUrl: formData.posterUrl && !formData.posterUrl.match(/^https?:\/\//) 
        ? `https://${formData.posterUrl}` 
        : formData.posterUrl,
    };

    try {
      const response = await fetch(SUBMISSION_URL, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData)
      });

      // Note: With no-cors mode, we can't read the response
      // We'll assume success if no error is thrown
      setSubmitStatus('success');
      
      // Store submission time
      localStorage.setItem('motionmap-last-submit', Date.now().toString());
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          country: '',
          state: '',
          city: '',
          bio: '',
          website: '',
          instagram: '',
          videoUrl: '',
          posterUrl: '',
          preferredMonth: ''
        });
        setCaptchaToken(null);
        setSubmitStatus(null);
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-700 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <X />
          </button>
          <h2 className="text-3xl font-bold text-white mb-2">Submit Your Work</h2>
          <p className="text-indigo-100">Join the Motion-Map community</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="your@email.com"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Country <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="USA, Japan, UK, etc."
            />
          </div>

          {/* State/Region */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              State / Region
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="California, Tokyo, etc."
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Los Angeles, Charlotte, etc."
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Bio <span className="text-red-400">*</span>
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              required
              rows="3"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Tell us about yourself and your work..."
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Website
            </label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="yourwebsite.com (https:// added automatically)"
            />
          </div>

          {/* Instagram */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Instagram
            </label>
            <input
              type="text"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="@yourhandle"
            />
          </div>

          {/* Video URL */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Video URL (Vimeo or YouTube)
            </label>
            <input
              type="text"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="vimeo.com/... or youtube.com/... (https:// added automatically)"
            />
          </div>

          {/* Poster/Artwork URL */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Poster / Artwork URL
            </label>
            <input
              type="text"
              name="posterUrl"
              value={formData.posterUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Direct link to image (https:// added automatically)"
            />
            <p className="text-xs text-slate-400 mt-1">
              Upload your image to Imgur, Google Drive, or your portfolio site and paste the direct link
            </p>
          </div>

          {/* Preferred Month */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Preferred Month
            </label>
            <input
              type="month"
              name="preferredMonth"
              value={formData.preferredMonth}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-slate-400 mt-1">
              Optional - we'll feature you when space is available
            </p>
          </div>

          {/* Cloudflare Turnstile Captcha */}
          <div>
            <div 
              className="cf-turnstile" 
              data-sitekey={TURNSTILE_SITE_KEY}
              data-callback={(token) => setCaptchaToken(token)}
              data-theme="dark"
            ></div>
          </div>

          {/* Rate Limit Error */}
          {rateLimitError && (
            <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-200 px-4 py-3 rounded-lg">
              ⏱️ {rateLimitError}
            </div>
          )}

          {/* Submit Status */}
          {submitStatus === 'success' && (
            <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded-lg">
              ✓ Submission received! We'll review it soon.
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
              ✗ Something went wrong. Please try again or email us directly.
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SubmissionForm;
