from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
import random


model_name = "all-MiniLM-L6-v2"


embeddings = HuggingFaceEmbeddings(model_name=model_name)


class VectorStoreService:
    @staticmethod
    def retrieveText(vectorstore, query):
        retriever = vectorstore.as_retriever(search_kwargs={"k": 5})
        retrieved_documents = retriever.invoke(query)
        if len(retrieved_documents) == 0:
            return "No context found."
        docArray = []

        for doc in retrieved_documents:
            docArray.append(doc.page_content)
        return docArray
