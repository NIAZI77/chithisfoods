"use client";

import Image from "next/image";
import { FaStar } from "react-icons/fa";

const testimonials = [
  {
    name: "Emily Johnson",
    image: "/person-1.jpg",
    text: "Chithi's Foods is a game changer! I ordered from three different spots in one go, and everything was fresh and on time. No more switching between apps—love it! 🍔🍕",
    rating: 5,
  },
  {
    name: "David Miller",
    image: "/person-2.jpeg",
    text: "Super easy to use, and the food choices are endless! I got some amazing BBQ from a local vendor I never knew about. Definitely ordering again. 🔥🍗",
    rating: 5,
  },
  {
    name: "Michael John",
    image: "/person-3.jpg",
    text: "Really cool concept! The food was great, and I love supporting small vendors. Just wish there were more delivery tracking updates. Still, super happy! 🚀",
    rating: 4,
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <h2 className="text-3xl px-4 font-bold mb-16 text-gray-900 text-center">
        What clients say about us
      </h2>
      <div className="flex flex-wrap justify-center gap-16">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-gray-100 p-6 rounded-xl shadow-md md:w-84 w-80 flex flex-col"
          >
            <Image
              src={testimonial.image}
              alt={testimonial.name}
              width={80}
              height={80}
              className="rounded-full border-4 w-20 h-20 border-white shadow-md -mt-14 object-cover"
            />
            <h3 className="mt-4 text-xl font-semibold text-gray-900 text-left">
              {testimonial.name}
            </h3>
            <p className="mt-2 text-gray-600 text-sm flex-1 text-left">
              {testimonial.text}
            </p>
            <div className="mt-3 flex gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={
                    i < testimonial.rating ? "text-yellow-500" : "text-gray-300"
                  }
                >
                  <FaStar className="text-xl" />
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
