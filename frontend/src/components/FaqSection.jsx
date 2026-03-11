import { useState } from 'react';
import { faqs } from '../data/siteContent';

function FaqSection() {
  const [activeFaq, setActiveFaq] = useState(0);

  return (
    <section className="section faq">
      <h2>Frequently Asked</h2>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={faq.question} className="faq-item">
            <button
              className="faq-question"
              onClick={() => setActiveFaq(activeFaq === index ? -1 : index)}
              type="button"
            >
              {faq.question}
              <span>{activeFaq === index ? '-' : '+'}</span>
            </button>
            {activeFaq === index ? <p className="faq-answer">{faq.answer}</p> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export default FaqSection;
