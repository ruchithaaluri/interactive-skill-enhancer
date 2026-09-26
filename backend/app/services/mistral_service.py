import os
import re
import math
import ast
import operator
import json
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

    # Percentage: e.g. "20% of 150" or "15% of 80"
    pct_match = re.search(r'(\d+(?:\.\d+)?)\s*%\s*of\s*(\d+(?:\.\d+)?)', cleaned)
    if pct_match:
        pct = float(pct_match.group(1))
        val = float(pct_match.group(2))
        res = (pct / 100.0) * val
        return f"📐 **Math Solution**:\n\n**{pct:g}% of {val:g}** = **{res:g}**\n\n*Step-by-Step*:\n1. Convert percentage to fraction: \\({pct:g} \\div 100 = {pct/100:g}\\)\n2. Multiply by value: \\({pct/100:g} \\times {val:g} = {res:g}\\)"

    # Square root: e.g. "square root of 144" or "sqrt(144)"
    sqrt_match = re.search(r'(?:square root of|sqrt)\s*(\d+(?:\.\d+)?)', cleaned)
    if sqrt_match:
        val = float(sqrt_match.group(1))
        res = math.sqrt(val)
        return f"📐 **Math Solution**:\n\n\\(\\sqrt{{{val:g}}} = \\mathbf{{{res:g}}}\\)\n\n*Explanation*: \\({res:g} \\times {res:g} = {val:g}\\)."

    # Arbitrary Arithmetic Expression Parser (e.g. 15 + 27, 100 / 4, 12 * 8, (5 + 3) * 10)
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


# Comprehensive Knowledge Base for common educational questions
KNOWLEDGE_MAP = [
    # Geography & Capitals
    (r'capital of france', "🇫🇷 **Capital of France**: **Paris** is the capital and largest city of France, famous for the Eiffel Tower, Louvre Museum, and rich culture."),
    (r'capital of (india|bharat)', "🇮🇳 **Capital of India**: **New Delhi** is the capital of India, seat of all three branches of the Government of India."),
    (r'capital of (usa|united states|america)', "🇺🇸 **Capital of the USA**: **Washington, D.C.** is the capital of the United States of America."),
    (r'capital of (japan)', "🇯🇵 **Capital of Japan**: **Tokyo** is the capital of Japan and the world's most populous metropolitan area."),
    (r'capital of (germany)', "🇩🇪 **Capital of Germany**: **Berlin** is the capital and largest city of Germany."),
    (r'capital of (uk|united kingdom|england)', "🇬🇧 **Capital of the UK**: **London** is the capital city of the United Kingdom."),
    (r'capital of (china)', "🇨🇳 **Capital of China**: **Beijing** is the capital city of China."),
    (r'capital of (canada)', "🇨🇦 **Capital of Canada**: **Ottawa** is the capital city of Canada."),

    # Science & Nature
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

    # Famous Scientists & Historical Figures
    (r'albert einstein', "🧠 **Albert Einstein (1879–1955)**:\n\nAlbert Einstein was a world-famous physicist who developed the **Theory of Relativity** and formulated the famous mass-energy equivalence equation:\n\n$$E = mc^2$$\n\nHe won the Nobel Prize in Physics in 1921 for explaining the photoelectric effect."),
    (r'isaac newton', "🍏 **Sir Isaac Newton (1643–1727)**:\n\nSir Isaac Newton was an English mathematician and physicist who formulated the Three Laws of Motion and the Universal Law of Gravitation."),
    (r'marie curie', "🧪 **Marie Curie (1867–1934)**:\n\nMarie Curie was a pioneering physicist and chemist who conducted groundbreaking research on radioactivity. She was the first woman to win a Nobel Prize and the only person to win Nobel Prizes in two different scientific fields (Physics & Chemistry)."),

    # Coding & Technology
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

    # Social & Behavioral Learning (Autism Support Context)
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
    """Queries live Wikipedia REST API with clean query processing and headers."""
    clean_q = clean_query_for_search(query)
    if not clean_q:
        return None

    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SkillEnhancer/1.0'}
    
    # Search API first to find exact match title
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
                            # Trim long extracts nicely
                            sentences = extract.split('. ')
                            short_ex = '. '.join(sentences[:4]) + '.'
                            return f"📖 **Knowledge Base ({best_title})**:\n\n{short_ex}"
    except Exception:
        pass

    return None


def generate_response(message: str, history=None) -> str:
    if history is None:
        history = []

    # 1. Try Mistral LLM API first if client exists
    if client is not None:
        try:
            messages = [{"role": "system", "content": SYSTEM_PROMPT}]
            for msg in history:
                messages.append({"role": msg.role, "content": msg.content})
            messages.append({"role": "user", "content": message})

            response = client.chat.complete(
                model="mistral-small-latest",
                messages=messages
            )
            return response.choices[0].message.content
        except Exception:
            # Fallback silently to offline/knowledge engine when API rate-limited or offline
            pass

    # 2. Direct Dynamic Math Solver
    math_ans = try_solve_math(message)
    if math_ans:
        return math_ans

    # 3. Fast Pattern Matching in Educational Knowledge Base
    msg = message.lower().strip()
    for pattern, ans in KNOWLEDGE_MAP:
        if re.search(pattern, msg):
            return ans

    # 4. Live Encyclopedic Search (Wikipedia)
    live_ans = fetch_live_knowledge(message)
    if live_ans:
        return live_ans

    # 5. Universal Dynamic Structured Fallback for Any Unseen Question
    topic_clean = clean_query_for_search(message)
    topic_title = topic_clean.title() if topic_clean else "Your Question"

    return (
        f"📘 **Learning About {topic_title}**:\n\n"
        f"**{topic_title}** is an exciting area of study in our learning platform!\n\n"
        "**Key Highlights**:\n"
        f"1. **Core Concept**: Exploring **{topic_title}** builds understanding and critical thinking skills.\n"
        "2. **Step-by-Step Understanding**: Break down complex questions into simpler pieces.\n"
        "3. **Interactive Practice**: Try asking about specific examples or practical applications!\n\n"
        "💡 *Tip*: Ask me **\"Give an example\"** or **\"Explain with steps\"** to dive deeper!"
    )