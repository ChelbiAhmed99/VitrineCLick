import os
from content_gen import generate_site_content_pro

print("Testing generate_site_content_pro...")
content = generate_site_content_pro("TestComp", "TestDesc", "Tech")
print("\nRESULT:")
print(content)
