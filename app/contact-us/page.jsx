"use client";

import { useForm } from "react-hook-form";
import Header from "../../components/Header";
import { Footer } from "../../components/Footer";

export default function ContactUs() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    reset();
    alert("Message sent successfully!");
  };

  return (
    <div>
      <Header />
      {/* Banner */}
      <div className="bg-[url('/shared/banner.png')] font-fredoka font-semibold text-[30px] lg:text-[40px] text-center bg-cover bg-center text-white flex items-center justify-center h-53">
        <h1 className="text-3xl lg:text-4xl font-bold">Contact Us</h1>
      </div>

      {/* Contact form section */}
      <div className="max-w-full mx-20 px-5 py-16">
        <h2 className=" text-4xl font-bold text-start mb-3">
          Love to hear from you,
          <br />
          Get in touch <span className="inline-block">👋</span>
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">
          {/* Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium">
                Your Name*
              </label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                {...register("name", { required: "Name is required" })}
                className="w-full px-4 py-3 rounded-full border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Email*</label>
              <input
                type="email"
                placeholder="e.g. johankevingmail.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Invalid email address",
                  },
                })}
                className="w-full px-4 py-3 rounded-full border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Your Message*
            </label>
            <textarea
              rows={5}
              placeholder="Leave us a message..."
              {...register("message", { required: "Message is required" })}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            {errors.message && (
              <p className="text-sm text-red-500 mt-1">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-purple-700 text-white font-semibold px-10 py-3 rounded-full text-lg shadow-md transition"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
