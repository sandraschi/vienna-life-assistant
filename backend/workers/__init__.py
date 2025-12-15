"""
Workers Package for Vienna Life Assistant

This package contains Celery workers and background task definitions
for asynchronous processing in the Vienna Life Assistant application.

Modules:
- celery_app: Main Celery application configuration
- tasks: Background task definitions organized by category

Usage:
    from workers.celery_app import celery_app
    from workers.tasks import send_welcome_email, process_long_ai_analysis

    # Start worker
    celery -A workers.celery_app worker --loglevel=info

    # Start beat scheduler
    celery -A workers.celery_app beat --loglevel=info
"""

# Import main components for easy access
from .celery_app import celery_app
from .tasks import *

__all__ = ['celery_app']
