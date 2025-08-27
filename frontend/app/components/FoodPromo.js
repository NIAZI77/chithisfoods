"use client";

const FoodPromo = () => {
  return (
    <section className="bg-green-50 rounded-2xl p-8 grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-[90%] mx-auto shadow-lg mt-10 items-center">
      <div className="order-1 md:order-2 relative w-40 h-40 md:w-64 md:h-64 mx-auto lg:col-span-1 flex items-center justify-center overflow-hidden">
        <div className="w-full h-full overflow-hidden rounded-xl">
          <img
            src="/foodPromo.png"
            alt="Delicious food"
            className="object-cover w-full h-full max-w-xs rounded-xl"
          />
        </div>
      </div>

      <div className="order-2 md:order-1 text-center md:text-left lg:col-span-2 md:px-4">
        <h2 className="lg:text-4xl md:text-2xl text-xl font-extrabold text-gray-900 cursive">
          A Guilt-Free Shortcut to <br />
          <span className="text-green-500">Delicious Dinners</span>
        </h2>
        <p className="text-gray-600 mt-4">
          With the Weekly Shef Service, your chef prepares fresh meals for you
          and a small group, packed with care and delivered straight to your
          door.
        </p>
        <button className="mt-6 px-6 py-3 bg-rose-600 text-white rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
          Order Now
        </button>
      </div>
    </section>
  );
};

export default FoodPromo;
