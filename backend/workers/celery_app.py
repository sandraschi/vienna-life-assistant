"""
Celery Application Configuration for Vienna Life Assistant

This module configures Celery for distributed task processing, allowing
asynchronous execution of background tasks like email sending, data
synchronization, AI processing, and scheduled maintenance tasks.

Celery Architecture:
- Broker: Redis (message queue for tasks)
- Backend: Redis (result storage)
- Workers: Background processes that execute tasks
- Beat: Scheduler for periodic tasks
"""

from celery import Celery
import os
from datetime import timedelta

# Celery app configuration
celery_app = Celery(
    'vienna_life_assistant',
    broker=os.getenv('REDIS_URL', 'redis://redis:6379/0'),
    backend=os.getenv('REDIS_URL', 'redis://redis:6379/0'),
    include=['workers.tasks']
)

# Celery configuration
celery_app.conf.update(
    # Task serialization
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='Europe/Vienna',

    # Worker settings
    worker_prefetch_multiplier=1,  # One task per worker at a time
    task_acks_late=True,           # Tasks acknowledged after completion
    worker_disable_rate_limits=False,

    # Result backend settings
    result_expires=3600,  # Results expire after 1 hour

    # Beat scheduler settings
    beat_schedule={
        'daily-summary': {
            'task': 'workers.tasks.daily_user_summary',
            'schedule': timedelta(hours=24),  # Every 24 hours
        },
        'weekly-report': {
            'task': 'workers.tasks.weekly_activity_report',
            'schedule': timedelta(days=7),    # Every 7 days
        },
        'cleanup-old-data': {
            'task': 'workers.tasks.cleanup_old_conversations',
            'schedule': timedelta(days=30),   # Monthly cleanup
        },
    }
)

# Optional: Configure task routes for different queues
celery_app.conf.task_routes = {
    'workers.tasks.email_tasks.*': {'queue': 'email'},
    'workers.tasks.ai_tasks.*': {'queue': 'ai'},
    'workers.tasks.maintenance_tasks.*': {'queue': 'maintenance'},
}

if __name__ == '__main__':
    celery_app.start()
