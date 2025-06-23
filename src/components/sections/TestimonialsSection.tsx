
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Propriétaire, Restaurant Le Petit Bistro",
      content: "Clara a transformé notre service client. Nous ne perdons plus aucune réservation, même la nuit.",
      rating: 5,
      metric: "+40% de réservations"
    },
    {
      name: "Thomas Martin",
      role: "Directeur, Clinique Saint-Louis",
      content: "Nos patients apprécient la disponibilité 24/7. Clara prend les rendez-vous avec une précision remarquable.",
      rating: 5,
      metric: "95% de satisfaction client"
    },
    {
      name: "Sophie Leroy",
      role: "Gérante, Hôtel des Alpes",
      content: "Installation en 5 minutes, résultats immédiats. Clara s'adapte parfaitement à notre ton professionnel.",
      rating: 5,
      metric: "ROI de 300% en 3 mois"
    }
  ];

  return (
    <section className="py-20 px-6 lg:px-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Ils nous font confiance
          </h2>
          <p className="text-lg text-gray-600">
            Découvrez l'impact de Clara sur leur business
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white border-0 shadow-modern hover-lift">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-gray-700 mb-6 leading-relaxed text-sm">
                  "{testimonial.content}"
                </blockquote>
                
                <div className="border-t border-gray-100 pt-4">
                  <div className="font-semibold text-gray-900 mb-1 text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-600 text-xs mb-3">
                    {testimonial.role}
                  </div>
                  <div className="bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded-full inline-block">
                    {testimonial.metric}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
