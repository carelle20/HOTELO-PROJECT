import { useEffect, useState } from "react";
import { clientService } from "../../services/client.service";
import type { Review, Reservation } from "../../interfaces/client.interface";
import { toast } from "sonner";
import { Star, MessageSquare, Edit2, Trash2, Plus } from "lucide-react";

interface ReviewFormData {
  hotelId: number;
  note: number;
  commentaire: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pastReservations, setPastReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ReviewFormData>({
    hotelId: 0,
    note: 5,
    commentaire: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [reviewsData, reservationsData] = await Promise.all([
          clientService.getMyReviews(),
          clientService.getPastReservations(),
        ]);
        setReviews(reviewsData);
        setPastReservations(reservationsData);
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
        toast.error("Erreur lors du chargement des avis");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmitReview = async () => {
    if (!formData.hotelId || !formData.commentaire.trim()) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsSubmitting(true);
    try {
      const newReview = await clientService.addReview({
        hotelId: formData.hotelId,
        note: formData.note,
        commentaire: formData.commentaire,
      });
      setReviews([...reviews, newReview]);
      setFormData({ hotelId: 0, note: 5, commentaire: "" });
      setShowForm(false);
      toast.success("Avis posté avec succès");
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast.error("Erreur lors de la soumission de l'avis");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#0B1E3A] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des avis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0B1E3A] mb-2">Mes avis</h1>
          <p className="text-gray-600">
            Partagez votre expérience avec nos hôtels
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0B1E3A] text-white rounded-lg hover:bg-[#0B1E3A]/90 transition font-medium"
          >
            <Plus size={18} />
            Ajouter un avis
          </button>
        )}
      </div>

      {/* Add Review Form */}
      {showForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-[#0B1E3A] mb-4">
            Laisser un avis
          </h3>

          <div className="space-y-4">
            {/* Hotel Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sélectionnez un hôtel *
              </label>
              <select
                value={formData.hotelId}
                onChange={(e) =>
                  setFormData({ ...formData, hotelId: parseInt(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1E3A]"
              >
                <option value={0}>-- Choisir un hôtel --</option>
                {pastReservations.map((reservation) => (
                  <option key={reservation.hotelId} value={reservation.hotelId}>
                  </option>
                ))}
              </select>
              {pastReservations.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Vous devez avoir une réservation passée pour laisser un avis
                </p>
              )}
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note *
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setFormData({ ...formData, note: star })}
                    className={`text-2xl transition ${
                      star <= formData.note
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre avis *
              </label>
              <textarea
                value={formData.commentaire}
                onChange={(e) =>
                  setFormData({ ...formData, commentaire: e.target.value })
                }
                placeholder="Partagez votre expérience..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1E3A] resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <button
                onClick={handleSubmitReview}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-[#0B1E3A] text-white rounded-lg hover:bg-[#0B1E3A]/90 transition font-medium disabled:opacity-50"
              >
                {isSubmitting ? "Publication..." : "Publier l'avis"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setFormData({ hotelId: 0, note: 5, commentaire: "" });
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.idAvis}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={`${
                            star <= review.note
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {review.note}/5
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(review.creeLe).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <Edit2 size={16} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-red-50 rounded-lg transition">
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>

              <p className="text-gray-700">{review.commentaire}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-12 text-center border border-gray-200">
          <MessageSquare size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 mb-2">Aucun avis pour le moment</p>
          <p className="text-sm text-gray-500">
            Laissez un avis pour partager votre expérience
          </p>
        </div>
      )}
    </div>
  );
}
