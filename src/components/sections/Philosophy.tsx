
const Philosophy = () => {
  return (
    <section className="py-24 px-6 lg:px-8 bg-graphite-50">
      <div className="max-w-4xl mx-auto text-center animate-fade-in">
        <h2 className="text-4xl md:text-5xl font-bold mb-8">
          Notre <span className="text-gradient">engagement</span>
        </h2>
        
        <div className="bg-pure-white rounded-3xl p-12 shadow-lg border border-graphite-200">
          <p className="text-xl md:text-2xl text-graphite-700 leading-relaxed mb-8">
            Chez Thalya, nous croyons que la technologie la plus puissante est celle qui 
            <span className="font-semibold text-electric-blue"> disparaît</span> pour laisser place à une 
            interaction humaine et efficace.
          </p>
          
          <p className="text-lg text-graphite-600 leading-relaxed mb-8">
            Nous ne vendons pas des bots ; nous créons des partenaires digitaux qui incarnent 
            la voix et les valeurs de nos clients. Chaque interaction est une opportunité de 
            renforcer votre marque et de créer des liens authentiques avec vos clients.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-electric-blue mb-2">100%</div>
              <p className="text-graphite-600">Sécurisé</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-electric-blue mb-2">24/7</div>
              <p className="text-graphite-600">Disponible</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-electric-blue mb-2">∞</div>
              <p className="text-graphite-600">Évolutif</p>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
          <div className="text-center">
            <div className="w-16 h-16 bg-graphite-200 rounded-xl mx-auto mb-2"></div>
            <p className="text-sm text-graphite-500">Certifié SOC 2</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-graphite-200 rounded-xl mx-auto mb-2"></div>
            <p className="text-sm text-graphite-500">RGPD Compliant</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-graphite-200 rounded-xl mx-auto mb-2"></div>
            <p className="text-sm text-graphite-500">Chiffrement AES-256</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-graphite-200 rounded-xl mx-auto mb-2"></div>
            <p className="text-sm text-graphite-500">Hébergement France</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
