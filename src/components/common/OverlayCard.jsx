// components/common/OverlayCard.jsx
import { useTenant } from '../../tenant/TenantContext';

const OverlayCard = () => {
  const tenant = useTenant();
  const brand = tenant?.customization?.displayName || tenant?.name || 'ByTrait';
  const email =
    tenant?.customization?.supportEmail || 'support@bytrait.com';
  const website =
    tenant?.code === 'mappu'
      ? 'www.mappmyuniversity.com'
      : 'www.bytrait.com';
  const phone =
    tenant?.code === 'mappu'
      ? '+91 8287795809, +91 7014537715'
      : null;

  return (
    <div className="bg-white/20 backdrop-blur-lg text-white rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center text-center">
      <h3 className="text-2xl font-semibold mb-2">
        Have a question? We’re here to help.
      </h3>

      <p className="text-sm opacity-90">
        {phone ? `Phone: ${phone} | ` : ''}
        Email: {email} | Website: {website}
        <span className="block mt-1 opacity-80">{brand}</span>
      </p>
    </div>
  );
};

export default OverlayCard;
