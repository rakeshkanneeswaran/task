from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_openai import ChatOpenAI
import os
from dotenv import load_dotenv

from langchain_ollama.llms import OllamaLLM

model = OllamaLLM(model="llama3")


load_dotenv()


prompt = PromptTemplate(
    input_variables=["context", "query"],
    template=(
        "Answer the query using only the provided context. "
        "Do not assume information beyond the context. "
        "Respond concisely and in a structured manner without phrases like 'Based on the given context' or 'I can infer'.\n\n"
        "Context:\n{context}\n\n"
        "Query:\n{query}\n\n"
    ),
)

chain = prompt | model


class LLMService:
    @staticmethod
    def generateResponse(context, query):
        response = chain.invoke({"context": context, "query": query})
        return response
