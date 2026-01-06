import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface Review {
  id: string | number;
  auteur: string;
  note: number;
  commentaire: string;
  date: string;
}

export default function HotelReviews({ reviews }: { reviews: Review[] }) {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-10">
          Avis des clients
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-slate-900">
                  {review.auteur}
                </span>
                <span className="flex items-center gap-1 text-yellow-500">
                  <Star size={16} fill="currentColor" />
                  {review.note}
                </span>
              </div>

              <p className="text-slate-700 text-sm mb-2">
                {review.commentaire}
              </p>

              <span className="text-xs text-slate-400">
                {new Date(review.date).toLocaleDateString()}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
