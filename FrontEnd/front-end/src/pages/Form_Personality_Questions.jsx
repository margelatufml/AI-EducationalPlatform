import React, { useState } from "react";
import { motion } from "framer-motion";

const questions = [
  { id: 1, question: "Cat de mult ti-a placut produsul nostru?" },
  { id: 2, question: "L-ai recomanda altor persoane?" },
  { id: 3, question: "Would you recommend us to others?" },
  { id: 4, question: "Any other feedback?" },
];

const FeedbackForm = () => {
  const [responses, setResponses] = useState({});

  const handleChange = (id, value) => {
    setResponses({ ...responses, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("apiintelecta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(responses),
      });
      if (response.ok) {
        alert("Feedback submitted successfully!");
      } else {
        alert("Error submitting feedback");
      }
    } catch (error) {
      alert("Error submitting feedback: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gunmetal-blue p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Feedback Form</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {questions.map((q) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * q.id, duration: 0.5 }}
            >
              <label className="block text-lg mb-2">{q.question}</label>
              {q.id !== 4 ? (
                <input
                  type="text"
                  className="w-full p-2 border-4 border-gunmetal-blue rounded bg-transparent  "
                  onChange={(e) => handleChange(q.id, e.target.value)}
                />
              ) : (
                <textarea
                  className="w-full p-2 border-4 border-gunmetal-blue rounded bg-transparent"
                  onChange={(e) => handleChange(q.id, e.target.value)}
                />
              )}
            </motion.div>
          ))}
          <motion.button
            type="submit"
            className="w-full py-2 px-4 bg-gunmetal-blue text-white font-bold rounded hover:bg-gunmetal-blue"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Submit
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default FeedbackForm;
