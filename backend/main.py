from fastapi import FastAPI,Request
from fastapi.middleware.cors import CORSMiddleware
from google import genai
import requests
import time
from bs4 import BeautifulSoup
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("API_KEY")

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://umeshkhanal.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client= genai.Client(
    api_key=API_KEY
)


def get_website_content(url):
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an HTTPError for bad responses (4xx or 5xx)
        # You can return response.text or parse with BeautifulSoup if needed
        soup = BeautifulSoup(response.text, 'html.parser')
        return soup.get_text()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching content from {url}: {e}")
        return None

url = "https://umeshkhanal.vercel.app/"

# Fetch website once
website_content = get_website_content(url)


@app.post("/response")
async def response(request: Request):
    data = await request.json()   # ✅ FIX HERE

    user_question = data.get("question")  # ✅ FIX HERE
    prompt = f"""
You are a smart AI assistant for Umesh Khanal.

You are given website content below. This is the ONLY factual source about him.

Website Content:
{website_content}

User Question:
{user_question}

Your job:
- Understand the user's intent naturally (questions about skills, projects, rating, hiring, contact, etc.)
- Use the website content as your factual knowledge base
- If the question is factual, extract and answer directly from the website
- If the question requires opinion (example: rate him, is he good, should I hire him, best work), use the website information and your own intelligence to give a natural, human-like professional judgment
- If the question is about contact, use website contact info if available, otherwise give:
  "Please contact +971553531996 for assistance."
- If the question is unrelated to Umesh Khanal or his professional profile, respond:
  "Sorry, I can only answer questions related to Umesh Khanal and his website. Please contact +971553531996 for assistance."

Style rules:
- Be natural, human-like, and confident
- Do NOT show reasoning steps or labels
- Do NOT mention “website content” in the answer
- Keep response concise (max 2–3 sentences)
- Do not repeat instructions or question
"""
    #if user_question:
    #    return {"response":"This is example response."}
    
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )


        answer = getattr(response, "text", None)

        if answer:
            return {"response" :answer}
        else:
            return {"response":"Sorry, I couldn't generate a response."}

    except Exception as e:
        error = str(e)

        if "429" in error or "RESOURCE_EXHAUSTED" in error:
            return {"response": "I've reached my current usage limit. Please wait a minute and try again."}

        elif "503" in error or "UNAVAILABLE" in error:
            return {"response": "The AI service is currently busy due to high demand. Please try again in a few moments."}

        elif "401" in error:
            return {"response": "There is an authentication issue with the AI service."}

        elif "404" in error:
            return {"response": "The requested AI model could not be found."}

        else:
            return {"response": "Sorry, I couldn't process your request right now. Please try again later."}

