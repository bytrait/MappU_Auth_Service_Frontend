/**
 * Resolve redirect after successful student registration.
 * @param {{ payment?: Record<string, unknown> | null; careerPlatformUrl?: string }} options
 * @returns {string | null}
 */
export function resolvePostRegisterRedirect({
  payment,
  careerPlatformUrl,
}) {
  if (payment && typeof payment === 'object') {
    const checkoutUrl =
      payment.checkoutUrl ||
      payment.checkout_url ||
      payment.redirectUrl ||
      payment.redirect_url ||
      payment.paymentUrl ||
      payment.payment_url;

    if (typeof checkoutUrl === 'string' && checkoutUrl.trim()) {
      return checkoutUrl.trim();
    }

    const billingBase = import.meta.env.VITE_BILLING_CHECKOUT_URL;
    const paymentId = payment.paymentId || payment.payment_id;

    if (billingBase && paymentId) {
      const base = billingBase.replace(/\/$/, '');
      return `${base}?paymentId=${encodeURIComponent(String(paymentId))}`;
    }
  }

  if (careerPlatformUrl) {
    const url = careerPlatformUrl.replace(/\/$/, '');
    return `${url}/`;
  }

  return null;
}
