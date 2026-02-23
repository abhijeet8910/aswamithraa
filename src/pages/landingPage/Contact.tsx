
import bgImage from "@/assets/hero-farm.jpg";

const Contact = () => {
  return (
    <section className="relative min-h-screen mt-20 w-full">
      
      {/* Fixed Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      />

      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-black/70 -z-10" />

      <div className="max-w-7xl mx-auto px-6 py-12 relative">

        {/* Title */}
        <div className="text-center mb-12 text-white">
          <h1 className="text-4xl md:text-5xl font-bold">
            Contact FarmConnect Marketplace
          </h1>
          <p className="mt-4 text-gray-300">
            Have questions about buying, bulk orders, or farmer partnerships?
            Our team is here to help you.
          </p>
        </div>

        {/* Contact Card */}
        <div className="bg-white/10 backdrop-blur-md border border-slate-600/40 rounded-2xl shadow-2xl p-8 max-w-3xl mx-auto text-center space-y-6 text-white">

          <h2 className="text-2xl font-semibold">
            Marketplace Support
          </h2>

          <p className="text-slate-300">
            FarmConnect Online Platform <br />
            Connecting Farmers & Buyers Across India
          </p>

          <p className="font-medium text-lg">
            📞 +91 90000 00000
          </p>

          <p className="text-slate-400 text-sm">
            ✉ support@farmconnect.com
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">

            {/* Call Button */}
            <a href="tel:+919000000000">
              <button className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition">
                📞 Call Support
              </button>
            </a>

            {/* WhatsApp Button */}
            <a
              href="https://wa.me/919000000000"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="px-8 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition">
                💬 WhatsApp Chat
              </button>
            </a>
          </div>

          <p className="text-slate-400 mt-4">
            Support Hours: Monday – Saturday | 8:00 AM – 8:00 PM
          </p>
        </div>

        {/* Map Section */}
        <div className="mt-12 bg-white/10 backdrop-blur-md border border-slate-600/40 shadow-2xl rounded-2xl p-6 max-w-5xl mx-auto text-white">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Our Operations Location
          </h2>

          <div className="w-full h-80 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps?q=India&output=embed"
              width="100%"
              height="100%"
              loading="lazy"
              className="border-0"
            ></iframe>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;