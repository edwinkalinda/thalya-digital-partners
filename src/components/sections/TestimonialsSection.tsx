
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useTestimonials } from '@/hooks/useTestimonials';

const TestimonialsSection = () => {
  const { featuredTestimonials, loading } = useTestimonials();

  if (loading) {
    return (
      <section className="py-24 px-6 lg:px-8 bg-gradient-to-br from-graphite-50 to-pure-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-12"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6 lg:px-8 bg-gradient-to-br from-graphite-50 to-pure-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 mb-6 bg-emerald-100 border border-emerald-200 rounded-full text-emerald-700 font-medium text-sm">
            <Star className="w-4 h-4 mr-2 fill-current" />
            Témoignages Clients
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-deep-black">
            Ils ont choisi Clara et
            <br />
            <span className="text-gradient">transformé leur business</span>
          </h2>
          
          <p className="text-xl text-graphite-600 max-w-3xl mx-auto">
            Découvrez comment nos clients utilisent l'IA Clara pour automatiser leur accueil 
            et booster leurs performances commerciales.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="relative overflow-hidden border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="absolute top-4 right-4 text-electric-blue/20">
                  <Quote className="w-8 h-8" />
                </div>
                
                <div className="flex items-center mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-graphite-700 mb-6 text-lg leading-relaxed">
                  "{testimonial.testimonial_text}"
                </blockquote>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-electric-blue to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {testimonial.client_name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-deep-black">
                      {testimonial.client_name}
                    </div>
                    <div className="text-sm text-graphite-500">
                      {testimonial.business_name} • {testimonial.business_type}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center px-6 py-3 bg-green-50 border border-green-200 rounded-full text-green-700 font-medium">
            ⭐ Note moyenne de 4.9/5 sur plus de 200 clients
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
