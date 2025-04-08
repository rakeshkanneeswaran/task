from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
import json
import os

model_name = "all-MiniLM-L6-v2"

embeddings = HuggingFaceEmbeddings(model_name=model_name)

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=100,
    chunk_overlap=20,
    length_function=len,
    is_separator_regex=False,
)


class EmbeddingService:
    @staticmethod
    def createVectorStore(texts):
        print(texts)
        vectorstore = FAISS.from_texts(texts, embedding=embeddings)
        print("Vectorstore created")
        return vectorstore

    @staticmethod
    def retrieveText(vectorstore, query):
        retriever = vectorstore.as_retriever()
        retrieved_documents = retriever.invoke(query)
        return retrieved_documents[0].page_content
