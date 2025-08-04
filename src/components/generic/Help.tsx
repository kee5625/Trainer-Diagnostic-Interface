import toast from "react-hot-toast";
import React, { useState } from "react";

// Help page for sending any problems
export default function Help() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast(
        <div>
          <strong>Please fill in all required fields</strong>
          <div>Name, email, and message are required.</div>
        </div>
      );
      return;
    }

    toast(
      <div>
        <strong>Message sent successfully!</strong>
        <div>We'll get back to you within 24 hours.</div>
      </div>
    );

    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="flex-1 px-6 py-1">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Get in Touch
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          We'd love to hear from you. Send us a message and we'll respond as
          soon as possible.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white/5 backdrop-blur-sm border-white/10 rounded-xl flex flex-col items-center">
          <div className="p-5 flex flex-col justify-center items-center gap-2">
            <h1 className="text-white text-2xl pt-5">Send us a Message</h1>
            <p className="text-gray-300">
              Fill out the form below and we'll get back to you soon.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 p-6 w-full max-w-lg"
          >
            <div className="flex flex-col md:flex-row md:space-x-5 space-y-5 md:space-y-0">
              <div className="flex flex-col flex-1 gap-1">
                <label htmlFor="name" className="text-white">
                  Name *
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  className="bg-white/10 border-white/20 py-2 px-3 rounded-xl text-white placeholder:text-gray-400"
                  required
                />
              </div>
              <div className="flex flex-col flex-1 gap-1">
                <label htmlFor="email" className="text-white">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  className="bg-white/10 border-white/20 py-2 px-3 rounded-xl text-white placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="subject" className="text-white">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="What's this about?"
                className="bg-white/10 border-white/20 py-2 px-3 rounded-xl text-white placeholder:text-gray-400"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="message" className="text-white">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us more about your inquiry..."
                rows={6}
                className="bg-white/10 border-white/20 py-2 px-3 rounded-xl text-white placeholder:text-gray-400 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-white font-medium"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Information & Socials */}
        <div className="space-y-8">
          {/* Contact Info */}
          <div className="bg-white/5 backdrop-blur-sm border-white/10 p-6 rounded-xl space-y-6">
            <div className="flex items-center flex-col pt-5 gap-2 px-5"><h1 className="text-white text-2xl">Contact Information</h1>
            <p className="text-gray-300">
              Reach out to us through any of these channels.
            </p></div>

            <div className="space-y-4">
              <ContactItem
                label="Phone"
                value="+1 859-485-7229"
                color="blue"
              />
              <ContactItem
                label="Toll Free"
                value="1-888-738-9924"
                color="purple"
              />
              <ContactItem
                label="Address"
                value="12290 Chandler Drive, Walton, KY 41094"
                color="green"
              />
              <ContactItem
                label="Business Hours"
                value="Mon - Fri: 8:00 AM - 5:00 PM
                        Sat - Sun: Closed"
                color="yellow"
              />
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white/5 backdrop-blur-sm border-white/10 p-6 rounded-xl space-y-3 flex flex-col justify-center items-center">
            <h1 className="text-white text-2xl">Follow Us</h1>
            <p className="text-gray-300">Stay connected on social media.</p>
            <div className="flex space-x-4">
                <button onClick={() => {window.open("https://www.facebook.com/atechtraining", "blank"); }}>
                    {/* <!-- Facebook --> */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7"
                        fill="currentColor"
                        style={{ color: "#1877f2" }}
                        viewBox="0 0 24 24"
                    >
                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                    </svg>
                </button>
                <button onClick={() => {window.open("https://www.instagram.com/atech_training/", "blank"); }}>
                    {/* <!-- Instagram --> */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7"
                        fill="currentColor"
                        style={{ color: "#c13584" }}
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                </button>
                <button onClick={() => {window.open("https://www.youtube.com/user/ATechTraining", "blank"); }}>
                    {/* <!-- Youtube --> */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7"
                        fill="currentColor"
                        style={{ color: "#ff0000" }}
                        viewBox="0 0 24 24"
                    >
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                    </svg>
                </button>
                <button onClick={() => {window.open("https://www.linkedin.com/company/atech-training-inc-/posts/?feedView=all", "blank"); }}>
                    {/* <!-- Linkedin --> */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7"
                        fill="currentColor"
                        style={{ color: "#0077b5" }}
                        viewBox="0 0 24 24"
                    >
                        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                    </svg>
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactItem({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-start space-x-4">
      <div className={`p-3 bg-${color}-500/20 rounded-full`} />
      <div>
        <p className="text-white font-medium">{label}</p>
        <p className="text-gray-300 whitespace-pre-line">{value}</p>
      </div>
    </div>
  );
}
