const faqs = [
  {
    question: "What is the difference between a mentor and a mentee?",
    answer:
      "A mentor is an experienced individual who provides guidance and support to a mentee. A mentee is an individual who is looking for guidance and support from a mentor.",
  },
  {
    question: "What is the time commitment?",
    answer:
      "The time commitment is up to you! We recommend meeting with your mentor/mentee at least once a month for 1 hour.",
  },
  {
    question: "How long is the program?",
    answer:
      "The program is 6 months long. We will match mentors and mentees in October 2021 and the program will end in March 2022.",
  },
  {
    question: "What if I don’t like my mentor/mentee?",
    answer:
      "We will do our best to match you with someone who has similar interests and goals. However, if you do not like your mentor/mentee, you can contact us and we will try to find you a new match.",
  },
  {
    question: "Can I be both a mentor and a mentee?",
    answer:
      "Yes! You can be both a mentor and a mentee. Please fill out both forms.",
  },
];

export const FaqSection = () => {
  return (
    <section id="faq" className="py-12 md:py-24 bg-gray-200">
      <h2 className="text-3xl font-bold text-center mb-6">
        Frequently Asked Questions
      </h2>
      <div className="max-w-2xl mx-auto">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item my-4">
            <div className="faq-question font-semibold">{faq.question}</div>
            <div className="faq-answer mt-2">{faq.answer}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
