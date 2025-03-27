import asyncio
import httpx

NODE_API_URL = "http://localhost:3000/api"

async def get_products():
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{NODE_API_URL}/products")
        if response.status_code == 200:
            return response.json()
        return None  # Tránh lỗi khi API không trả về dữ liệu

# Chạy hàm async
products = asyncio.run(get_products())  # 🟢 Đúng
print(products)
