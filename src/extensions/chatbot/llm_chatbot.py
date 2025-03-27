import os
import re
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEndpoint, HuggingFaceEmbeddings
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain_community.vectorstores import FAISS
import httpx

load_dotenv()

class LLMChatbot:
    def __init__(self):
        self.HF_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
        self.HF_MODEL = "mistralai/Mistral-7B-Instruct-v0.1"
        self.VECTOR_DB_PATH = "src/extensions/chatbot/vector_database"
        self.NODE_API_URL = f"http://localhost:{os.getenv("PORT", 3000)}/api/"
        
        self.llm = self.load_llm()
        self.embedding_model = self.load_embedding_model()
        self.db = self.read_vectors_db()
        self.qa_chain = self.create_qa_chain()

    def load_llm(self):
        return HuggingFaceEndpoint(
            repo_id=self.HF_MODEL,
            temperature=0.01,
            max_new_tokens=1024,
            huggingfacehub_api_token=self.HF_API_KEY
        )

    def load_embedding_model(self):
        return HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

    def read_vectors_db(self):
        return FAISS.load_local(self.VECTOR_DB_PATH, self.embedding_model, allow_dangerous_deserialization=True)
    
    def read_data_from_db(self):
        self.PRODUCTS_API = self.NODE_API_URL + "products/"
        self.REVIEWS_API = self.NODE_API_URL + "reviews/"
        self.WHISTLIST_API = self.NODE_API_URL + ""


    def create_prompt(self):
        template = """<|im_start|>system
        You are a smart virtual assistant. Use the following information to answer the user's question clearly and concisely. Do not use Markdown formatting in the response.

        {context}

        If you don't know the answer or the information is incomplete, don't guess. Reply: "Sorry, I don't have enough information to answer this question." and provide contact information so the user can learn more.

        Make sure the answer is as detailed and concise as possible.<|im_end|>
        <|im_start|>user
        {question}<|im_end|>
        <|im_start|>assistant
        """
        return PromptTemplate(template=template, input_variables=["context", "question"])

    def clean_response(self, response):
        response = re.split(r'<\|im_end\|>', response, maxsplit=1)[0]
        return response.strip()

    def create_qa_chain(self):
        return RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=self.db.as_retriever(search_kwargs={"k": 3}),
            return_source_documents=False,
            chain_type_kwargs={'prompt': self.create_prompt()}
        )

    def get_response(self, question):
        result = self.qa_chain.invoke({"query": question})["result"]
        return self.clean_response(result)

chatbot = LLMChatbot()

question = "What is the best product for gaming?"
answer = chatbot.get_response(question)
print("Chatbot:", answer)
