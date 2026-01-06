export default function HotelExperience3D({ url }: { url: string }) {
  // if (!url) return null;

  // return (
  //   <section className="py-20 bg-white">
  //     <div className="max-w-7xl mx-auto px-6">
  //       <h2 className="text-2xl font-bold text-slate-900 mb-8">
  //         Visite virtuelle
  //       </h2>

  //       <div className="rounded-3xl overflow-hidden shadow-lg aspect-video">
  //         <iframe
  //           src={url}
  //           allowFullScreen
  //           loading="lazy"
  //           className="w-full h-full border-none"
  //           title="Visite virtuelle de l'hôtel"
  //         />
  //       </div>
  //     </div>
  //   </section>
  // );

  if (!url || url.includes("example")) {
    return (
      <div className="py-20 text-center text-slate-500">
        Visite 3D indisponible pour cet hôtel
      </div>
    );
  }

}
