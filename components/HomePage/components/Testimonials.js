export default function Testimonials() {
    const testimonials = [
      {
        name: "Alice Johnson",
        feedback: "The platform made managing my event so simple! I highly recommend it.",
      },
      {
        name: "David Lee",
        feedback: "Buying tickets and staying updated on events has never been easier.",
      },
    ];
  
    return (
      <section className="py-16 bg-neutral-100">
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="text-4xl font-bold text-center mb-8">What Our Users Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 bg-white shadow-md rounded-lg text-center"
              >
                <p className="italic text-gray-700 mb-4">"{testimonial.feedback}"</p>
                <h4 className="text-lg font-bold">{testimonial.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  