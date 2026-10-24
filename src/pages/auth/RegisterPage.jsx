import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Feather, Loader2, BadgeCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { handleError } from '../../api/client';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    libraryCardNumber: '',
    bio: '',
    role: 'author',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register(form);
      navigate(user.role === 'author' ? '/author' : '/');
    } catch (err) {
      setError(handleError(err).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="mb-6 text-center">
        <Feather className="mx-auto h-8 w-8 text-rosewood" />
        <h1 className="font-serif mt-3 text-3xl font-bold">Join the reading circle</h1>
        <p className="mt-1 text-sm text-fadedink">
          Authors need a library membership number. Readers can browse freely.
        </p>
      </div>

      <form onSubmit={submit} className="card space-y-4 p-6">
        {error && (
          <p className="rounded-md border border-saffron/30 bg-saffron/10 px-3 py-2 text-sm text-saffron">{error}</p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Full name</label>
            <input className="input-base" value={form.name} onChange={set('name')} required />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input-base" value={form.email} onChange={set('email')} required />
          </div>
        </div>

        <div>
          <label className="label">Password</label>
          <input type="password" minLength={6} className="input-base" value={form.password} onChange={set('password')} required />
        </div>

        <div>
          <label className="label">
            Library card number <span className="normal-case text-fadedink/60">(leave blank to join as a reader)</span>
          </label>
          <div className="relative">
            <BadgeCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-moss" />
            <input className="input-base pl-9" value={form.libraryCardNumber} onChange={set('libraryCardNumber')} placeholder="LIB-0000" />
          </div>
        </div>

        <div>
          <label className="label">Short bio <span className="normal-case text-fadedink/60">(optional, max 500)</span></label>
          <textarea maxLength={500} rows={3} className="input-base resize-none" value={form.bio} onChange={set('bio')} placeholder="Talk about the stories you write…" />
        </div>

        <button className="btn-primary w-full justify-center" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} Create account
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-fadedink">
        Already registered?{' '}
        <Link to="/login" className="font-semibold text-rosewood hover:underline">Sign in</Link>
      </p>
    </div>
  );
}