import sys
import os

# Add the root directory to the path so we can import app and services
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app

# Vercel needs the 'app' object to be available at the root level or as 'handler'
handler = app
