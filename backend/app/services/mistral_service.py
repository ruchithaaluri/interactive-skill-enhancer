import os
import re
import math
import ast
import operator
import json
import random
import time
import urllib.request
import urllib.parse
from dotenv import load_dotenv
from app.utils.system_prompt import SYSTEM_PROMPT

load_dotenv()

api_key = os.getenv("MISTRAL_API_KEY", "")

client = None
if api_key and api_key != "your_mistral_api_key_here":
    try:
        from mistralai import Mistral
        client = Mistral(api_key=api_key)
    except Exception as e:
        print(f"[INFO] Mistral client init status: {e}")

# Safe AST evaluator for arbitrary math expressions
SAFE_OPERATORS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.Pow: operator.pow,
    ast.Mod: operator.mod,
    ast.USub: operator.neg,
    ast.UAdd: operator.pos,
}

def eval_math_ast(node):
    if isinstance(node, ast.Constant):
        return node.value
    elif isinstance(node, ast.BinOp):
        left = eval_math_ast(node.left)
        right = eval_math_ast(node.right)
        op_type = type(node.op)
        if op_type in SAFE_OPERATORS:
            if op_type == ast.Div and right == 0:
                raise ValueError("Division by zero")
            return SAFE_OPERATORS[op_type](left, right)
    elif isinstance(node, ast.UnaryOp):
        operand = eval_math_ast(node.operand)
        op_type = type(node.op)
        if op_type in SAFE_OPERATORS:
            return SAFE_OPERATORS[op_type](operand)
    raise ValueError("Unsupported expression")


def try_solve_math(text: str):
    """Parses and calculates math problems dynamically."""
    cleaned = text.lower().replace("what is", "").replace("calculate", "").replace("solve", "").replace("equal", "").replace("how much is", "").strip()
    cleaned = cleaned.rstrip("?").strip()

    pct_match = re.search(r'(\d+(?:\.\d+)?)\s*%\s*of\s*(\d+(?:\.\d+)?)', cleaned)
    if pct_match:
        pct = float(pct_match.group(1))
        val = float(pct_match.group(2))
        res = (pct / 100.0) * val
        return f"📐 **Math Solution**:\n\n**{pct:g}% of {val:g}** = **{res:g}**\n\n*Step-by-Step*:\n1. Convert percentage to fraction: \\({pct:g} \\div 100 = {pct/100:g}\\)\n2. Multiply by value: \\({pct/100:g} \\times {val:g} = {res:g}\\)"

    sqrt_match = re.search(r'(?:square root of|sqrt)\s*(\d+(?:\.\d+)?)', cleaned)
    if sqrt_match:
        val = float(sqrt_match.group(1))
        res = math.sqrt(val)
        return f"📐 **Math Solution**:\n\n\\(\\sqrt{{{val:g}}} = \\mathbf{{{res:g}}}\\)\n\n*Explanation*: \\({res:g} \\times {res:g} = {val:g}\\)."

    expr = cleaned.replace("x", "*").replace("times", "*").replace("divided by", "/").replace("plus", "+").replace("minus", "-")
    expr = re.sub(r'[^0-9\+\-\*\/\(\)\.\s]', '', expr).strip()

    if expr and re.search(r'\d', expr) and re.search(r'[\+\-\*\/]', expr):
        try:
            parsed = ast.parse(expr, mode='eval')
            res = eval_math_ast(parsed.body)
            return f"📐 **Math Solution**:\n\n**{expr}** = **{res:g}**\n\n*Result*: The exact calculated answer is **{res:g}**."
        except Exception:
            pass

    return None


KNOWLEDGE_MAP = [
    (r'capital of france', "🇫🇷 **Capital of France**: **Paris** is the capital and largest city of France, famous for the Eiffel Tower, Louvre Museum, and rich culture."),
    (r'capital of (india|bharat)', "🇮🇳 **Capital of India**: **New Delhi** is the capital of India, seat of all three branches of the Government of India."),
    (r'capital of (usa|united states|america)', "🇺🇸 **Capital of the USA**: **Washington, D.C.** is the capital of the United States of America."),
    (r'capital of (japan)', "🇯🇵 **Capital of Japan**: **Tokyo** is the capital of Japan and the world's most populous metropolitan area."),
    (r'capital of (germany)', "🇩🇪 **Capital of Germany**: **Berlin** is the capital and largest city of Germany."),
    (r'capital of (uk|united kingdom|england)', "🇬🇧 **Capital of the UK**: **London** is the capital city of the United Kingdom."),
    (r'capital of (china)', "🇨🇳 **Capital of China**: **Beijing** is the capital city of China."),
    (r'capital of (canada)', "🇨🇦 **Capital of Canada**: **Ottawa** is the capital city of Canada."),
    (r'why is (the )?sky blue', "☀️ **Why is the Sky Blue?**:\n\nThe sky appears blue due to **Rayleigh scattering**!\n\n1. Sunlight reaches Earth's atmosphere containing all rainbow colors.\n2. Air molecules scatter blue light in every direction because it travels as smaller, shorter waves.\n3. Our eyes see this scattered blue light across the sky during daytime."),
    (r'how do (airplanes|planes) fly', "✈️ **How Do Airplanes Fly?**:\n\nAirplanes fly using **lift, thrust, drag, and weight**:\n\n1. **Wings (Lift)**: Airplane wings are specially curved (airfoils) so air flows faster over the top, creating lower pressure above and pushing the plane up.\n2. **Engines (Thrust)**: Push the plane forward through the air.\n3. **Tail & Rudder**: Steer and balance the plane in mid-air."),
    (r'photosynthesis', "🌱 **Photosynthesis**:\n\nPhotosynthesis is the process by which plants use **sunlight, water, and carbon dioxide** to produce **oxygen** and energy (sugar/glucose) for food!\n\n$$\\text{Water} + \\text{Carbon Dioxide} + \\text{Sunlight} \\rightarrow \\text{Glucose} + \\text{Oxygen}$$"),
    (r'earthquake', "🌍 **What Causes Earthquakes?**:\n\nEarthquakes happen when tectonic plates beneath the Earth's surface suddenly shift or slip past one another, releasing built-up energy in the form of seismic waves that shake the ground."),
    (r'water cycle', "🌧️ **The Water Cycle**:\n\n1. **Evaporation**: Sun heats water turning it into vapor.\n2. **Condensation**: Vapor cools in the atmosphere forming clouds.\n3. **Precipitation**: Rain or snow falls back to Earth.\n4. **Collection**: Water flows into rivers and oceans."),
    (r'gravity|why do objects fall', "🍎 **What is Gravity?**:\n\nGravity is an invisible force that pulls objects toward one another. Earth's gravity pulls everything toward its center, keeping our feet on the ground and creating weight."),
    (r'rainbow', "🌈 **How are Rainbows Formed?**:\n\nRainbows form when sunlight shines through raindrops. Raindrops act like tiny prisms, bending (refracting) light and separating white sunlight into 7 distinct colors: Red, Orange, Yellow, Green, Blue, Indigo, and Violet (ROYGBIV)."),
    (r'why do we sleep', "🌙 **Why Do We Sleep?**:\n\nSleep helps our bodies repair tissues, strengthen our immune system, process memories learned during the day, and recharge our brain for a brand new day!"),
    (r'solar system|planets', "🪐 **The Solar System**:\n\nOur Solar System consists of the Sun and 8 planets revolving around it:\n1. Mercury\n2. Venus\n3. Earth\n4. Mars\n5. Jupiter\n6. Saturn\n7. Uranus\n8. Neptune"),
    (r'dinosaurs?', "🦕 **Dinosaurs**:\n\nDinosaurs were diverse reptiles that dominated Earth during the Mesozoic Era (over 65 million years ago). Famous dinosaurs include Tyrannosaurus Rex, Triceratops, and Velociraptor."),
    (r'albert einstein', "🧠 **Albert Einstein (1879–1955)**:\n\nAlbert Einstein was a world-famous physicist who developed the **Theory of Relativity** and formulated the famous mass-energy equivalence equation:\n\n$$E = mc^2$$\n\nHe won the Nobel Prize in Physics in 1921 for explaining the photoelectric effect."),
    (r'isaac newton', "🍏 **Sir Isaac Newton (1643–1727)**:\n\nSir Isaac Newton was an English mathematician and physicist who formulated the Three Laws of Motion and the Universal Law of Gravitation."),
    (r'marie curie', "🧪 **Marie Curie (1867–1934)**:\n\nMarie Curie was a pioneering physicist and chemist who conducted groundbreaking research on radioactivity. She was the first woman to win a Nobel Prize and the only person to win Nobel Prizes in two different scientific fields (Physics & Chemistry)."),
    (r'\bpython\b', "🐍 **Python Programming Language**:\n\nPython is a versatile, beginner-friendly programming language used for web apps, AI/ML, and automation.\n\n```python\nname = 'Alex'\nprint(f'Hello, {name}! Welcome to Python.')\n```"),
    (r'\bhtml\b|\bcss\b', "🌐 **Web Development (HTML & CSS)**:\n\n- **HTML**: Builds the webpage structure (headings, buttons, paragraphs).\n- **CSS**: Adds colors, fonts, layouts, and animations.\n\n```html\n<h1>Welcome!</h1>\n<button style='color: blue;'>Click Me</button>\n```"),
    (r'\bjavascript\b|\bjs\b', "⚡ **JavaScript**:\n\nJavaScript is the programming language of the web that makes interactive web pages come alive with dynamic behavior, events, and animations."),
    (r'\bapi\b', "🔌 **What is an API?**:\n\nAn **API (Application Programming Interface)** allows different software applications to talk to each other and share data smoothly."),
    (r'\bdatabase\b|\bsql\b|\bmongodb\b', "🗄️ **Databases**:\n\nA database is an organized collection of data stored electronically for fast search and updates.\n- **Relational (SQL)**: Tables with rows & columns.\n- **NoSQL (MongoDB)**: Flexible JSON documents."),
    (r'\brecursio(n|ve)\b', "🔄 **Recursion**:\n\nRecursion is when a function calls itself to solve smaller parts of a problem until reaching a base case.\n\n```python\ndef factorial(n):\n    if n <= 1: return 1\n    return n * factorial(n - 1)\n```"),
    (r'\bbinary search\b', "🔍 **Binary Search**:\n\nA fast algorithm that searches a sorted array by repeatedly dividing the search interval in half in \\(O(\\log N)\\) time."),
    (r'\bvariables?\b', "📦 **Variables**:\n\nA variable is a named storage container in code that holds data values.\n\n```python\nage = 10\nname = 'Sam'\n```"),
    (r'\bloops?\b', "🔁 **Loops**:\n\nLoops repeat code automatically until a condition is met.\n\n```python\nfor i in range(1, 4):\n    print(f'Step {i}')\n```"),
    (r'\bfunctions?\b', "⚙️ **Functions**:\n\nReusable blocks of code that perform a specific task when called.\n\n```python\ndef greet(user):\n    return f'Hello, {user}!'\n```"),
    (r'emotion|feeling|feelings', "😊 **Understanding Emotions**:\n\nEmotions are natural feelings we experience like happy, calm, sad, excited, or frustrated. Observing facial expressions and body language helps us understand how others feel!"),
    (r'friend|friendship|make friends', "🤝 **Making Friends & Social Interaction**:\n\n1. **Greeting**: Say 'Hello!' with a gentle smile.\n2. **Listening**: Give your full attention when someone speaks.\n3. **Sharing**: Take turns during games and activities.\n4. **Kindness**: Use encouraging words!"),
]


def clean_query_for_search(raw_query: str) -> str:
    q = raw_query.strip().rstrip("?").strip()
    starters = [
        r"^who (was|is|were|are)",
        r"^what (is|was|are|were|causes|does|do|mean)",
        r"^why (is|are|does|do|was|were)",
        r"^how (do|does|did|is|are|can)",
        r"^where (is|was|are|were)",
        r"^tell me about",
        r"^explain",
        r"^define",
    ]
    for s in starters:
        q = re.sub(s, "", q, flags=re.IGNORECASE).strip()
    q = re.sub(r"^(the|a|an)\s+", "", q, flags=re.IGNORECASE).strip()
    return q


def fetch_live_knowledge(query: str):
    clean_q = clean_query_for_search(query)
    if not clean_q:
        return None

    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SkillEnhancer/1.0'}
    try:
        s_q = urllib.parse.quote(clean_q)
        s_url = f"https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={s_q}&format=json"
        req = urllib.request.Request(s_url, headers=headers)
        with urllib.request.urlopen(req, timeout=3) as res:
            data = json.loads(res.read().decode('utf-8'))
            results = data.get('query', {}).get('search', [])
            if results:
                best_title = results[0]['title']
                ex_url = f"https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&titles={urllib.parse.quote(best_title)}&format=json"
                req2 = urllib.request.Request(ex_url, headers=headers)
                with urllib.request.urlopen(req2, timeout=3) as res2:
                    d2 = json.loads(res2.read().decode('utf-8'))
                    pages = d2.get('query', {}).get('pages', {})
                    for pid, pinfo in pages.items():
                        extract = pinfo.get('extract', '').strip()
                        if extract and len(extract) > 40:
                            sentences = extract.split('. ')
                            short_ex = '. '.join(sentences[:4]) + '.'
                            return f"📖 **Knowledge Base ({best_title})**:\n\n{short_ex}"
    except Exception:
        pass
    return None


def generate_response(message: str, history=None) -> str:
    if history is None:
        history = []

    if client is not None:
        try:
            messages = [{"role": "system", "content": SYSTEM_PROMPT}]
            for msg in history:
                if isinstance(msg, dict):
                    messages.append({"role": msg.get("role", "user"), "content": msg.get("content", "")})
                elif hasattr(msg, "role") and hasattr(msg, "content"):
                    messages.append({"role": msg.role, "content": msg.content})
            messages.append({"role": "user", "content": message})

            response = client.chat.complete(
                model="mistral-small-latest",
                messages=messages
            )
            return response.choices[0].message.content
        except Exception:
            pass

    math_ans = try_solve_math(message)
    if math_ans:
        return math_ans

    msg = message.lower().strip()
    for pattern, ans in KNOWLEDGE_MAP:
        if re.search(pattern, msg):
            return ans

    live_ans = fetch_live_knowledge(message)
    if live_ans:
        return live_ans

    topic_clean = clean_query_for_search(message)
    topic_title = topic_clean.title() if topic_clean else "Your Question"

    return (
        f"📘 **Learning About {topic_title}**:\n\n"
        f"**{topic_title}** is an exciting topic to explore together!\n\n"
        "**Key Highlights**:\n"
        f"1. **Core Concept**: Exploring **{topic_title}** helps us learn step-by-step.\n"
        "2. **Simple Understanding**: Break down complex questions into small pieces.\n"
        "3. **Practice**: Ask me **\"Give an example\"** or **\"Can we try a quiz?\"** to keep learning!"
    )


# =========================================================
# DYNAMIC SUBJECT, TOPIC & DAILY QUIZ SYSTEM
# =========================================================

SUBJECTS_AND_TOPICS = {
    "Mathematics": ["Addition", "Subtraction", "Multiplication", "Fractions", "Geometry"],
    "Science": ["Solar System", "Plants", "Animals", "Human Body", "Matter"],
    "English": ["Vocabulary", "Grammar", "Phonics", "Spelling", "Reading Comprehension"],
    "Computer Science": ["Coding Concepts", "Python Basics", "Algorithms", "Web Development", "Computers"],
    "General Knowledge": ["World Landmarks", "Animals & Habitats", "Space Exploration", "Famous Inventors", "Everyday Science"]
}

QUIZ_QUESTION_BANK = {
    "Mathematics": {
        "Addition": [
            {"q": "What is 15 + 27?", "options": ["40", "42", "45", "38"], "ans": "42", "exp": "15 plus 27 equals 42.", "hint": "Try adding 15 + 20 first (35), then add 7."},
            {"q": "What is 8 + 9?", "options": ["16", "17", "18", "15"], "ans": "17", "exp": "8 plus 9 equals 17.", "hint": "Think of 8 + 10 = 18, then subtract 1."},
            {"q": "If Sam has 12 apples and gets 14 more, how many apples does Sam have in total?", "options": ["24", "26", "28", "30"], "ans": "26", "exp": "12 + 14 = 26 apples.", "hint": "Add the ones digits (2+4=6) and tens digits (1+1=2)."},
            {"q": "What is 45 + 55?", "options": ["90", "95", "100", "105"], "ans": "100", "exp": "45 plus 55 makes a full 100.", "hint": "40 + 50 = 90, and 5 + 5 = 10."},
            {"q": "What is 120 + 80?", "options": ["190", "200", "210", "220"], "ans": "200", "exp": "120 + 80 = 200.", "hint": "12 + 8 = 20, then add a zero."}
        ],
        "Subtraction": [
            {"q": "What is 50 - 18?", "options": ["30", "32", "34", "28"], "ans": "32", "exp": "50 minus 18 equals 32.", "hint": "50 - 20 = 30, then add 2 back."},
            {"q": "What is 100 - 45?", "options": ["45", "50", "55", "60"], "ans": "55", "exp": "100 minus 45 equals 55.", "hint": "100 - 40 = 60, minus 5 = 55."},
            {"q": "If there are 20 birds on a tree and 7 fly away, how many are left?", "options": ["12", "13", "14", "15"], "ans": "13", "exp": "20 minus 7 equals 13.", "hint": "Count backwards 7 steps from 20."}
        ],
        "Multiplication": [
            {"q": "What is 7 × 8?", "options": ["54", "56", "64", "48"], "ans": "56", "exp": "7 times 8 equals 56.", "hint": "Think of 7 × 7 = 49, then add 7."},
            {"q": "What is 9 × 6?", "options": ["54", "52", "63", "45"], "ans": "54", "exp": "9 times 6 equals 54.", "hint": "10 × 6 = 60, minus 6 = 54."},
            {"q": "What is 12 × 5?", "options": ["50", "55", "60", "65"], "ans": "60", "exp": "12 times 5 equals 60.", "hint": "Count by 5s twelve times."}
        ],
        "Fractions": [
            {"q": "What is 1/2 of 50?", "options": ["20", "25", "30", "15"], "ans": "25", "exp": "Half of 50 is 25.", "hint": "Divide 50 by 2."},
            {"q": "What fraction represents three out of four equal parts?", "options": ["1/4", "1/2", "3/4", "4/3"], "ans": "3/4", "exp": "3 parts out of 4 total is written as 3/4.", "hint": "Numerator is 3, denominator is 4."}
        ],
        "Geometry": [
            {"q": "How many sides does a hexagon have?", "options": ["5", "6", "7", "8"], "ans": "6", "exp": "A hexagon is a polygon with 6 sides.", "hint": "'Hex' stands for six."},
            {"q": "What shape has 3 sides and 3 angles?", "options": ["Square", "Rectangle", "Triangle", "Circle"], "ans": "Triangle", "exp": "A triangle has 3 sides and 3 angles.", "hint": "'Tri' means three."}
        ]
    },
    "Science": {
        "Solar System": [
            {"q": "Which planet is known as the Red Planet?", "options": ["Venus", "Mars", "Jupiter", "Mercury"], "ans": "Mars", "exp": "Mars is called the Red Planet because iron oxide on its surface gives it a reddish color.", "hint": "It is named after the Roman god of war and is the 4th planet from the Sun."},
            {"q": "Which is the largest planet in our Solar System?", "options": ["Saturn", "Jupiter", "Neptune", "Uranus"], "ans": "Jupiter", "exp": "Jupiter is the largest planet, so big that over 1,300 Earths could fit inside!", "hint": "It has a famous Great Red Spot storm."},
            {"q": "Which planet is closest to the Sun?", "options": ["Venus", "Earth", "Mercury", "Mars"], "ans": "Mercury", "exp": "Mercury is the closest planet to the Sun.", "hint": "It is also the smallest planet in our solar system."},
            {"q": "What is the name of the star at the center of our solar system?", "options": ["Sirius", "Polaris", "The Sun", "Proxima Centauri"], "ans": "The Sun", "exp": "The Sun is the star that provides heat and light to our solar system.", "hint": "It shines brightly every day!"}
        ],
        "Plants": [
            {"q": "What process do plants use to make their own food using sunlight?", "options": ["Respiration", "Photosynthesis", "Germination", "Evaporation"], "ans": "Photosynthesis", "exp": "Plants perform photosynthesis using sunlight, water, and carbon dioxide.", "hint": "'Photo' means light and 'synthesis' means putting together."},
            {"q": "Which part of the plant absorbs water and nutrients from the soil?", "options": ["Leaves", "Stem", "Roots", "Flowers"], "ans": "Roots", "exp": "Roots anchor the plant and draw water and nutrients from the soil.", "hint": "They grow under the ground."}
        ],
        "Animals": [
            {"q": "Which animal is the largest mammal on Earth?", "options": ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"], "ans": "Blue Whale", "exp": "The Blue Whale is the largest mammal to ever live on Earth.", "hint": "It lives in the ocean."}
        ],
        "Human Body": [
            {"q": "Which organ pumps blood throughout the human body?", "options": ["Lungs", "Brain", "Heart", "Stomach"], "ans": "Heart", "exp": "The heart beats continuously to pump oxygen-rich blood.", "hint": "It beats inside your chest."}
        ],
        "Matter": [
            {"q": "What are the three common states of matter?", "options": ["Solid, Liquid, Gas", "Hot, Warm, Cold", "Fire, Earth, Air", "Light, Sound, Heat"], "ans": "Solid, Liquid, Gas", "exp": "Matter exists as solid (like ice), liquid (like water), or gas (like steam).", "hint": "Think of ice, water, and steam."}
        ]
    },
    "English": {
        "Vocabulary": [
            {"q": "What is a synonym for 'Happy'?", "options": ["Sad", "Joyful", "Angry", "Tired"], "ans": "Joyful", "exp": "'Joyful' means filled with happiness.", "hint": "It means feeling bright and cheerful."}
        ],
        "Grammar": [
            {"q": "Which of the following is a noun?", "options": ["Quickly", "Run", "Dog", "Beautiful"], "ans": "Dog", "exp": "A noun is a person, place, or thing. 'Dog' is a thing/animal.", "hint": "Nouns name things or animals."}
        ],
        "Phonics": [
            {"q": "What sound does the letter pair 'CH' make in 'Chair'?", "options": ["/sh/", "/ch/", "/k/", "/s/"], "ans": "/ch/", "exp": "'CH' makes the /ch/ sound like in cheese and chair.", "hint": "Think of the start of 'Cheese'."}
        ],
        "Spelling": [
            {"q": "Which is the correct spelling?", "options": ["Beautifull", "Beautiful", "Beautifule", "Beutiful"], "ans": "Beautiful", "exp": "Beautiful ends with a single 'l'.", "hint": "It comes from beauty + ful."}
        ],
        "Reading Comprehension": [
            {"q": "In a story, what is the main character called?", "options": ["Protagonist", "Antagonist", "Author", "Publisher"], "ans": "Protagonist", "exp": "The main hero or center of a story is called the protagonist.", "hint": "It starts with 'Pro'."}
        ]
    },
    "Computer Science": {
        "Coding Concepts": [
            {"q": "What is a container used to store data in code called?", "options": ["Loop", "Variable", "Function", "Bug"], "ans": "Variable", "exp": "A variable stores values like numbers or text.", "hint": "Think of a labeled box holding information."}
        ],
        "Python Basics": [
            {"q": "Which function in Python is used to output text to the screen?", "options": ["display()", "write()", "print()", "output()"], "ans": "print()", "exp": "print('Hello') displays output on the screen in Python.", "hint": "It sounds like printing on paper!"}
        ],
        "Algorithms": [
            {"q": "What is an algorithm?", "options": ["A computer monitor", "A step-by-step set of instructions to solve a problem", "A type of virus", "A keyboard key"], "ans": "A step-by-step set of instructions to solve a problem", "exp": "An algorithm is like a recipe that guides a computer step-by-step.", "hint": "Think of a recipe for baking a cake."}
        ],
        "Web Development": [
            {"q": "Which language provides the basic structure of a webpage?", "options": ["CSS", "HTML", "Python", "SQL"], "ans": "HTML", "exp": "HTML (HyperText Markup Language) creates the structure of web pages.", "hint": "It uses tags like <h1> and <p>."}
        ],
        "Computers": [
            {"q": "What component is known as the 'brain' of the computer?", "options": ["Hard Drive", "CPU", "RAM", "Power Supply"], "ans": "CPU", "exp": "The CPU (Central Processing Unit) performs instructions and calculations.", "hint": "CPU stands for Central Processing Unit."}
        ]
    },
    "General Knowledge": {
        "World Landmarks": [
            {"q": "In which city is the Eiffel Tower located?", "options": ["Rome", "London", "Paris", "New York"], "ans": "Paris", "exp": "The Eiffel Tower is located in Paris, France.", "hint": "It is the capital city of France."}
        ],
        "Animals & Habitats": [
            {"q": "What habitat do penguins naturally live in?", "options": ["Desert", "Rainforest", "Polar / Antarctic region", "Savannah"], "ans": "Polar / Antarctic region", "exp": "Penguins thrive in cold polar waters and ice.", "hint": "They love ice and cold oceans."}
        ],
        "Space Exploration": [
            {"q": "Who was the first human to walk on the Moon in 1969?", "options": ["Buzz Aldrin", "Neil Armstrong", "Yuri Gagarin", "Michael Collins"], "ans": "Neil Armstrong", "exp": "Neil Armstrong took 'one small step for man, one giant leap for mankind' on the Moon.", "hint": "His last name starts with Arm."}
        ],
        "Famous Inventors": [
            {"q": "Who is credited with inventing the light bulb for practical home use?", "options": ["Alexander Graham Bell", "Thomas Edison", "Nikola Tesla", "Benjamin Franklin"], "ans": "Thomas Edison", "exp": "Thomas Edison developed the long-lasting incandescent light bulb.", "hint": "His initials are T.E."}
        ],
        "Everyday Science": [
            {"q": "At what temperature does water boil at sea level in Celsius?", "options": ["50°C", "80°C", "100°C", "120°C"], "ans": "100°C", "exp": "Water boils at 100 degrees Celsius (212°F).", "hint": "It is a round three-digit number."}
        ]
    }
}


def get_available_subjects_and_topics():
    return SUBJECTS_AND_TOPICS


def generate_quiz_questions(subject: str, topic: str, count: int = 5):
    """Generates a dynamic, varied daily quiz based on subject and topic."""
    subj = subject.strip()
    top = topic.strip()

    questions = []
    
    # Try finding exact topic pool
    if subj in QUIZ_QUESTION_BANK and top in QUIZ_QUESTION_BANK[subj]:
        pool = QUIZ_QUESTION_BANK[subj][top]
        questions = list(pool)
    else:
        # Fallback to subject pool
        if subj in QUIZ_QUESTION_BANK:
            for t_name, t_questions in QUIZ_QUESTION_BANK[subj].items():
                questions.extend(t_questions)

    # If pool is smaller than count, auto-generate extra variations
    while len(questions) < count:
        idx = len(questions) + 1
        if subj == "Mathematics":
            a = random.randint(5, 30)
            b = random.randint(5, 30)
            ans_val = a + b
            wrong1 = ans_val + 2
            wrong2 = max(1, ans_val - 3)
            wrong3 = ans_val + 10
            opts = [str(ans_val), str(wrong1), str(wrong2), str(wrong3)]
            random.shuffle(opts)
            questions.append({
                "q": f"What is {a} + {b}?",
                "options": opts,
                "ans": str(ans_val),
                "exp": f"{a} plus {b} equals {ans_val}.",
                "hint": f"Try adding {a} + {b} step by step."
            })
        elif subj == "Science":
            questions.append({
                "q": f"Which of the following is an essential part of studying {top}?",
                "options": ["Observation & Experiments", "Sleeping all day", "Ignoring evidence", "Guessing randomly"],
                "ans": "Observation & Experiments",
                "exp": f"Science uses observation and experiments to test ideas about {top}.",
                "hint": "Scientists gather evidence through experiments."
            })
        else:
            questions.append({
                "q": f"Which concept is key when learning {top} in {subj}?",
                "options": [f"Understanding {top} basics", "Skipping practice", "Memorizing without understanding", "Giving up early"],
                "ans": f"Understanding {top} basics",
                "exp": f"Mastering fundamental concepts helps you succeed in {top}.",
                "hint": "Focus on step-by-step understanding."
            })

    # Shuffle for daily variation using timestamp seed modifier
    today_seed = int(time.time() // 86400) + hash(subj + top)
    rng = random.Random(today_seed)
    rng.shuffle(questions)

    selected = questions[:count]

    formatted = []
    for i, item in enumerate(selected):
        opts = list(item["options"])
        # Ensure correct answer is in options
        if item["ans"] not in opts:
            opts[0] = item["ans"]
        random.shuffle(opts)
        formatted.append({
            "id": i + 1,
            "question": item["q"],
            "options": opts,
            "correct_answer": item["ans"],
            "explanation": item["exp"],
            "hint": item.get("hint", "Read the question carefully and try your best!")
        })

    return formatted


def evaluate_quiz_answer(question: str, user_answer: str, correct_answer: str, explanation: str = "", hint: str = ""):
    """Provides warm, supportive doctor avatar feedback for quiz answers."""
    user_clean = user_answer.strip().lower()
    correct_clean = correct_answer.strip().lower()

    is_correct = (user_clean == correct_clean) or (correct_clean in user_clean) or (user_clean in correct_clean)

    if is_correct:
        encouragements = [
            "Fantastic job! That is completely right!",
            "Spot on! You nailed that question!",
            "Great thinking! You got it correct!",
            "Excellent answer! Keep up the brilliant work!"
        ]
        avatar_speech = f"{random.choice(encouragements)} {explanation}"
        avatar_state = "VICTORY"
    else:
        supportive = [
            "Good try! That wasn't quite right, but learning takes practice.",
            "Nice effort! Not quite, but don't worry at all.",
            "That was a good attempt! Let me help explain this one."
        ]
        avatar_speech = f"{random.choice(supportive)} The correct answer is **{correct_answer}**. {explanation}"
        avatar_state = "TALKING"

    return {
        "is_correct": is_correct,
        "avatar_response": avatar_speech,
        "avatar_state": avatar_state,
        "hint": hint
    }