import React, { useEffect, useState } from 'react';
import { Crown } from 'lucide-react';
import api from '../../services/api';

export const SaaSSubscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get('/subscriptions/my-subscription/'), api.get('/subscriptions/plans/')])
      .then(([subscriptionResponse, plansResponse]) => {
        setSubscription(subscriptionResponse.data);
        setPlans(plansResponse.data.results || plansResponse.data);
      })
      .catch(() => setError('Subscription information could not be loaded.'));
  }, []);

  return <div className="max-w-5xl space-y-8"><section className="rounded-3xl bg-espresso-800 p-6 text-cream-100 shadow-md sm:p-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><div className="inline-flex items-center gap-2 rounded-full bg-brass-500/20 px-3 py-1 text-xs font-semibold uppercase text-brass-400"><Crown className="h-4 w-4" /> SaaS subscription</div><h1 className="mt-3 font-heading text-2xl font-bold">{subscription?.status === 'ACTIVE' ? 'Your subscription is active' : `You have ${subscription?.days_left || 30} days left in your trial`}</h1><p className="mt-2 text-xs text-cream-200/80">Your gym subscription status and available GymSuite tiers.</p></div><div className="text-left sm:text-right"><span className="block text-[10px] font-bold uppercase tracking-wider text-cream-200/60">Current plan</span><span className="font-heading text-2xl font-bold text-brass-400">{subscription?.plan_details?.name || 'Trial'}</span></div></div></section>{error && <div role="alert" className="rounded-xl bg-statusRed-bg px-4 py-3 text-xs font-semibold text-statusRed-text">{error}</div>}<section className="space-y-4"><div><h2 className="font-heading text-xl font-bold text-espresso-800">Available SaaS tiers</h2><p className="text-xs text-mutedGray">Contact support to change your platform subscription.</p></div><div className="grid gap-4 md:grid-cols-3">{plans.map((plan) => <article key={plan.id} className="rounded-2xl border border-sand bg-white p-5 shadow-xs"><h3 className="font-heading text-lg font-bold text-espresso-800">{plan.name}</h3><p className="mt-3 font-heading text-3xl font-bold text-espresso-800">₹{plan.price_monthly}<span className="ml-1 text-xs font-sans font-normal text-mutedGray">/month</span></p><p className="mt-3 min-h-10 text-xs leading-5 text-mutedGray">{plan.description || 'GymSuite platform access.'}</p><div className="mt-4 border-t border-sand pt-3 text-xs font-bold text-brass-600">Max members: {plan.max_members === -1 ? 'Unlimited' : plan.max_members}</div></article>)}</div></section></div>;
};
