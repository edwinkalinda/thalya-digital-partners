
const Philosophy = () => {
  return (
    <section className="py-24 px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-gray-900">
          Notre engagement
        </h2>
        
        <div className="bg-gray-50 rounded-2xl p-12 border border-gray-200">
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            Chez Thalya, nous croyons que la technologie la plus puissante est celle qui 
            <span className="font-semibold text-blue-600"> disparaît</span> pour laisser place à une 
            interaction humaine et efficace.
          </p>
          
          <p className="text-lg text-gray-600 leading-relaxed mb-12">
            Nous ne vendons pas des bots ; nous créons des partenaires digitaux qui incarnent 
            la voix et les valeurs de nos clients.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
              <p className="text-gray-600">Sécurisé</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <p className="text-gray-600">Disponible</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">∞</div>
              <p className="text-gray-600">Évolutif</p>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-xl mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Certifié SOC 2</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-xl mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">RGPD Compliant</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-xl mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Chiffrement AES-256</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-xl mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Hébergement France</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
