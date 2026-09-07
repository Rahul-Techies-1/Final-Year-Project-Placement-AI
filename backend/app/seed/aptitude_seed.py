from app.database.session import SessionLocal

from app.models.aptitude_topic import AptitudeTopic
from app.models.aptitude_question import AptitudeQuestion


def seed_aptitude():

    db = SessionLocal()

    try:

        # ====================================================
        # PREVENT DUPLICATE SEEDING
        # ====================================================

        existing_topics = (
            db.query(AptitudeTopic).count()
        )

        if existing_topics > 0:

            print(
                "Aptitude topics already exist. "
                "Skipping seed."
            )

            return

        # ====================================================
        # TOPICS
        # ====================================================

        topics = [

            AptitudeTopic(
                name="Percentages",
                description=(
                    "Percentage calculations, percentage "
                    "increase and decrease, successive "
                    "percentage changes and applications."
                ),
                display_order=1
            ),

            AptitudeTopic(
                name="Profit and Loss",
                description=(
                    "Profit, loss, cost price, selling price, "
                    "discounts and marked price problems."
                ),
                display_order=2
            ),

            AptitudeTopic(
                name="Ratio and Proportion",
                description=(
                    "Ratios, proportions, partnership and "
                    "direct and inverse proportion problems."
                ),
                display_order=3
            ),

            AptitudeTopic(
                name="Time and Work",
                description=(
                    "Work efficiency, combined work, "
                    "pipes and cisterns and work-time problems."
                ),
                display_order=4
            ),

            AptitudeTopic(
                name="Time Speed and Distance",
                description=(
                    "Speed, distance, relative speed, trains, "
                    "boats and streams."
                ),
                display_order=5
            ),

            AptitudeTopic(
                name="Probability",
                description=(
                    "Basic probability, conditional probability "
                    "and probability-based placement questions."
                ),
                display_order=6
            ),

            AptitudeTopic(
                name="Permutation and Combination",
                description=(
                    "Arrangements, selections, permutations "
                    "and combinations."
                ),
                display_order=7
            ),

            AptitudeTopic(
                name="Logical Reasoning",
                description=(
                    "Logical deduction, number patterns, "
                    "coding-decoding and analytical reasoning."
                ),
                display_order=8
            ),

            AptitudeTopic(
                name="Data Interpretation",
                description=(
                    "Tables, percentages, ratios and numerical "
                    "analysis based on given data."
                ),
                display_order=9
            ),

            AptitudeTopic(
                name="Verbal Ability",
                description=(
                    "Grammar, sentence correction, vocabulary, "
                    "reading comprehension and verbal reasoning."
                ),
                display_order=10
            )
        ]

        # ====================================================
        # SAVE TOPICS
        # ====================================================

        db.add_all(topics)

        db.flush()

        # ====================================================
        # QUESTIONS
        # ====================================================

        questions = [

            # =================================================
            # PERCENTAGES
            # =================================================

            AptitudeQuestion(
                topic_id=topics[0].id,
                question=(
                    "A number is increased by 20% and then "
                    "decreased by 20%. What is the overall "
                    "percentage change?"
                ),
                option_a="4% increase",
                option_b="4% decrease",
                option_c="No change",
                option_d="2% decrease",
                correct_answer="B",
                explanation=(
                    "Assume the number is 100. After a 20% "
                    "increase it becomes 120. A 20% decrease "
                    "of 120 is 24, so the final value is 96. "
                    "Therefore there is a 4% decrease."
                ),
                difficulty="Medium",
                is_active=True
            ),

            AptitudeQuestion(
                topic_id=topics[0].id,
                question=(
                    "If 40% of a number is 120, what is the "
                    "number?"
                ),
                option_a="240",
                option_b="280",
                option_c="300",
                option_d="320",
                correct_answer="C",
                explanation=(
                    "40% of x = 120. Therefore x = "
                    "120 / 0.40 = 300."
                ),
                difficulty="Easy",
                is_active=True
            ),

            AptitudeQuestion(
                topic_id=topics[0].id,
                question=(
                    "The population of a city increases by 10% "
                    "in one year and by 20% in the next year. "
                    "What is the total percentage increase?"
                ),
                option_a="30%",
                option_b="32%",
                option_c="28%",
                option_d="35%",
                correct_answer="B",
                explanation=(
                    "Successive increase = 10 + 20 + "
                    "(10 × 20)/100 = 32%."
                ),
                difficulty="Medium",
                is_active=True
            ),

            # =================================================
            # PROFIT AND LOSS
            # =================================================

            AptitudeQuestion(
                topic_id=topics[1].id,
                question=(
                    "An article is bought for ₹800 and sold "
                    "for ₹920. What is the profit percentage?"
                ),
                option_a="12%",
                option_b="15%",
                option_c="18%",
                option_d="20%",
                correct_answer="B",
                explanation=(
                    "Profit = 920 - 800 = ₹120. "
                    "Profit percentage = (120 / 800) × 100 "
                    "= 15%."
                ),
                difficulty="Easy",
                is_active=True
            ),

            AptitudeQuestion(
                topic_id=topics[1].id,
                question=(
                    "A shopkeeper gives a 10% discount on an "
                    "article marked at ₹2000. What is the "
                    "selling price?"
                ),
                option_a="₹1700",
                option_b="₹1750",
                option_c="₹1800",
                option_d="₹1850",
                correct_answer="C",
                explanation=(
                    "Discount = 10% of ₹2000 = ₹200. "
                    "Selling price = ₹2000 - ₹200 = ₹1800."
                ),
                difficulty="Easy",
                is_active=True
            ),

            AptitudeQuestion(
                topic_id=topics[1].id,
                question=(
                    "An article is sold at a profit of 25%. "
                    "If its cost price is ₹1200, what is its "
                    "selling price?"
                ),
                option_a="₹1400",
                option_b="₹1450",
                option_c="₹1500",
                option_d="₹1550",
                correct_answer="C",
                explanation=(
                    "Profit = 25% of ₹1200 = ₹300. "
                    "Selling price = ₹1200 + ₹300 = ₹1500."
                ),
                difficulty="Medium",
                is_active=True
            ),

            # =================================================
            # RATIO AND PROPORTION
            # =================================================

            AptitudeQuestion(
                topic_id=topics[2].id,
                question=(
                    "The ratio of boys to girls in a class is "
                    "3:2. If there are 30 boys, how many girls "
                    "are there?"
                ),
                option_a="15",
                option_b="20",
                option_c="25",
                option_d="18",
                correct_answer="B",
                explanation=(
                    "3 parts represent 30 boys, so one part "
                    "represents 10. Girls = 2 × 10 = 20."
                ),
                difficulty="Easy",
                is_active=True
            ),

            AptitudeQuestion(
                topic_id=topics[2].id,
                question=(
                    "If A:B = 4:5 and B:C = 10:3, then "
                    "A:C is:"
                ),
                option_a="4:3",
                option_b="8:3",
                option_c="5:3",
                option_d="8:5",
                correct_answer="B",
                explanation=(
                    "A:B = 4:5 = 8:10. "
                    "Since B:C = 10:3, A:C = 8:3."
                ),
                difficulty="Medium",
                is_active=True
            ),

            AptitudeQuestion(
                topic_id=topics[2].id,
                question=(
                    "₹1200 is divided among A, B and C in the "
                    "ratio 2:3:5. How much does C receive?"
                ),
                option_a="₹500",
                option_b="₹550",
                option_c="₹600",
                option_d="₹650",
                correct_answer="C",
                explanation=(
                    "Total ratio = 2 + 3 + 5 = 10. "
                    "C receives 5/10 × 1200 = ₹600."
                ),
                difficulty="Easy",
                is_active=True
            ),

            # =================================================
            # TIME AND WORK
            # =================================================

            AptitudeQuestion(
                topic_id=topics[3].id,
                question=(
                    "A can complete a work in 10 days and B "
                    "can complete it in 15 days. How many days "
                    "will they take together?"
                ),
                option_a="5 days",
                option_b="6 days",
                option_c="7 days",
                option_d="8 days",
                correct_answer="B",
                explanation=(
                    "A's rate = 1/10 and B's rate = 1/15. "
                    "Combined rate = 1/10 + 1/15 = 1/6. "
                    "Therefore they take 6 days."
                ),
                difficulty="Medium",
                is_active=True
            ),

            AptitudeQuestion(
                topic_id=topics[3].id,
                question=(
                    "If 5 workers can complete a task in "
                    "12 days, how many days will 10 workers "
                    "take, assuming equal efficiency?"
                ),
                option_a="4 days",
                option_b="5 days",
                option_c="6 days",
                option_d="8 days",
                correct_answer="C",
                explanation=(
                    "Workers and days are inversely proportional. "
                    "5 × 12 = 10 × x, so x = 6 days."
                ),
                difficulty="Easy",
                is_active=True
            ),

            AptitudeQuestion(
                topic_id=topics[3].id,
                question=(
                    "A can complete a work in 20 days. B is "
                    "50% more efficient than A. In how many "
                    "days can B complete the work?"
                ),
                option_a="10 days",
                option_b="12 days",
                option_c="13⅓ days",
                option_d="15 days",
                correct_answer="C",
                explanation=(
                    "B's efficiency is 1.5 times A's efficiency. "
                    "Therefore B's time = 20 / 1.5 = 13⅓ days."
                ),
                difficulty="Hard",
                is_active=True
            ),

            # =================================================
            # TIME SPEED AND DISTANCE
            # =================================================

            AptitudeQuestion(
                topic_id=topics[4].id,
                question=(
                    "A car travels 240 km in 4 hours. "
                    "What is its average speed?"
                ),
                option_a="50 km/h",
                option_b="55 km/h",
                option_c="60 km/h",
                option_d="65 km/h",
                correct_answer="C",
                explanation=(
                    "Speed = Distance / Time = 240 / 4 "
                    "= 60 km/h."
                ),
                difficulty="Easy",
                is_active=True
            ),

            AptitudeQuestion(
                topic_id=topics[4].id,
                question=(
                    "A train travels at 72 km/h. How much "
                    "distance will it cover in 25 seconds?"
                ),
                option_a="400 m",
                option_b="450 m",
                option_c="500 m",
                option_d="550 m",
                correct_answer="C",
                explanation=(
                    "72 km/h = 72 × 5/18 = 20 m/s. "
                    "Distance = 20 × 25 = 500 m."
                ),
                difficulty="Medium",
                is_active=True
            ),

            AptitudeQuestion(
                topic_id=topics[4].id,
                question=(
                    "Two cars travel in opposite directions "
                    "at 50 km/h and 70 km/h. What is their "
                    "relative speed?"
                ),
                option_a="20 km/h",
                option_b="50 km/h",
                option_c="70 km/h",
                option_d="120 km/h",
                correct_answer="D",
                explanation=(
                    "When two objects move in opposite "
                    "directions, relative speed is the sum "
                    "of their speeds: 50 + 70 = 120 km/h."
                ),
                difficulty="Easy",
                is_active=True
            ),

            # =================================================
            # PROBABILITY
            # =================================================

            AptitudeQuestion(
                topic_id=topics[5].id,
                question=(
                    "A fair coin is tossed once. What is the "
                    "probability of getting a head?"
                ),
                option_a="0",
                option_b="1/4",
                option_c="1/2",
                option_d="1",
                correct_answer="C",
                explanation=(
                    "There are two equally likely outcomes: "
                    "Head and Tail. Therefore probability of "
                    "Head = 1/2."
                ),
                difficulty="Easy",
                is_active=True
            ),

            AptitudeQuestion(
                topic_id=topics[5].id,
                question=(
                    "A standard die is rolled once. What is "
                    "the probability of getting an even number?"
                ),
                option_a="1/6",
                option_b="1/3",
                option_c="1/2",
                option_d="2/3",
                correct_answer="C",
                explanation=(
                    "Even outcomes are 2, 4 and 6. "
                    "There are 3 favorable outcomes out of "
                    "6 total outcomes. Probability = 3/6 = 1/2."
                ),
                difficulty="Easy",
                is_active=True
            ),

            AptitudeQuestion(
                topic_id=topics[5].id,
                question=(
                    "A bag contains 5 red and 3 blue balls. "
                    "One ball is selected randomly. What is "
                    "the probability that it is blue?"
                ),
                option_a="3/5",
                option_b="3/8",
                option_c="5/8",
                option_d="1/3",
                correct_answer="B",
                explanation=(
                    "Total balls = 5 + 3 = 8. "
                    "Blue balls = 3. Probability = 3/8."
                ),
                difficulty="Medium",
                is_active=True
            ),

            # =================================================
            # PERMUTATION AND COMBINATION
            # =================================================

            AptitudeQuestion(
                topic_id=topics[6].id,
                question=(
                    "In how many ways can 3 different books "
                    "be arranged on a shelf?"
                ),
                option_a="3",
                option_b="6",
                option_c="9",
                option_d="12",
                correct_answer="B",
                explanation=(
                    "The number of arrangements of 3 different "
                    "objects is 3! = 3 × 2 × 1 = 6."
                ),
                difficulty="Easy",
                is_active=True
            ),

            AptitudeQuestion(
                topic_id=topics[6].id,
                question=(
                    "How many ways can 2 students be selected "
                    "from a group of 5 students?"
                ),
                option_a="5",
                option_b="8",
                option_c="10",
                option_d="20",
                correct_answer="C",
                explanation=(
                    "Selection uses combination. "
                    "5C2 = 5! / (2!3!) = 10."
                ),
                difficulty="Medium",
                is_active=True
            ),

            AptitudeQuestion(
                topic_id=topics[6].id,
                question=(
                    "How many 3-digit numbers can be formed "
                    "using digits 1, 2, 3, 4 and 5 without "
                    "repetition?"
                ),
                option_a="15",
                option_b="30",
                option_c="60",
                option_d="125",
                correct_answer="C",
                explanation=(
                    "There are 5 choices for the first digit, "
                    "4 for the second and 3 for the third. "
                    "Total = 5 × 4 × 3 = 60."
                ),
                difficulty="Medium",
                is_active=True
            ),

            # =================================================
            # LOGICAL REASONING
            # =================================================

            AptitudeQuestion(
                topic_id=topics[7].id,
                question=(
                    "Find the next number in the series: "
                    "2, 6, 12, 20, 30, ?"
                ),
                option_a="36",
                option_b="40",
                option_c="42",
                option_d="44",
                correct_answer="C",
                explanation=(
                    "The differences are 4, 6, 8, 10. "
                    "The next difference is 12. "
                    "Therefore 30 + 12 = 42."
                ),
                difficulty="Medium",
                is_active=True
            ),

            AptitudeQuestion(
                topic_id=topics[7].id,
                question=(
                    "If CAT is coded as DBU, how is DOG coded "
                    "using the same pattern?"
                ),
                option_a="EPH",
                option_b="EOH",
                option_c="DPH",
                option_d="FPH",
                correct_answer="A",
                explanation=(
                    "Each letter is shifted forward by one "
                    "position. D becomes E, O becomes P and "
                    "G becomes H. Therefore DOG becomes EPH."
                ),
                difficulty="Easy",
                is_active=True
            ),

            AptitudeQuestion(
                topic_id=topics[7].id,
                question=(
                    "If all engineers are graduates and some "
                    "graduates are programmers, which statement "
                    "is definitely true?"
                ),
                option_a=(
                    "All programmers are engineers."
                ),
                option_b=(
                    "All engineers are graduates."
                ),
                option_c=(
                    "No graduate is a programmer."
                ),
                option_d=(
                    "All graduates are engineers."
                ),
                correct_answer="B",
                explanation=(
                    "The statement directly establishes that "
                    "every engineer belongs to the group of "
                    "graduates. Therefore all engineers are "
                    "graduates."
                ),
                difficulty="Medium",
                is_active=True
            ),

            # =================================================
            # DATA INTERPRETATION
            # =================================================

            AptitudeQuestion(
                topic_id=topics[8].id,
                question=(
                    "A company sold 200 units in January and "
                    "300 units in February. What was the "
                    "percentage increase in sales?"
                ),
                option_a="25%",
                option_b="40%",
                option_c="50%",
                option_d="60%",
                correct_answer="C",
                explanation=(
                    "Increase = 300 - 200 = 100. "
                    "Percentage increase = 100/200 × 100 = 50%."
                ),
                difficulty="Easy",
                is_active=True
            ),

            AptitudeQuestion(
                topic_id=topics[8].id,
                question=(
                    "A student scored 70, 80, 90 and 60 in "
                    "four subjects. What is the average score?"
                ),
                option_a="70",
                option_b="72",
                option_c="75",
                option_d="80",
                correct_answer="C",
                explanation=(
                    "Average = (70 + 80 + 90 + 60) / 4 "
                    "= 300 / 4 = 75."
                ),
                difficulty="Easy",
                is_active=True
            ),

            AptitudeQuestion(
                topic_id=topics[8].id,
                question=(
                    "A company has 120 employees. 40% work "
                    "in the technical department. How many "
                    "employees work in technical?"
                ),
                option_a="36",
                option_b="40",
                option_c="48",
                option_d="52",
                correct_answer="C",
                explanation=(
                    "40% of 120 = 0.40 × 120 = 48 employees."
                ),
                difficulty="Easy",
                is_active=True
            ),

            # =================================================
            # VERBAL ABILITY
            # =================================================

            AptitudeQuestion(
                topic_id=topics[9].id,
                question=(
                    "Choose the word that is closest in meaning "
                    "to 'Abundant'."
                ),
                option_a="Scarce",
                option_b="Plentiful",
                option_c="Limited",
                option_d="Rare",
                correct_answer="B",
                explanation=(
                    "Abundant means available in large quantity "
                    "or plentiful."
                ),
                difficulty="Easy",
                is_active=True
            ),

            AptitudeQuestion(
                topic_id=topics[9].id,
                question=(
                    "Choose the grammatically correct sentence."
                ),
                option_a=(
                    "He don't like coffee."
                ),
                option_b=(
                    "He doesn't likes coffee."
                ),
                option_c=(
                    "He doesn't like coffee."
                ),
                option_d=(
                    "He not like coffee."
                ),
                correct_answer="C",
                explanation=(
                    "With 'doesn't', the main verb remains in "
                    "its base form: 'doesn't like'."
                ),
                difficulty="Easy",
                is_active=True
            ),

            AptitudeQuestion(
                topic_id=topics[9].id,
                question=(
                    "Choose the word opposite in meaning to "
                    "'Optimistic'."
                ),
                option_a="Hopeful",
                option_b="Positive",
                option_c="Confident",
                option_d="Pessimistic",
                correct_answer="D",
                explanation=(
                    "Optimistic means expecting positive outcomes. "
                    "Its opposite is pessimistic."
                ),
                difficulty="Easy",
                is_active=True
            )
        ]

        # ====================================================
        # SAVE QUESTIONS
        # ====================================================

        db.add_all(questions)

        db.commit()

        print(
            f"Aptitude seed completed successfully. "
            f"Added {len(topics)} topics and "
            f"{len(questions)} questions."
        )

    except Exception:

        db.rollback()

        raise

    finally:

        db.close()


if __name__ == "__main__":

    seed_aptitude()