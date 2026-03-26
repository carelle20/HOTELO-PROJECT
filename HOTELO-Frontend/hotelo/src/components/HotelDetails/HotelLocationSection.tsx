import { MapPin, Phone, Mail, Globe } from "lucide-react";

interface HotelLocationSectionProps {
  nom: string;
  ville?: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
}

export default function HotelLocationSection({
  nom,
  ville,
  adresse,
  telephone,
  email,
  latitude,
  longitude,
}: HotelLocationSectionProps) {
  return (
    <section>
      <h2 className="text-3xl font-bold text-slate-900 mb-8">Localisation</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Map Placeholder */}
        <div className="rounded-xl overflow-hidden bg-slate-200 h-80 flex items-center justify-center border-2 border-slate-300">
          {latitude && longitude ? (
            <div className="text-center">
              <MapPin size={48} className="text-slate-400 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">Carte interactive</p>
              <p className="text-xs text-slate-400 mt-1">
                {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </p>
            </div>
          ) : (
            <div className="text-center">
              <MapPin size={48} className="text-slate-400 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">Localisation non disponible</p>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <div className="bg-slate-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Adresse</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-slate-900">{nom}</p>
                  {adresse && (
                    <p className="text-sm text-slate-600">{adresse}</p>
                  )}
                  {ville && (
                    <p className="text-sm text-slate-600">{ville}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          {(telephone || email) && (
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Contact</h3>
              <div className="space-y-3">
                {telephone && (
                  <a
                    href={`tel:${telephone}`}
                    className="flex items-center gap-3 text-slate-700 hover:text-blue-600 transition"
                  >
                    <Phone size={20} className="text-blue-500 flex-shrink-0" />
                    <span className="font-medium">{telephone}</span>
                  </a>
                )}
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-3 text-slate-700 hover:text-blue-600 transition"
                  >
                    <Mail size={20} className="text-blue-500 flex-shrink-0" />
                    <span className="font-medium text-sm break-all">{email}</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Website */}
          <div className="bg-slate-50 rounded-xl p-6">
            <a
              href="https://example.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-blue-600 hover:text-blue-700 transition font-medium"
            >
              <Globe size={20} />
              Visiter le site web
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
