"use client";
import { motion } from "framer-motion";
import { FaqSection } from "@/components/FAQ";

export default function Page() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="bg-background text-white py-12 md:py-18"
      >
        <div className="max-w-6xl mx-auto px-5">
          <section className="mb-20">
            <FaqSection id="faq" />
          </section>

          <section className="mb-20 gradientBG rounded-lg p-8 m-4">
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-3xl text-accent font-bold mb-6"
              id="about"
            >
              About Chat2Print
            </motion.h2>

            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-lg mb-4"
            >
              <p className="text-lg mb-4">
                Founded in the last quarter of 2023, Chat2Print is an innovative
                AI art print-on-demand service, we specialize in materializing
                ChatGPT-generated art into tangible products. Our convenient
                browser extension simplifies the process, allowing direct
                uploads from the ChatGPT interface to product customization and
                printing on diverse items. Chat2Print emerged from the desire to
                bring digital art into the physical realm, making it a part of
                daily life beyond digital screens and X threads.
              </p>

              <p className="text-lg mb-4">
                Chat2Print empowers you with complete creative freedom. With our
                platform, the wait is over for designers and manufacturers. Our
                Prompt-to-Print process transforms your concepts into reality
                swiftly.
              </p>

              <p className="text-lg mb-4">
                As a trailblazer in the niche, Chat2Print stands as the premier
                print-on-demand platform for ChatGPT art, conceived from a
                single developer&apos;s passion. Now, your digital creations
                transcend the virtual space, becoming cherished physical items
                that you can display or share as gifts.
              </p>

              <p className="text-lg mb-4">
                My personal love for solar system art, augmented by AI, drove
                the creation of Chat2Print. It&apos;s my aspiration that
                Chat2Print will help you bring your artistic visions to life
                too.
              </p>

              <p className="text-lg mb-4">
                In early release, we&apos;re continuously growing our product
                range and enhancing features. We welcome your feedback at{" "}
                <a className="text-accent" href="mailto:support@chat2print.xyz">
                  support@chat2print.xyz
                </a>
                .
              </p>

              <p className="text-lg mb-4">
                Thank you for your support and we look forward to serving you!
              </p>
            </motion.div>
          </section>

          <section className="mb-20 gradientBG rounded-lg p-8 m-4">
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-3xl text-accent font-bold mb-6"
              id="returns"
            >
              Return Policy
            </motion.h2>

            <p className="text-muted text-sm">
              {" "}
              <em>Last updated on October, 2023</em>
            </p>
            <p className="text-muted text-sm">
              {" "}
              Any claims for misprinted/damaged/defective items must be
              submitted within 30 days after the product has been received. For
              packages lost in transit, all claims must be submitted no later
              than 30 days after the estimated delivery date. Claims deemed an
              error on our part are covered at our expense.
            </p>
            <p className="text-muted text-sm">
              {" "}
              If you notice an issue on the products or anything else on the
              order, please submit a problem report to{" "}
              <a className="text-accent" href="mailto:support@chat2print.xyz">
                {" "}
                support@chat2print.xyz
              </a>
            </p>
            <p className="text-muted text-sm my-2">
              {" "}
              The return address is set by default to the Printful facility.
              When we receive a returned shipment, an automated email
              notification will be sent to you. Unclaimed returns get donated to
              charity after 30 days.
            </p>

            <p className="text-muted text-sm my-2">
              {" "}
              <strong>Wrong Address -</strong>
              If you provide an address that is considered insufficient by the
              courier, the shipment will be returned to our facility. You will
              be liable for reshipment costs once we have confirmed an updated
              address with you (if and as applicable).
            </p>
            <p className="text-muted text-sm my-2">
              {" "}
              <strong>Unclaimed -</strong> Shipments that go unclaimed are
              returned to our facility and you will be liable for the cost of a
              reshipment to yourself (if and as applicable).
            </p>

            <p className="text-muted text-sm my-2">
              {" "}
              <strong>Returned by Customer -</strong> It is best to contact us
              before returning any products.&nbsp;Except for Customers residing
              in Brazil,&nbsp;we do not refund orders for buyer&apos;s remorse.
              Returns for products and size exchanges are to be offered at our
              expense and discretion. If we choose to accept returns or offer
              size exchanges for you there may be additional costs to
              you.&nbsp;Customers residing in Brazil and regretting a purchase
              must contact our Customer Service and express their will to return
              the item within 7 consecutive days after receiving it, providing a
              picture of the item. The withdrawal request will undergo an
              evaluation to verify whether the product was used or destroyed,
              even if partial. In these cases, a refund will not be possible.
            </p>
            <p className="text-muted text-sm my-2">
              {" "}
              <strong>Notification for EU consumers:</strong> According to
              Article 16(c) and (e) of the Directive 2011/83/EU of the European
              Parliament and of the Council of 25 October 2011 on consumer
              rights, the right of withdrawal may not be provided for:
            </p>
            <p className="text-muted text-sm my-2">
              {" "}
              1. the supply of goods that are made to the consumer&apos;s
              specifications or are clearly personalized;
              <br />
              2. sealed goods which were unsealed after delivery and thus
              aren&apos;t suitable for return due to health protection or
              hygiene reasons,
            </p>
            <p className="text-muted text-sm my-2">
              {" "}
              therefore Chat2Print reserves rights to refuse returns at its sole
              discretion.
            </p>
            <p className="text-muted text-sm my-2">
              {" "}
              This Policy shall be governed and interpreted in accordance with
              the English language, regardless of any translations made for any
              purpose whatsoever.
            </p>
          </section>
        </div>
      </motion.div>
    </>
  );
}
